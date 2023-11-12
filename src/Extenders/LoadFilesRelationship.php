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
            $loadable = (new User())->newCollection($data->pluck('user'))->filter();
        }

        if ($loadable) {
            $loadable->loadCount('foffiles');
            $loadable->loadCount('foffilesCurrent');
        }
    }
}
