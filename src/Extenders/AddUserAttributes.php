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

class AddUserAttributes
{
    public function __invoke(UserSerializer $serializer, User $user, array $attributes): array
    {
        /** @phpstan-ignore-next-line */
        $attributes['fof-upload-uploadCountCurrent'] = $user->foffiles_current_count;
        /** @phpstan-ignore-next-line */
        $attributes['fof-upload-uploadCountAll'] = $user->foffiles_count;

        return $attributes;
    }
}
