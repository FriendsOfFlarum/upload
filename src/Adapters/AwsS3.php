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

namespace Flagrow\Upload\Adapters;

use Flagrow\Upload\Contracts\UploadAdapter;
use Flagrow\Upload\File;
use Illuminate\Support\Arr;

class AwsS3 extends Flysystem implements UploadAdapter
{
    /**
     * @param File $file
     */
    protected function generateUrl(File $file)
    {
        /** @var Settings $settings */
        $settings = app()->make(Settings::class);

        if ($settings->get('cdnUrl')) {
            $cdnUrl = $settings->get('cdnUrl');
            $file->url = vsprintf('%s/%s', [$cdnUrl, $file->url]);
        } else {
            $region = $this->adapter->getClient()->getRegion();
            $bucket = $this->adapter->getBucket();

            $baseUrl = in_array($region, [null, 'us-east-1']) ?
                sprintf('https://%s.s3-website-us-east-1.amazonaws.com/', $bucket) :
                sprintf('https://%s.s3-website-%s.amazonaws.com/', $bucket, $region);

            $file->url = sprintf(
                $baseUrl . '%s',
                Arr::get($this->meta, 'path', $file->path)
            );
        }
    }
}
