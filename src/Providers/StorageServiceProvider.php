<?php

/*
 * This file is part of flagrow/upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */


namespace Flagrow\Upload\Providers;

use Aws\S3\S3Client;
use Flagrow\Upload\Adapters;
use Flagrow\Upload\Commands\UploadHandler;
use Flagrow\Upload\Contracts\UploadAdapter;
use Flagrow\Upload\Helpers\Settings;
use GuzzleHttp\Client as Guzzle;
use Illuminate\Container\Container;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Adapter as FlyAdapters;
use League\Flysystem\AwsS3v3\AwsS3Adapter;
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
        /** @var Settings $settings */
        $settings = $this->app->make(Settings::class);

        /** @var UploadAdapter $uploadAdapter */
        $uploadAdapter = function (Container $app) {
            return $this->instantiateUploadAdapter($app);
        };

        $this->app->when(UploadHandler::class)
            ->needs(UploadAdapter::class)
            ->give($uploadAdapter);

        if ($settings->get('overrideAvatarUpload')) {
            // .. todo
        }
    }

    /**
     * Sets the upload adapter for the specific preferred service.
     *
     * @param          $app
     * @return FilesystemInterface
     */
    protected function instantiateUploadAdapter(Container $app)
    {
        $settings = $app->make(Settings::class);

        switch ($settings->get('uploadMethod', 'local')) {
            case 'aws-s3':
                if (class_exists(S3Client::class)) {
                    return $this->awsS3($settings);
                }
            case 'imgur':
                return $this->imgur($settings);

            default:
                return $this->local($settings);
        }
    }

    protected function awsS3(Settings $settings)
    {
        return new Adapters\AwsS3(
            new Filesystem(
                new AwsS3Adapter(
                    new S3Client([
                        'credentials' => [
                            'key'    => $settings->get('awsS3Key'),
                            'secret' => $settings->get('awsS3Secret'),
                        ],
                        'region'      => empty($settings->get('awsS3Region')) ? null : $settings->get('awsS3Region'),
                        'version'     => 'latest',
                    ]),
                    $settings->get('awsS3Bucket')
                )
            )
        );
    }

    protected function imgur(Settings $settings)
    {
        return new Adapters\Imgur(
            new Guzzle([
                'base_uri' => 'https://api.imgur.com/3/',
                'headers'  => [
                    'Authorization' => 'Client-ID ' . $settings->get('imgurClientId')
                ]
            ])
        );
    }

    /**
     * @param Settings $settings
     * @return Adapters\Local
     */
    protected function local(Settings $settings)
    {
        return new Adapters\Local(
            new Filesystem(
                new FlyAdapters\Local(public_path('assets/files')),
                $settings->get('local', [])
            )
        );
    }
}
