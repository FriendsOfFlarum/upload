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

namespace FoF\Upload\Events\File;

use Flarum\User\User;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class IsSlugged
{
    public function __construct(
        public UploadedFile $file,
        public User $user,
        public string $mime,
        public string $slug
    ) {
    }
}
