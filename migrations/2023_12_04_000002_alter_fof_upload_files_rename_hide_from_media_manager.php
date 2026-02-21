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

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if ($schema->hasColumn('fof_upload_files', 'hide_from_media_manager')
            && !$schema->hasColumn('fof_upload_files', 'hidden')) {
            $schema->table('fof_upload_files', function (Blueprint $table) {
                $table->renameColumn('hide_from_media_manager', 'hidden');
            });
        }
    },
    'down' => function (Builder $schema) {
        if ($schema->hasColumn('fof_upload_files', 'hidden')
            && !$schema->hasColumn('fof_upload_files', 'hide_from_media_manager')) {
            $schema->table('fof_upload_files', function (Blueprint $table) {
                $table->renameColumn('hidden', 'hide_from_media_manager');
            });
        }
    },
];
