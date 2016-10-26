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

use Flagrow\Upload\Commands\UploadHandler;
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

        $uploadAdapter = function (Container $app) {
            return $this->instantiateUploadAdapter($app);
        };

        $this->app->when(UploadHandler::class)
            ->needs(FilesystemInterface::class)
            ->give($uploadAdapter);
    }

    /**
     * Sets the upload adapter for the specific preferred service.
     *
     * @param $app
     * @return FilesystemInterface
     */
    protected function instantiateUploadAdapter($app)
    {
        /** @var SettingsRepositoryInterface $settings */
        $settings = $app->make('flarum.settings');

        switch ($settings->get('flagrow.upload.uploadMethod', 'local')) {
            default:
                // Instantiate flysystem with local adapter.
                return new Filesystem(
                    new Local(public_path('assets/images')),
                    $settings->get('flagrow.upload.local', [])
                );
        }
    }
}
