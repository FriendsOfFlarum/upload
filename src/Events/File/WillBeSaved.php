<?php

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