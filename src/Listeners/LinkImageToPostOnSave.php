<?php

namespace FoF\Upload\Listeners;

use Flarum\Post\Event\Posted;
use Flarum\Post\Event\Revised;
use FoF\Upload\Concerns\MatchingPosts;

class LinkImageToPostOnSave
{
    use MatchingPosts;

    public function handle(Posted|Revised $event)
    {
        $this->matchPosts(fn ($query) => $query->where('posts.id', $event->post->id));
    }
}
