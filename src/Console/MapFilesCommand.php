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

use Carbon\Carbon;
use FoF\Upload\File;
use FoF\Upload\Repositories\FileRepository;
use Illuminate\Console\Command;

class MapFilesCommand extends Command
{
    protected $signature = 'fof:upload
        {--map : Tries to map uploaded files to posts}
        {--cleanup : Cleans unused uploaded files from storage}
        {--cleanup-before= : Orphaned files before this date are removed (default 1 day ago, format "yyyy-mm-dd" or "now", "today" etc)}
        {--force : Run cleanup without confirmation}
        ';
    protected $description = 'Helps restore mapping of uploaded files to their relative posts';

    public function handle(FileRepository $files): void
    {
        $map = $this->option('map');
        $cleanup = $this->option('cleanup');
        $force = $this->option('force');

        if ($map) {
            $mapped = $files->matchPosts();

            $this->info("$mapped matches have been modified between files and posts.");
        }

        if (!$map && $cleanup && !$force && !$this->confirm('Are you sure you want to clean up without mapping first?')) {
            $this->info('Run mapping first then.');
        }

        if ($cleanup) {
            $before = $this->option('cleanup-before')
                ? Carbon::parse($this->option('cleanup-before'))
                : Carbon::now()->subDay();

            $deleted = $files->cleanUp(
                $before,
                $force
                    ? null
                    : fn (File $file) => $this->confirm("Delete $file->url (stored on '$file->upload_method' at path '$file->path')?")
            );

            $this->info("$deleted unused uploaded files cleaned up from before $before.");
        }
    }
}
