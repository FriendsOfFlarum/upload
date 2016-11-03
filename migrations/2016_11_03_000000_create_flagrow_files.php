<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('flagrow_files', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('actor_id')->unsigned()->nullable();

            $table->integer('post_id')->unsigned();

            $table->string('base_name');
            $table->string('path')->nullable();
            $table->string('url');
            $table->string('type');
            $table->int('size');

            $table->string('upload_method');

            $table->timestamp('created_at');
        });
    },
    'down' => function (Builder $schema) {
        $schema->drop('flagrow_files');
    }
];