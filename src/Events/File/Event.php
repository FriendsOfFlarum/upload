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
use FoF\Upload\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;

abstract class Event
{
    /**
     * @var User
     */
    public $actor;

    /**
     * @var File
     */
    public $file;

    /**
     * @var UploadedFile
     */
    public $uploadedFile;

    /**
     * @var string
     */
    public $mime;

    /**
     * @param User         $actor
     * @param File         $file
     * @param UploadedFile $uploadedFile
     */
    public function __construct(User $actor, File $file, UploadedFile $uploadedFile, string $mime)
    {
        $this->actor = $actor;
        $this->file = $file;
        $this->uploadedFile = $uploadedFile;
        $this->mime = $mime;
    }
}
