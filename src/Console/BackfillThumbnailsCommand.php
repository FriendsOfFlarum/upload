<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) FriendsOfFlarum.
 * Copyright (c) Flagrow.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Console;

use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Adapters\Flysystem;
use FoF\Upload\Adapters\Manager;
use FoF\Upload\Downloader\DefaultDownloader;
use FoF\Upload\File;
use Illuminate\Console\Command;
use Intervention\Image\Exceptions\DecoderException;
use Intervention\Image\ImageManager;

class BackfillThumbnailsCommand extends Command
{
    protected $signature = 'fof:upload:backfill-thumbnails
        {--chunk=50 : Number of images to process per batch}
        {--dry-run : Report how many images would be processed without making any changes}
    ';

    protected $description = 'Backfill missing image thumbnails for existing JPEG, PNG, and GIF uploads';

    public function handle(
        DefaultDownloader $downloader,
        ImageManager $imageManager,
        Manager $manager,
        SettingsRepositoryInterface $settings
    ): void {
        $supportedMimes = ['image/jpeg', 'image/png', 'image/gif'];
        $chunkSize = max(1, (int) $this->option('chunk'));
        $dryRun = (bool) $this->option('dry-run');

        $useWebp = (bool) $settings->get('fof-upload.thumbnailWebp', true);
        $maxWidth = max(1, (int) $settings->get('fof-upload.thumbnailMaxWidth', 1200));

        $query = File::query()
            ->whereIn('type', $supportedMimes)
            ->whereNull('thumbnail_url')
            ->whereNotIn('upload_method', ['imgur', 'private-shared']);

        $total = $query->count();

        if ($total === 0) {
            $this->info('All eligible images already have thumbnails. Nothing to do.');

            return;
        }

        if ($dryRun) {
            $this->info("Dry run: $total image(s) would be processed.");

            return;
        }

        $this->info("Processing $total image(s) in chunks of $chunkSize...");

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $updated = 0;
        $skipped = 0;

        $query->chunkById($chunkSize, function ($files) use ($downloader, $imageManager, $manager, $bar, $useWebp, $maxWidth, &$updated, &$skipped) {
            foreach ($files as $file) {
                try {
                    $response = $downloader->download($file);

                    if ($response->getStatusCode() !== 200) {
                        $skipped++;
                        $bar->advance();
                        continue;
                    }

                    $imageData = $response->getBody()->getContents();
                    $thumb = $imageManager->read($imageData);
                    $thumb->scaleDown(width: $maxWidth);

                    $mimeType = $file->type;

                    $thumbEncoded = $useWebp
                        ? $thumb->toWebp(quality: 80)
                        : match ($mimeType) {
                            'image/jpeg' => $thumb->toJpeg(quality: 80),
                            'image/gif'  => $thumb->toGif(),
                            default      => $thumb->toPng(),
                        };

                    $ext = $useWebp ? 'webp' : match ($mimeType) {
                        'image/jpeg' => 'jpg',
                        'image/gif'  => 'gif',
                        default      => 'png',
                    };

                    $adapter = $manager->instantiate($file->upload_method);

                    if (!($adapter instanceof Flysystem)) {
                        $skipped++;
                        $bar->advance();
                        continue;
                    }

                    if ($adapter->storeThumbnail($file, $thumbEncoded->toString(), $ext)) {
                        $file->save();
                        $updated++;
                    } else {
                        $skipped++;
                    }
                } catch (DecoderException $e) {
                    $this->newLine();
                    $this->warn("Skipped {$file->base_name} (uuid: {$file->uuid}): could not decode image — {$e->getMessage()}");
                    $skipped++;
                } catch (\Throwable $e) {
                    $this->newLine();
                    $this->warn("Skipped {$file->base_name} (uuid: {$file->uuid}): {$e->getMessage()}");
                    $skipped++;
                }

                $bar->advance();
            }
        });

        $bar->finish();
        $this->newLine();
        $this->info("Done. Updated: $updated, Skipped: $skipped.");
    }
}
