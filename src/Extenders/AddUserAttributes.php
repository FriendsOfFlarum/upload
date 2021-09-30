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

use Flarum\Api\Serializer\UserSerializer;
use Flarum\User\User;
use FoF\Upload\File;

class AddUserAttributes
{
    public function __invoke(UserSerializer $serializer, User $user, array $attributes): array
    {
        $attributes['fof-upload-uploadCountCurrent'] = File::where('actor_id', $user->id)->where('hide_from_media_manager', false)->count();
        $attributes['fof-upload-uploadCountAll'] = File::where('actor_id', $user->id)->count();

        return $attributes;
    }
}
