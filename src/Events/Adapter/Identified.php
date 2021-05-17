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
    /**
     * @var User
     */
    public $actor;

    /**
     * @var UploadedFile
     */
    public $upload;

    /**
     * @var UploadAdapter|null
     */
    public $adapter;

    /**
     * @param User               $actor
     * @param UploadedFile       $upload
     * @param UploadAdapter|null $adapter
     */
    public function __construct(User $actor, UploadedFile $upload, UploadAdapter $adapter = null)
    {
        $this->actor = $actor;
        $this->upload = $upload;
        $this->adapter = $adapter;
    }
}
