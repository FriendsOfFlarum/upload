<?php

namespace FoF\Upload\Events\File;

use Flarum\User\User;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class IsSlugged
{
    public function __construct(
        public readonly UploadedFile $file,
        public readonly User $user,
        public readonly string $mime,
        public string $slug
    )
    {}
}
