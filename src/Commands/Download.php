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

namespace FoF\Upload\Commands;

use Flarum\User\User;

class Download
{
    public function __construct(
        public string $uuid,
        public User $actor,
        public ?int $discussionId = null,
        public ?int $postId = null
    ) {
    }
}
