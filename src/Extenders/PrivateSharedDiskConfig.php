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

use Flarum\Foundation\Paths;
use Flarum\Http\UrlGenerator;

class PrivateSharedDiskConfig
{
    public function __invoke(Paths $paths, UrlGenerator $url): array
    {
        return [
            'root'       => $paths->storage.'/private-shared/files',
            'visibility' => 'private',
        ];
    }
}
