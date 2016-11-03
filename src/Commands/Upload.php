<?php

/*
 * This file is part of flagrow/flarum-ext-file-upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Flagrow\Upload\Commands;

use Flarum\Core\User;
use Psr\Http\Message\UploadedFileInterface;

class Upload
{
    /**
     * @var int
     */
    public $postId;

    /**
     * @var UploadedFileInterface
     */
    public $file;

    /**
     * @var User
     */
    public $actor;

    public function __construct($postId, UploadedFileInterface $file, User $actor)
    {
        $this->postId = $postId;
        $this->file = $file;
        $this->actor = $actor;
    }
}
