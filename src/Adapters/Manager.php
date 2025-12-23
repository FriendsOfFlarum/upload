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

use Aws\S3\S3Client;
use Flarum\Foundation\Paths;
use Flarum\Foundation\ValidationException;
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Adapters;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\Driver\Config;
use FoF\Upload\Events\Adapter\Collecting;
use FoF\Upload\Events\Adapter\Instantiate;
use FoF\Upload\Helpers\Util;
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
    public function __construct(
        protected Dispatcher $events,
        protected Paths $paths,
        protected Util $util,
        protected SettingsRepositoryInterface $settings,
        protected UrlGenerator $url,
        protected Config $config
    ) {
    }

    public function adapters(): Collection
    {
        $adapters = Collection::make([
            'aws-s3' => class_exists(S3Client::class),
            // TODO: Flarum 2.0 - Remove 'awss3' backward compatibility entry.
            //       This was added to fix a bug where 'awss3' was registered but had no method.
            //       Both 'aws-s3' and 'awss3' now map to the same awsS3() method.
            //       For 2.0: Remove this line and update migrations to convert all 'awss3' to 'aws-s3'.
            'awss3'  => class_exists(S3Client::class),
            'imgur'  => true,
            'qiniu'  => class_exists(QiniuClient::class),
            'local'  => true,
        ]);

        $this->events->dispatch(new Collecting($adapters));

        return $adapters;
    }

    public function instantiate(string $adapter): UploadAdapter
    {
        $adapters = $this->adapters()
            // Drops adapters that cannot be instantiated due to missing packages.
            ->filter(function ($available) {
                return $available;
            });

        $configured = $adapters->get($adapter);

        // TODO: Flarum 2.0 - Remove this backward compatibility check.
        //       Problem: Old files in database may have upload_method='awss3' while admin forces 'aws-s3', or vice versa.
        //       Solution: Treat both adapter names as equivalent when one is forced.
        //       For 2.0: Remove this block after ensuring all databases use 'aws-s3' consistently.
        if (!$configured && in_array($adapter, ['aws-s3', 'awss3'])) {
            $alternativeAdapter = $adapter === 'aws-s3' ? 'awss3' : 'aws-s3';
            $configured = $adapters->get($alternativeAdapter);
        }

        if (!$configured) {
            throw new ValidationException(['upload' => "No adapter configured for $adapter"]);
        }

        // TODO: Flarum 2.0 - Remove this normalization.
        //       Both 'awss3' and 'aws-s3' map to awsS3() method because Str::camel('awss3') doesn't add capital S.
        //       For 2.0: Remove this line when 'awss3' is no longer supported.
        $normalizedAdapter = $adapter === 'awss3' ? 'aws-s3' : $adapter;
        $method = Str::camel($normalizedAdapter);

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
        $config = $this->config->getS3Config();

        $s3Config = [
            'region'                  => $config['region'],
            'version'                 => 'latest',
            'endpoint'                => $config['endpoint'],
            'use_path_style_endpoint' => $config['use_path_style_endpoint'],
        ];

        // Only explicitly provide credentials if available.
        // Otherwise S3Client will attempt to use instance profile.
        if (isset($config['credentials'])) {
            $s3Config['credentials'] = $config['credentials'];
        }

        $leagueAdapter = new AwsS3Adapter(
            new S3Client($s3Config),
            $config['bucket']
        );

        return new Adapters\AwsS3($leagueAdapter, $this->settings, $this->url, $this->config);
    }

    /**
     * @param Util $util
     *
     * @return Adapters\Imgur|null
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
            new FlyAdapters\Local($this->paths->public.'/assets/files'),
            $this->settings,
            $this->url,
            $this->config
        );
    }

    /**
     * @param Util $util
     *
     * @return Adapters\Qiniu|null
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

        return new Adapters\Qiniu($client, $this->settings, $this->url);
    }
}
