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

namespace FoF\Upload\Adapters;

use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\File;
use Illuminate\Support\Arr;

class GoogleCS extends Flysystem implements UploadAdapter
{
    protected function generateUrl(File $file)
    {
        /** @var SettingsRepositoryInterface $settings */
        $settings = app(SettingsRepositoryInterface::class);

        $uploadPrefix = $settings->get('fof-upload.gcsUploadPrefix');

        $filePath = Arr::get($this->meta, 'path', $file->path);

        $path = str_replace('/', '%2F', $uploadPrefix.$filePath);

        $cdnUrl = $settings->get('fof-upload.cdnUrl');

        $file->url = sprintf('https://%s/v0/b/%s/o/%s%s', $cdnUrl ?? 'firebasestorage.googleapis.com', $settings->get('fof-upload.gcsBucketName'), $path, '?alt=media');
    }
}
