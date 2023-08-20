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

use Illuminate\Database\Schema\Builder;

function setAwsUploadedFilesAdapterDelimiter(Builder $schema, string $old = '_', string $new = '-')
{
    $schema
        ->getConnection()
        ->table('fof_upload_files')
        ->where('upload_method', "aws{$old}s3")
        ->update(['upload_method' => "aws{$new}s3"]);
}

return [
    'up' => function (Builder $schema) {
        setAwsUploadedFilesAdapterDelimiter($schema, '_', '-');
    },
    'down' => function (Builder $schema) {
        setAwsUploadedFilesAdapterDelimiter($schema, '-', '_');
    },
];
