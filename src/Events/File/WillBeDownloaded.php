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

use FoF\Upload\Download;
use FoF\Upload\File;

class WillBeDownloaded
{
    public function __construct(
        public File $file,
        public mixed &$response,
        public ?Download $download = null
    ) {
    }
}
