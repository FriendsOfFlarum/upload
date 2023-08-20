<?php

namespace FoF\Upload\Events\File;

use Flarum\User\User;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class IsSlugged
{
    public function __construct(
        public UploadedFile $file,
        public User $user,
        public string $mime,
        public string $slug
    )
    {}
}
