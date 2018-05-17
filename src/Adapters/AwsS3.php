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

        $baseURL = 'https://'.$bucket.'.s3.amazonaws.com/';
        $file->url = $baseUrl . Arr::get($this->meta, 'path', $file->path);
    }
}
