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

use Flarum\Foundation\ValidationException;
use FoF\Upload\Adapters\Flysystem;
use FoF\Upload\File;
use FoF\Upload\Helpers\Util;
use Illuminate\Console\Command;
use League\Flysystem\FilesystemException;

/**
 * Hiding a shared image used to leave its thumbnail on the public disk. Hiding
 * also overwrote upload_method, so the disk a leftover is on is inferred from
 * the file's type: the object is confirmed there before it's deleted, and what
 * can't be found is reported rather than guessed at.
 */
class PurgePrivateThumbnailsCommand extends Command
{
    protected $signature = 'fof:upload:purge-private-thumbnails
        {--dry-run : List the thumbnails that would be removed without changing anything}
    ';

    protected $description = 'Remove the public thumbnails left behind by shared images that were made private';

    public function handle(Util $util): void
    {
        $dryRun = (bool) $this->option('dry-run');
        $removed = 0;
        $problems = 0;

        File::query()
            ->where('shared', true)
            ->where('hidden', true)
            ->whereNotNull('thumbnail_path')
            ->each(function (File $file) use ($util, $dryRun, &$removed, &$problems) {
                $label = "{$file->base_name} (#{$file->id}, {$file->thumbnail_path})";

                try {
                    $adapter = $util->getAdapterForMime($file->type);
                } catch (ValidationException) {
                    $adapter = null;
                }

                if (!$adapter instanceof Flysystem) {
                    $this->warn("Skipped $label: no storage adapter is configured for {$file->type}.");
                    $problems++;

                    return;
                }

                $where = $adapter->adapterKey ?: class_basename($adapter);

                try {
                    $exists = $adapter->exists($file->thumbnail_path);
                } catch (FilesystemException $e) {
                    $this->error("Could not check $label on $where: {$e->getMessage()}");
                    $problems++;

                    return;
                }

                if (!$exists) {
                    $this->warn("Thumbnail of $label not found on $where; left as is.");
                    $problems++;

                    return;
                }

                if ($dryRun) {
                    $this->line("Would remove the thumbnail of $label from $where.");
                    $removed++;

                    return;
                }

                $thumbnail = clone $file;
                $thumbnail->path = $file->thumbnail_path;

                if ($adapter->delete($thumbnail) === false) {
                    $this->error("Could not delete the thumbnail of $label from $where.");
                    $problems++;

                    return;
                }

                $file->thumbnail_path = null;
                $file->thumbnail_url = null;
                $file->thumbnail_width = null;
                $file->thumbnail_height = null;
                $file->save();

                $this->line("Removed the thumbnail of $label from $where.");
                $removed++;
            });

        $this->info(sprintf(
            '%s %d thumbnail(s); %d need attention.',
            $dryRun ? 'Would remove' : 'Removed',
            $removed,
            $problems
        ));
    }
}
