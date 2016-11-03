<?php

/*
 * This file is part of flagrow/upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */


namespace Flagrow\Upload\Events\File;

use Flagrow\Upload\File;
use Flarum\Core\User;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class WillBeSaved
{
    public $actor;
    public $file;
    public $uploadedFile;

    public function __construct(User $actor, File $file, UploadedFile $uploadedFile)
    {
        $this->actor = $actor;
        $this->file = $file;
        $this->uploadedFile = $uploadedFile;
    }
}
