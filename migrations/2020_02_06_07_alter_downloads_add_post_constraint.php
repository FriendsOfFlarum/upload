<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        // Set post_id null if the post does not exist.
        // Will prevent issues when applying foriegn key constraint.
        $connection = $schema->getConnection();
        $connection->table('fof_upload_downloads')
            ->whereNotExists(function ($query) {
                $query->selectRaw(1)->from('posts')->whereColumn('post_id', 'id');
            })
            ->update(['post_id' => null]);

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
