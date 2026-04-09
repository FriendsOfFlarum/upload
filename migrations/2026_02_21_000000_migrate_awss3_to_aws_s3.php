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

return [
    'up' => function (Builder $schema) {
        $schema->getConnection()
            ->table('fof_upload_files')
            ->where('upload_method', 'awss3')
            ->update(['upload_method' => 'aws-s3']);

        $mimeConfiguration = $schema->getConnection()
            ->table('settings')
            ->where('key', 'fof-upload.mimeTypes')
            ->value('value');

        if ($mimeConfiguration) {
            $mimeConfiguration = json_decode($mimeConfiguration, true);

            foreach ($mimeConfiguration as $mime => &$config) {
                if (isset($config['adapter']) && $config['adapter'] === 'awss3') {
                    $config['adapter'] = 'aws-s3';
                }
            }

            $schema->getConnection()
                ->table('settings')
                ->where('key', 'fof-upload.mimeTypes')
                ->update(['value' => json_encode($mimeConfiguration)]);
        }
    },
    'down' => function (Builder $schema) {
        // Do nothing..
    },
];
