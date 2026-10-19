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

namespace FoF\Upload\Exceptions;

/**
 * The file's record exists but its stored object doesn't.
 */
class MissingFileException extends InvalidDownloadException
{
    public function getType(): string
    {
        return 'not_found';
    }
}
