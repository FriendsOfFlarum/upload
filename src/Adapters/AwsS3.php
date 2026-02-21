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

use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\Driver\Config as UploadConfig;
use FoF\Upload\File;
use Illuminate\Support\Arr;
use League\Flysystem\Config;
use League\Flysystem\FilesystemAdapter;

/**
 * @method hostName() This is only available on the AWS S3 adapter at present.
 */
class AwsS3 extends Flysystem implements UploadAdapter
{
    protected FilesystemAdapter $adapter;

    public function __construct(
        FilesystemAdapter $adapter,
        SettingsRepositoryInterface $settings,
        UrlGenerator $url,
        protected ?UploadConfig $uploadConfig = null,
        protected ?string $bucket = null,
        protected ?string $region = null
    ) {
        parent::__construct($adapter, $settings, $url);
    }

    /**
     * Get the configuration settings for the S3 adapter.
     */
    protected function getConfig(): Config
    {
        $acl = $this->uploadConfig ? $this->uploadConfig->getS3Acl() : $this->settings->get('fof-upload.awsS3ACL');

        return $acl ? (new Config())->extend(['ACL' => $acl]) : new Config();
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

        // Use bucket and region passed from Manager
        if ($this->bucket !== null && $this->region !== null) {
            return sprintf('https://%s.s3.%s.amazonaws.com', $this->bucket, $this->region ?: 'us-east-1');
        }

        throw new \RuntimeException('AwsS3 adapter requires bucket and region for URL generation');
    }
}
