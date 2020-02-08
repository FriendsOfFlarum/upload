<?php

namespace FoF\Upload\Commands;

use Flarum\User\User;
use Illuminate\Support\Collection;

class Upload
{
    /**
     * @var Collection
     */
    public $files;

    /**
     * @var User
     */
    public $actor;

    public function __construct(Collection $files, User $actor)
    {
        $this->files = $files;
        $this->actor = $actor;
    }
}
