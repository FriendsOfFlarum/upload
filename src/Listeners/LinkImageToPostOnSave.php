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

namespace FoF\Upload\Listeners;

use Flarum\Post\Event\Posted;
use Flarum\Post\Event\Revised;
use FoF\Upload\Repositories\FileRepository;

class LinkImageToPostOnSave
{
    public function __construct(
        private FileRepository $files
    ) {
    }

    public function handle(Posted|Revised $event): void
    {
        $this->files->matchFilesForPost($event->post);
    }
}
