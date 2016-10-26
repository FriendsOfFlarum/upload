<?php
/*
 * This file is part of flagrow/flarum-ext-file-upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Flagrow\Upload\Providers;

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Container\Container;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use League\Flysystem\FilesystemInterface;

class StorageServiceProvider extends ServiceProvider
{

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
    }

    /**
     * Sets the upload adapter for the specific preferred service.
     *
     * @param $app
     * @return FilesystemInterface
     */
    protected function instantiateUploadAdapter($app)
    {
        $settings = $app->make('flarum.settings');
        switch ($settings->get('flagrow.upload.uploadMethod', 'local')) {
        }
    }
}
