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

use FoF\Upload\Downloader\DefaultDownloader;
use FoF\Upload\File;
use Illuminate\Console\Command;
use Intervention\Image\Exceptions\DecoderException;
use Intervention\Image\ImageManager;

class BackfillImageDimensionsCommand extends Command
{
    protected $signature = 'fof:upload:backfill-dimensions
        {--chunk=100 : Number of images to process per batch}
        {--dry-run : Report how many images would be processed without making any changes}
    ';

    protected $description = 'Backfill missing image dimensions (width/height) for existing JPEG, PNG, and GIF uploads';

    public function handle(DefaultDownloader $downloader, ImageManager $imageManager): void
    {
        $supportedMimes = ['image/jpeg', 'image/png', 'image/gif'];
        $chunkSize = max(1, (int) $this->option('chunk'));
        $dryRun = (bool) $this->option('dry-run');

        $query = File::query()
            ->whereIn('type', $supportedMimes)
            ->whereNull('image_width');

        $total = $query->count();

        if ($total === 0) {
            $this->info('All eligible images already have dimensions stored. Nothing to do.');

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

        $query->chunkById($chunkSize, function ($files) use ($downloader, $imageManager, $bar, &$updated, &$skipped) {
            foreach ($files as $file) {
                try {
                    $response = $downloader->download($file);

                    if ($response->getStatusCode() !== 200) {
                        $skipped++;
                        $bar->advance();
                        continue;
                    }

                    $imageData = $response->getBody()->getContents();
                    $image = $imageManager->read($imageData);

                    $file->image_width = $image->width();
                    $file->image_height = $image->height();
                    $file->save();

                    $updated++;
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
