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

use Flarum\Foundation\ValidationException;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\File;

class Qiniu extends Flysystem implements UploadAdapter
{
    protected function generateUrl(File $file)
    {
        /** @var SettingsRepositoryInterface $settings */
        $settings = app(SettingsRepositoryInterface::class);
        $path = $file->getAttribute('path');
        if ($cdnUrl = $settings->get('fof-upload.cdnUrl')) {
            $file->url = sprintf('%s/%s', $cdnUrl, $path);
        } else {
            throw new ValidationException(['upload' => 'QiNiu cloud CDN address is not configured.']);
        }
    }
}
