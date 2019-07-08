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
use Flagrow\Upload\Helpers\Settings;
use Illuminate\Support\Arr;

class AliyunOss extends Flysystem implements UploadAdapter
{
    /**
     * @param File $file
     */
    protected function generateUrl(File $file)
    {
        /** @var Settings $settings */
        $settings = app()->make(Settings::class);

        if ($cdnUrl = $settings->get('cdnUrl')) {
            $file->url = sprintf('%s/%s', $cdnUrl, $file->url);
        } else {
            $endpoint = $this->adapter->getClient()->endpoint;
            $bucket = $this->adapter->getBucket();

            $baseUrl = sprintf('https://%s.%s.aliyuncs.com/', $bucket, $endpoint ?: 'oss-cn-shanghai');

            $file->url = sprintf(
                $baseUrl.'%s',
                Arr::get($this->meta, 'path', $file->path)
            );
        }
    }
}
