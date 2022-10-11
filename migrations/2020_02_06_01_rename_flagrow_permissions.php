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

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $db = $schema->getConnection();

        $db->table('group_permission')
            ->where('permission', 'flagrow.upload')
            ->update(['permission' => 'fof-upload.upload']);

        $db->table('group_permission')
            ->where('permission', 'flagrow.upload.download')
            ->update(['permission' => 'fof-upload.download']);
    },
    'down' => function (Builder $schema) {
        // Not doing anything but `down` has to be defined
    },
];
