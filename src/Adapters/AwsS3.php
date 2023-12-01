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

class AwsS3 extends Flysystem implements UploadAdapter
{
    protected AdapterInterface $adapter;

    protected function getConfig()
    {
        $config = new Config();
        if ($acl = $this->settings->get('fof-upload.awsS3ACL')) {
            $config->set('ACL', $acl);
        }

        return $config;
    }

    protected function generateUrl(File $file)
    {
        $cdnUrl = (string) $this->settings->get('fof-upload.cdnUrl');

        if (!$cdnUrl) {
            // Ensure that $this->adapter is an instance of AwsS3Adapter
            if ($this->adapter instanceof AwsS3Adapter) {
                $region = $this->adapter->getClient()->getRegion();
                $bucket = $this->adapter->getBucket();

                $cdnUrl = sprintf('https://%s.s3.%s.amazonaws.com', $bucket, $region ?: 'us-east-1');
            } else {
                throw new \RuntimeException('Expected adapter to be an instance of AwsS3Adapter, got '.get_class($this->adapter));
            }
        }

        $file->url = sprintf('%s/%s', $cdnUrl, Arr::get($this->meta, 'path', $file->path));
    }
}
