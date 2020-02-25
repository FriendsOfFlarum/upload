<?php

namespace FoF\Upload\Events\File;

use FoF\Upload\File;
use Flarum\User\User;
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
     *
     * @var String
     */
    public $mime;

    /**
     * @param User         $actor
     * @param File         $file
     * @param UploadedFile $uploadedFile
     */
    public function __construct(User $actor, File $file, UploadedFile $uploadedFile, String $mime)
    {
        $this->actor = $actor;
        $this->file = $file;
        $this->uploadedFile = $uploadedFile;
        $this->mime = $mime;
    }
}
