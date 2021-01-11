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

namespace FoF\Upload\Events\File;

use FoF\Upload\File;

class WasLoaded
{
    /**
     * @var File
     */
    public $file;

    public function __construct(File $file)
    {
        $this->file = $file;
    }
}
