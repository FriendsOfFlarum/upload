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

        $groups = $db->table('group_permission')
            ->where('permission', 'fof-upload.deleteUserUploads')
            ->pluck('group_id');

        foreach ($groups as $gid) {
            foreach ([
                'fof-upload.deleteOtherUsersUploads',
                'fof-upload.hideOtherUsersUploads',
            ] as $perm) {
                $db->table('group_permission')->updateOrInsert(
                    ['group_id' => $gid, 'permission' => $perm],
                    []
                );
            }
        }
    },

    'down' => function (Builder $schema) {
        $schema->getConnection()
            ->table('group_permission')
            ->whereIn('permission', [
                'fof-upload.deleteOtherUsersUploads',
                'fof-upload.hideOtherUsersUploads',
            ])
            ->delete();
    },
];
