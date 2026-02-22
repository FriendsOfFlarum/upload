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
        $schema->table('fof_upload_files', function (Blueprint $table) use ($schema) {
            if (!$schema->hasColumn('fof_upload_files', 'image_width')) {
                $table->unsignedInteger('image_width')->nullable();
            }
            if (!$schema->hasColumn('fof_upload_files', 'image_height')) {
                $table->unsignedInteger('image_height')->nullable();
            }
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('fof_upload_files', function (Blueprint $table) {
            $table->dropColumn(['image_width', 'image_height']);
        });
    },
];
