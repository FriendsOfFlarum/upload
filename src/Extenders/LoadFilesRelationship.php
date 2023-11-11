<?php

namespace FoF\Upload\Extenders;

use Flarum\Api\Controller\ListDiscussionsController;
use Flarum\Api\Controller\ListPostsController;
use Flarum\User\User;

class LoadFilesRelationship
{
    public static function countRelations($controller, $data): void
    {
        $loadable = null;

        if ($data instanceof User) {
            $loadable = $data;
        } elseif (is_array($data) && isset($data['actor'])) {
            $loadable = $data['actor'];
        } elseif ($controller instanceof ListPostsController || $controller instanceof ListDiscussionsController) {
            $loadable = (new User)->newCollection($data->pluck('user'));
        }

        if ($loadable) {
            $loadable->loadCount('foffiles');
            $loadable->loadCount('foffilesCurrent');
        }
    }
}
