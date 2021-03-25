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

use Aws\S3\S3Client;
use Flarum\Foundation\Paths;
use Flarum\Foundation\ValidationException;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Adapters;
use FoF\Upload\Events\Adapter\Collecting;
use FoF\Upload\Events\Adapter\Instantiate;
use FoF\Upload\Helpers\Util;
use Google\Cloud\Storage\StorageClient;
use GuzzleHttp\Client as Guzzle;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use League\Flysystem\Adapter as FlyAdapters;
use League\Flysystem\AwsS3v3\AwsS3Adapter;
use Overtrue\Flysystem\Qiniu\QiniuAdapter;
use Qiniu\Http\Client as QiniuClient;
use Superbalist\Flysystem\GoogleStorage\GoogleStorageAdapter;

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
     * @var Util
     */
    protected $util;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(Dispatcher $events, Paths $paths, Util $util, SettingsRepositoryInterface $settings)
    {
        $this->events = $events;
        $this->paths = $paths;
        $this->util = $util;
        $this->settings = $settings;
    }

    public function adapters(): Collection
    {
        $adapters = Collection::make([
            'aws-s3' => class_exists(S3Client::class),
            'imgur'  => true,
            'qiniu'  => class_exists(QiniuClient::class),
            'local'  => true,
            'gcs'    => class_exists(StorageClient::class),
        ]);

        $this->events->dispatch(new Collecting($adapters));

        return $adapters;
    }

    public function instantiate(string $adapter)
    {
        $configured = $this->adapters()
            // Drops adapters that cannot be instantiated due to missing packages.
            ->filter(function ($available) {
                return $available;
            })
            ->get($adapter);

        if (!$configured) {
            throw new ValidationException(['upload' => "No adapter configured for $adapter"]);
        }

        $method = Str::camel($adapter);

        $driver = $this->events->until(new Instantiate($adapter, $this->util));

        if (!$driver && !method_exists($this, $method)) {
            throw new ValidationException(['upload' => "Cannot instantiate adapter $adapter"]);
        }

        return $driver ?? $this->{$method}($this->util);
    }

    /**
     * @param Util $util
     *
     * @return Adapters\AwsS3
     */
    protected function awsS3(Util $util)
    {
        if (!$this->settings->get('fof-upload.awsS3Key')) {
            return null;
        }

        return new Adapters\AwsS3(
            new AwsS3Adapter(
                new S3Client([
                    'credentials' => [
                        'key'    => $this->settings->get('fof-upload.awsS3Key'),
                        'secret' => $this->settings->get('fof-upload.awsS3Secret'),
                    ],
                    'region'                  => empty($this->settings->get('fof-upload.awsS3Region')) ? null : $this->settings->get('fof-upload.awsS3Region'),
                    'version'                 => 'latest',
                    'endpoint'                => empty($this->settings->get('fof-upload.awsS3Endpoint')) ? null : $this->settings->get('fof-upload.awsS3Endpoint'),
                    'use_path_style_endpoint' => empty($this->settings->get('fof-upload.awsS3UsePathStyleEndpoint')) ? null : (bool) $this->settings->get('fof-upload.awsS3UsePathStyleEndpoint'),
                ]),
                $this->settings->get('fof-upload.awsS3Bucket')
            )
        );
    }

    /**
     * @param Util $util
     *
     * @return Adapters\Imgur
     */
    protected function imgur(Util $util)
    {
        if (!$this->settings->get('fof-upload.imgurClientId')) {
            return null;
        }

        return new Adapters\Imgur(
            new Guzzle([
                'base_uri' => 'https://api.imgur.com/3/',
                'headers'  => [
                    'Authorization' => 'Client-ID '.$this->settings->get('fof-upload.imgurClientId'),
                ],
            ])
        );
    }

    /**
     * @param Util $util
     *
     * @return Adapters\Local
     */
    protected function local(Util $util)
    {
        return new Adapters\Local(
            new FlyAdapters\Local($this->paths->public.'/assets/files')
        );
    }

    /**
     * @param Util $util
     *
     * @return Adapters\Qiniu
     */
    protected function qiniu(Util $util)
    {
        if (!$this->settings->get('fof-upload.qiniuKey')) {
            return null;
        }

        $client = new QiniuAdapter(
            $this->settings->get('fof-upload.qiniuKey'),
            $this->settings->get('fof-upload.qiniuSecret'),
            $this->settings->get('fof-upload.qiniuBucket'),
            $this->settings->get('fof-upload.cdnUrl')
        );

        return new Adapters\Qiniu($client);
    }

    /**
     * @param Util $util
     *
     * @return Adapters\GoogleCS
     */
    protected function gcs(Util $util)
    {
        if (!$this->settings->get('fof-upload.gcsPrivateKey')) {
            return null;
        }

        $storageClient = new StorageClient(
            [
                'keyFile' => [
                    'type'                        => 'service_account',
                    'project_id'                  => $this->settings->get('fof-upload.gcsProjectId'),
                    'private_key_id'              => $this->settings->get('fof-upload.gcsPrivateKeyId'),
                    'private_key'                 => str_replace('\n', "\n", $this->settings->get('fof-upload.gcsPrivateKey')),
                    'client_email'                => $this->settings->get('fof-upload.gcsClientEmail'),
                    'client_id'                   => $this->settings->get('fof-upload.gcsClientId'),
                    'auth_uri'                    => $this->settings->get('fof-upload.gcsAuthUri'),
                    'token_uri'                   => $this->settings->get('fof-upload.gcsTokenUri'),
                    'auth_provider_x509_cert_url' => $this->settings->get('fof-upload.gcsAuthProviderX509CertUrl'),
                    'client_x509_cert_url'        => $this->settings->get('fof-upload.gcsClientX509CertUrl'),
                ],
            ]
        );

        return new Adapters\GoogleCS(
            new GoogleStorageAdapter(
                $storageClient,
                $storageClient->bucket($this->settings->get('fof-upload.gcsBucketName')),
                $this->settings->get('fof-upload.gcsUploadPrefix')
            )
        );
    }
}
