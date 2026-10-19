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

use Flarum\Foundation\KnownError;

/**
 * Storage couldn't supply the file: reported as a bad gateway rather than a
 * server error. A file that simply isn't there is a MissingFileException.
 */
class InvalidDownloadException extends \Exception implements KnownError
{
    public const TYPE = 'fof-upload.download_failed';

    public function getType(): string
    {
        return self::TYPE;
    }
}
