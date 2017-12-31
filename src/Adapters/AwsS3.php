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
        $region = $this->adapter->getClient()->getRegion();
        $bucket = $this->adapter->getBucket();

        $baseUrl = in_array($region, [null, 'us-east-1']) ?
            sprintf('http://%s.s3-website-us-east-1.amazonaws.com/', $bucket) :
            sprintf('http://%s.s3-website-%s.amazonaws.com/', $bucket, $region);

        $file->url = sprintf(
            $baseUrl . '%s',
            Arr::get($this->meta, 'path', $file->path)
        );
    }
}
