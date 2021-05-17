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

use Illuminate\Support\Collection;

class Collecting
{
    /**
     * @var Collection
     */
    public $adapters;

    public function __construct(Collection &$adapters)
    {
        $this->adapters = &$adapters;
    }
}
