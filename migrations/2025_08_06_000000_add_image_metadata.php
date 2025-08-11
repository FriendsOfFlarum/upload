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
    if ($schema->hasTable('fof_upload_image_metadata')) {
        return;
    }
        $schema->create('fof_upload_image_metadata', function (Blueprint $table) {
            $table->unsignedInteger('upload_id');
            $table->uuid('file_id');
            $table->unsignedInteger('image_width');
            $table->unsignedInteger('image_height');

            $table->primary('upload_id');

            // Add foreign key constraint
            $table->foreign('upload_id')
                ->references('id')
                ->on('flarum_fof_upload_files')
                ->onDelete('cascade');
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('fof_upload_image_metadata');
    },
];

