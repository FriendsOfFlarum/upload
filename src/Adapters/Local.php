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

use Flarum\Foundation\Paths;
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\File;

class Local extends Flysystem implements UploadAdapter
{
    protected function generateUrl(File $file)
    {
        $publicPath = app(Paths::class)->public;

        $searches = [];
        $replaces = [];

        if (is_link($filesDir = $publicPath.DIRECTORY_SEPARATOR.'assets/files')) {
            $searches[] = realpath($filesDir);
            $replaces[] = 'assets/files';
        }

        if (is_link($assetsDir = $publicPath.DIRECTORY_SEPARATOR.'assets')) {
            $searches[] = realpath($assetsDir);
            $replaces[] = 'assets';
        }

        $searches = array_merge($searches, [$publicPath, DIRECTORY_SEPARATOR]);
        $replaces = array_merge($replaces, ['', '/']);

        $file->url = str_replace(
            $searches,
            $replaces,
            $this->adapter->applyPathPrefix($this->meta['path'])
        );

        /** @var SettingsRepositoryInterface $settings */
        $settings = app(SettingsRepositoryInterface::class);
        /** @var UrlGenerator $generator */
        $generator = app(UrlGenerator::class);

        if ($settings->get('fof-upload.cdnUrl')) {
            $file->url = $settings->get('fof-upload.cdnUrl').$file->url;
        } else {
            $file->url = $generator->to('forum')->path(ltrim($file->url, '/'));
        }
    }
}
