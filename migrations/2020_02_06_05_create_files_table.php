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
        if ($schema->hasTable('fof_upload_files')) {
            return;
        }

        $schema->create('fof_upload_files', function (Blueprint $table) {
            $table->increments('id');

            $table->unsignedInteger('actor_id')->nullable();
            $table->unsignedInteger('discussion_id')->nullable();
            $table->unsignedInteger('post_id')->nullable();

            $table->string('base_name');
            $table->string('path')->nullable();
            $table->string('url');
            $table->string('type');
            $table->integer('size');

            $table->string('upload_method')->nullable();

            $table->timestamp('created_at');

            $table->string('remote_id')->nullable();
            $table->string('uuid')->nullable();
            $table->string('tag')->nullable();
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('fof_upload_files');
    },
];
