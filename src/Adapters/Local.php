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
use FoF\Upload\Driver\Config as UploadConfig;
use FoF\Upload\File;
use League\Flysystem\FilesystemAdapter;
use League\Flysystem\Local\LocalFilesystemAdapter as AdapterLocal;

class Local extends Flysystem implements UploadAdapter
{
    protected FilesystemAdapter $adapter;

    public function __construct(
        FilesystemAdapter $adapter,
        SettingsRepositoryInterface $settings,
        UrlGenerator $url,
        protected ?UploadConfig $uploadConfig = null
    ) {
        parent::__construct($adapter, $settings, $url);
    }

    protected function generateUrl(File $file): void
    {
        $publicPath = resolve(Paths::class)->public;

        if (! ($this->adapter instanceof AdapterLocal)) {
            throw new \RuntimeException('Local adapter is not an instance of League\Flysystem\Local\LocalFilesystemAdapter');
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

        $fullPath = $publicPath.DIRECTORY_SEPARATOR.'assets'.DIRECTORY_SEPARATOR.'files'.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $file->path);

        $file->url = str_replace($searches, $replaces, $fullPath);

        $cdnUrl = $this->uploadConfig ? $this->uploadConfig->getLocalCdnUrl() : $this->settings->get('fof-upload.cdnUrl');
        if ($cdnUrl) {
            $file->url = $cdnUrl.$file->url;
        } else {
            $file->url = $this->url->to('forum')->path(ltrim($file->url, '/'));
        }
    }
}
