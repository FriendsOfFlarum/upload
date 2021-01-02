<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
 * Copyright (c) 2016 - 2019 Flagrow
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Adapters;

use Aws\S3\S3Client;
use Flarum\Foundation\Paths;
use FoF\Upload\Adapters;
use FoF\Upload\Events\Adapter\Collecting;
use FoF\Upload\Helpers\Settings;
use GuzzleHttp\Client as Guzzle;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use League\Flysystem\Adapter as FlyAdapters;
use League\Flysystem\AwsS3v3\AwsS3Adapter;
use Overtrue\Flysystem\Qiniu\QiniuAdapter;
use Qiniu\Http\Client as QiniuClient;

class Manager
{
    /**
     * @var Paths
     */
    protected $paths;
    /**
     * @var Dispatcher
     */
    protected $events;
    /**
     * @var Settings
     */
    protected $settings;

    public function __construct(Dispatcher $events, Paths $paths, Settings $settings)
    {
        $this->events = $events;
        $this->paths = $paths;
        $this->settings = $settings;
    }

    public function adapters(): Collection
    {
        $adapters = Collection::make([
            'aws-s3' => class_exists(S3Client::class),
            'imgur'  => true,
            'qiniu'  => class_exists(QiniuClient::class),
            'local'  => true,
        ]);

        $this->events->dispatch(new Collecting($adapters));

        return $adapters;
    }

    public function instantiate()
    {
        return $this->adapters()
            ->filter(function ($available) {
                return $available;
            })
            ->map(function ($_, $adapter) {
                $method = Str::camel($adapter);

                return $this->{$method}($this->settings);
            });
    }

    /**
     * @param Settings $settings
     *
     * @return Adapters\AwsS3
     */
    protected function awsS3(Settings $settings)
    {
        return new Adapters\AwsS3(
            new AwsS3Adapter(
                new S3Client([
                    'credentials' => [
                        'key'    => $settings->get('awsS3Key'),
                        'secret' => $settings->get('awsS3Secret'),
                    ],
                    'region'                  => empty($settings->get('awsS3Region')) ? null : $settings->get('awsS3Region'),
                    'version'                 => 'latest',
                    'endpoint'                => empty($settings->get('awsS3Endpoint')) ? null : $settings->get('awsS3Endpoint'),
                    'use_path_style_endpoint' => empty($settings->get('awsS3UsePathStyleEndpoint')) ? null : (bool) $settings->get('awsS3UsePathStyleEndpoint'),
                ]),
                $settings->get('awsS3Bucket')
            )
        );
    }

    /**
     * @param Settings $settings
     *
     * @return Adapters\Imgur
     */
    protected function imgur(Settings $settings)
    {
        return new Adapters\Imgur(
            new Guzzle([
                'base_uri' => 'https://api.imgur.com/3/',
                'headers'  => [
                    'Authorization' => 'Client-ID '.$settings->get('imgurClientId'),
                ],
            ])
        );
    }

    /**
     * @param Settings $settings
     *
     * @return Adapters\Local
     */
    protected function local(Settings $settings)
    {
        return new Adapters\Local(
            new FlyAdapters\Local($this->paths->public.'/assets/files')
        );
    }

    /**
     * @param Settings $settings
     *
     * @return Adapters\Qiniu
     */
    protected function qiniu(Settings $settings)
    {
        $client = new QiniuAdapter(
            $settings->get('qiniuKey'),
            $settings->get('qiniuSecret'),
            $settings->get('qiniuBucket'),
            $settings->get('cdnUrl')
        );

        return new Adapters\Qiniu($client);
    }
}
