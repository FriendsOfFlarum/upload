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

    protected $description = 'Backfill missing image thumbnails and thumbnail dimensions for existing JPEG, PNG, and GIF uploads';

    public function handle(
        DefaultDownloader $downloader,
        ImageManager $imageManager,
        Manager $manager,
        SettingsRepositoryInterface $settings
    ): void {
        $supportedMimes = ['image/jpeg', 'image/png', 'image/gif'];
        $chunkSize = max(1, (int) $this->option('chunk'));
        $dryRun = (bool) $this->option('dry-run');

        // Defaults for these live in the Settings extender in extend.php, so they
        // are not repeated here — a second default would silently diverge.
        $useWebp = (bool) $settings->get('fof-upload.thumbnailWebp');
        $maxWidth = max(1, (int) $settings->get('fof-upload.thumbnailMaxWidth'));
        $quality = max(1, min(100, (int) $settings->get('fof-upload.thumbnailQuality')));

        // Process any image that is missing its thumbnail, OR that has a thumbnail but is
        // missing its recorded thumbnail dimensions (thumbnails backfilled before the
        // thumbnail_width/thumbnail_height columns existed). Without the dimensions the
        // rendered <img> falls back to the full-image size and upscales the thumbnail.
        $query = File::query()
            ->whereIn('type', $supportedMimes)
            ->whereNotIn('upload_method', ['imgur', 'private-shared'])
            ->where(function ($q) {
                $q->whereNull('thumbnail_url')
                    ->orWhereNull('thumbnail_width')
                    ->orWhereNull('thumbnail_height');
            });

        $total = $query->count();

        if ($total === 0) {
            $this->info('All eligible images already have thumbnails and dimensions. Nothing to do.');

            return;
        }

        if ($dryRun) {
            $this->info("Dry run: $total image(s) would be processed.");

            return;
        }

        $this->info("Processing $total image(s) in chunks of $chunkSize...");

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $generated = 0;
        $dimensionsOnly = 0;
        $skipped = 0;

        $query->chunkById($chunkSize, function ($files) use ($downloader, $imageManager, $manager, $bar, $useWebp, $maxWidth, $quality, &$generated, &$dimensionsOnly, &$skipped) {
            foreach ($files as $file) {
                try {
                    $needsThumbnail = empty($file->thumbnail_url);

                    $response = $downloader->download($file);

                    if ($response->getStatusCode() !== 200) {
                        $skipped++;
                        $bar->advance();
                        continue;
                    }

                    $imageData = $response->getBody()->getContents();
                    $thumb = $imageManager->read($imageData);
                    $thumb->scaleDown(width: $maxWidth);

                    // Record the thumbnail's dimensions regardless of whether we (re)generate
                    // the file — re-scaling the full image with the same settings yields the
                    // dimensions of the existing thumbnail too.
                    $file->thumbnail_width = $thumb->width();
                    $file->thumbnail_height = $thumb->height();

                    // The thumbnail file already exists; just persist the newly-computed
                    // dimensions without re-encoding or re-uploading it.
                    if (!$needsThumbnail) {
                        $file->save();
                        $dimensionsOnly++;
                        $bar->advance();
                        continue;
                    }

                    $mimeType = $file->type;

                    $thumbEncoded = $useWebp
                        ? $thumb->toWebp(quality: $quality)
                        : match ($mimeType) {
                            'image/jpeg' => $thumb->toJpeg(quality: $quality),
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
                        $generated++;
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
        $this->info("Done. Thumbnails generated: $generated, Dimensions backfilled: $dimensionsOnly, Skipped: $skipped.");
    }
}
