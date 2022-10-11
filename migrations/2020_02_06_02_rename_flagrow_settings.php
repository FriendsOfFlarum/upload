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
        $db = $schema->getConnection();

        foreach ([
            'maxFileSize',
            'mimeTypes',
            'templates',
            'mustResize',
            'resizeMaxWidth',
            'cdnUrl',
            'addsWatermarks',
            'watermarkPosition',
            'watermark',
            'overrideAvatarUpload',
            'imgurClientId',
            'awsS3Key',
            'awsS3Secret',
            'awsS3Bucket',
            'awsS3Region',
            'disableHotlinkProtection',
            'disableDownloadLogging',
            'qiniuKey',
            'qiniuSecret',
            'qiniuBucket',
        ] as $key) {
            $db->table('settings')
                ->where('key', 'flagrow.upload.'.$key)
                ->update(['key' => 'fof-upload.'.$key]);
        }
    },
    'down' => function (Builder $schema) {
        // Not doing anything but `down` has to be defined
    },
];
