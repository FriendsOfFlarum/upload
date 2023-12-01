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

namespace FoF\Upload\Adapters;

use Flarum\Foundation\Paths;
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\File;
use League\Flysystem\Adapter\Local as AdapterLocal;
use League\Flysystem\AdapterInterface;

class Local extends Flysystem implements UploadAdapter
{
    protected AdapterInterface $adapter;

    protected function generateUrl(File $file): void
    {
        $publicPath = resolve(Paths::class)->public;

        if (!($this->adapter instanceof AdapterLocal)) {
            throw new \RuntimeException('Local adapter is not an instance of League\Flysystem\Adapter\Local');
        }

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

        /** @var UrlGenerator $generator */
        $generator = resolve(UrlGenerator::class);

        /** @var SettingsRepositoryInterface $settings */
        $settings = resolve(SettingsRepositoryInterface::class);

        if ($settings->get('fof-upload.cdnUrl')) {
            $file->url = $settings->get('fof-upload.cdnUrl').$file->url;
        } else {
            $file->url = $generator->to('forum')->path(ltrim($file->url, '/'));
        }
    }
}
