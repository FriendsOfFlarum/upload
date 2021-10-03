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
        $schema->create('fof_upload_mimes', function (Blueprint $table) {
            $table->increments('id');

            $table->string('regex');
            $table->string('template');
            $table->string('adapter');
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('fof_upload_mimes');
    },
];
