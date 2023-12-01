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

use FoF\Upload\Helpers\Util;

class Instantiate
{
    public function __construct(
        public string $adapter,
        public Util $util
    ) {
    }
}
