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

use Flarum\Group\Permission;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        Permission::query()
            ->where('permission', 'flagrow.upload')
            ->update(['permission' => 'fof-upload.upload']);
        Permission::query()
            ->where('permission', 'flagrow.upload.download')
            ->update(['permission' => 'fof-upload.download']);
    },
    'down' => function (Builder $schema) {
        // Not doing anything but `down` has to be defined
    },
];
