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
use Illuminate\Database\Eloquent\Builder;

class LinkImageToPostOnSave
{
    private FileRepository $files;

    public function __construct(FileRepository $files)
    {
        $this->files = $files;
    }

    public function handle(Posted|Revised $event)
    {
        $this->files->matchPosts(fn (Builder $query) => $query->where('posts.id', $event->post->id));
    }
}
