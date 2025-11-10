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

use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\Driver\Config as UploadConfig;
use FoF\Upload\File;
use Illuminate\Support\Arr;
use League\Flysystem\AdapterInterface;
use League\Flysystem\AwsS3v3\AwsS3Adapter;
use League\Flysystem\Config;

/**
 * @method hostName() This is only available on the AWS S3 adapter at present.
 */
class AwsS3 extends Flysystem implements UploadAdapter
{
    protected AdapterInterface $adapter;

    public function __construct(
        AdapterInterface $adapter,
        $settings,
        $url,
        protected ?UploadConfig $uploadConfig = null
    ) {
        parent::__construct($adapter, $settings, $url);
    }

    /**
     * Get the configuration settings for the S3 adapter.
     *
     * @return Config
     */
    protected function getConfig(): Config
    {
        $config = new Config();
        $acl = $this->uploadConfig ? $this->uploadConfig->getS3Acl() : $this->settings->get('fof-upload.awsS3ACL');
        if ($acl) {
            $config->set('ACL', $acl);
        }

        return $config;
    }

    /**
     * Generate the URL for the given file.
     *
     * @param File $file
     *
     * @return void
     */
    protected function generateUrl(File $file): void
    {
        $host = $this->hostName();

        $file->url = sprintf('%s/%s', rtrim($host, '/'), Arr::get($this->meta, 'path', $file->path));
    }

    /**
     * Determine the hostname of the storage adapter.
     *
     * @throws \RuntimeException If the adapter is not an instance of AwsS3Adapter.
     *
     * @return string
     */
    public function hostName(): string
    {
        // Fetch custom S3 URL from config (ENV or settings)
        $customUrl = $this->uploadConfig ? $this->uploadConfig->getS3CustomUrl() : $this->settings->get('fof-upload.awsS3CustomUrl');
        if (!empty($customUrl)) {
            return $customUrl;
        }

        // Fallback to default URL construction if no custom URL is provided
        $cdnUrl = $this->uploadConfig ? $this->uploadConfig->getS3CdnUrl() : $this->settings->get('fof-upload.cdnUrl');
        if (!empty($cdnUrl)) {
            return (string) $cdnUrl;
        }

        // Ensure that $this->adapter is an instance of AwsS3Adapter
        if ($this->adapter instanceof AwsS3Adapter) {
            $region = $this->adapter->getClient()->getRegion();
            $bucket = $this->adapter->getBucket();

            return sprintf('https://%s.s3.%s.amazonaws.com', $bucket, $region ?: 'us-east-1');
        }

        throw new \RuntimeException('Expected adapter to be an instance of AwsS3Adapter, got '.get_class($this->adapter));
    }
}
