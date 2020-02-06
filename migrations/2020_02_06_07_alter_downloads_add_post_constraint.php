<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('fof_upload_downloads', function (Blueprint $table) {
            $table->foreign('post_id')
                ->references('id')
                ->on('posts')
                ->onDelete('set null');
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('fof_upload_downloads', function (Blueprint $table) {
            $table->dropForeign(['post_id']); // Using array syntax will make Laravel "guess" the index name
        });
    },
];
