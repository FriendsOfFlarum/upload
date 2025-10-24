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

    /**
     * Get the configuration settings for the S3 adapter.
     *
     * @return Config
     */
    protected function getConfig(): Config
    {
        $config = new Config();
        if ($acl = $this->settings->get('fof-upload.awsS3ACL')) {
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
        // Fetch custom S3 URL from settings
        $customUrl = $this->settings->get('fof-upload.awsS3CustomUrl');
        if (!empty($customUrl)) {
            return $customUrl;
        }

        // Fallback to default URL construction if no custom URL is provided
        $cdnUrl = (string) $this->settings->get('fof-upload.cdnUrl');
        if (!empty($cdnUrl)) {
            return $cdnUrl;
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
