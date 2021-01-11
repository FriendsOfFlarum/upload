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

namespace FoF\Upload\Providers;

use Flarum\Foundation\AbstractServiceProvider;
use FoF\Upload\Helpers\Util;

class UtilProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->app->singleton(Util::class);
    }
}
