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
        $schema->table('fof_upload_files', function (Blueprint $table) {
            $table->index(['actor_id', 'hidden', 'shared']);
            $table->index('shared');
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('fof_upload_files', function (Blueprint $table) {
            $table->dropIndex(['actor_id', 'hidden', 'shared']);
            $table->dropIndex(['shared']);
        });
    },
];
