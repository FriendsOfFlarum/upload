<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) 2020 - 2021 FriendsOfFlarum.
 * Copyright (c) 2016 - 2019 Flagrow
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

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
