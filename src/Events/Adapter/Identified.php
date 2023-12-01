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

namespace FoF\Upload\Events\Adapter;

use Flarum\User\User;
use FoF\Upload\Contracts\UploadAdapter;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class Identified
{
    public function __construct(
        public User $actor,
        public UploadedFile $upload,
        public ?UploadAdapter $adapter = null
    ) {
    }
}
