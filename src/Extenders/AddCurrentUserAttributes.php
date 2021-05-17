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

use Flarum\Api\Serializer\CurrentUserSerializer;
use Flarum\User\User;

class AddCurrentUserAttributes
{
    public function __invoke(CurrentUserSerializer $serializer, User $user, array $attributes): array
    {
        $actor = $serializer->getActor();

        if ($viewOthers = $actor->hasPermission('fof-upload.viewUserUploads')) {
            $attributes['fof-upload-viewOthersMediaLibrary'] = $viewOthers;
        }

        if ($deleteOthers = $actor->hasPermission('fof-upload.deleteUserUploads')) {
            $attributes['fof-upload-deleteOthersMediaLibrary'] = $deleteOthers;
        }

        return $attributes;
    }
}
