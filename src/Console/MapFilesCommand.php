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

use FoF\Upload\Repositories\FileRepository;
use Illuminate\Console\Command;

class MapFilesCommand extends Command
{
    protected $signature = 'fof:upload
        {--map : Tries to map uploaded files to posts}
        {--cleanup : Cleans unused uploaded files from storage}';
    protected $description = 'Helps restore mapping of uploaded files to their relative posts';

    public function handle(FileRepository $files)
    {
        if ($this->option('map')) {
            $mapped = $files->matchPosts();

            $this->info("$mapped files have been matched against posts.");
        }

        if ($this->option('cleanup')) {
            $deleted = $files->cleanUp();

            $this->info("$deleted unused uploaded files cleaned up.");
        }
    }
}
