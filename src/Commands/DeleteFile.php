<?php

namespace FoF\Upload\Commands;

use Flarum\User\User;
use FoF\Upload\File;

class DeleteFile
{
    public function __construct(
        public File $file,
        public User $actor
    ) {
    }
}
