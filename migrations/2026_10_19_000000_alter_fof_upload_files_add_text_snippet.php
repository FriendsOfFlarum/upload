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

// The first lines a text preview shows, kept so rendering never reads the
// file again. A null snippet hasn't been worked out yet.
return [
    'up' => function (Builder $schema) {
        $schema->table('fof_upload_files', function (Blueprint $table) use ($schema) {
            if (!$schema->hasColumn('fof_upload_files', 'text_snippet')) {
                $table->text('text_snippet')->nullable();
            }
            if (!$schema->hasColumn('fof_upload_files', 'text_snippet_has_more')) {
                $table->boolean('text_snippet_has_more')->nullable();
            }
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('fof_upload_files', function (Blueprint $table) {
            $table->dropColumn(['text_snippet', 'text_snippet_has_more']);
        });
    },
];
