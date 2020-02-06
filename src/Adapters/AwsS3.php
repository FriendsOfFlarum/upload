<?php

namespace FoF\Upload\Adapters;

use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\File;
use FoF\Upload\Helpers\Settings;
use Illuminate\Support\Arr;

class AwsS3 extends Flysystem implements UploadAdapter
{
    protected function generateUrl(File $file)
    {
        /** @var Settings $settings */
        $settings = app()->make(Settings::class);

        if ($cdnUrl = $settings->get('cdnUrl')) {
            $file->url = sprintf('%s/%s', $cdnUrl, $file->url);
        } else {
            $region = $this->adapter->getClient()->getRegion();
            $bucket = $this->adapter->getBucket();

            $baseUrl = sprintf('https://%s.s3.%s.amazonaws.com/', $bucket, $region ?: 'us-east-1');

            $file->url = sprintf(
                $baseUrl . '%s',
                Arr::get($this->meta, 'path', $file->path)
            );
        }
    }
}
