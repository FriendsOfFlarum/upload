<?php

namespace FoF\Upload\Listeners;

use Flarum\Post\Event\Posted;
use Flarum\Post\Event\Revised;
use FoF\Upload\Repositories\FileRepository;

class LinkImageToPostOnSave
{
    private FileRepository $files;

    public function __construct(FileRepository $files)
    {
        $this->files = $files;
    }

    public function handle(Posted|Revised $event)
    {
        $this->files->matchPosts(fn ($query) => $query->where('posts.id', $event->post->id));
    }
}
