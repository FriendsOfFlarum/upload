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
        $schema->create('fof_upload_file_posts', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedInteger('file_id')->nullable();
            $table->unsignedInteger('post_id')->nullable();

            $table
                ->foreign('post_id')
                ->references('id')
                ->on('posts')
                ->cascadeOnDelete();
            $table
                ->foreign('file_id')
                ->references('id')
                ->on('fof_upload_files')
                ->cascadeOnDelete();
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('fof_upload_file_posts');
    },
];
