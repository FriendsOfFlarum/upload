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
        try {
            $schema->table('fof_upload_files', function (Blueprint $table) {
                $table->dropIndex(['actor_id', 'hide_from_media_manager']);
            });
        } catch (\Illuminate\Database\QueryException $e) {
            // Index may not exist (e.g. fresh install, or schema already migrated)
            $msg = $e->getMessage();
            if (strpos($msg, '1091') === false && strpos($msg, "Can't DROP") === false
                && strpos($msg, 'no such index') === false && strpos($msg, 'does not exist') === false) {
                throw $e;
            }
        }
    },
    'down' => function (Builder $schema) {
        $schema->table('fof_upload_files', function (Blueprint $table) {
            $table->index(['actor_id', 'hide_from_media_manager']);
        });
    },
];
