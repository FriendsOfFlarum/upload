<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) 2020 - 2021 FriendsOfFlarum.
 * Copyright (c) 2016 - 2019 Flagrow
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        /**
         * @var $settings SettingsRepositoryInterface
         */
        $settings = app(SettingsRepositoryInterface::class);

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
            $value = $settings->get('flagrow.upload.'.$key);

            if (!is_null($value)) {
                $settings->set('fof-upload.'.$key, $value);
                $settings->delete('flagrow.upload.'.$key);
            }
        }
    },
    'down' => function (Builder $schema) {
        // Not doing anything but `down` has to be defined
    },
];
