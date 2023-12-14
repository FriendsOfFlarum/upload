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
use FoF\Upload\File;

class DeleteFile
{
    public function __construct(
        public File $file,
        public User $actor
    ) {
    }
}
