<?php

namespace FoF\Upload\Adapters;

use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\File;
use FoF\Upload\Helpers\Settings;
use Flarum\Foundation\ValidationException;

class Qiniu extends Flysystem implements UploadAdapter
{
    protected function generateUrl(File $file)
    {
        /** @var Settings $settings */
        $settings = app()->make(Settings::class);
        $path = $file->getAttribute('path');
        if ($cdnUrl = $settings->get('cdnUrl')) {
            $file->url = sprintf('%s/%s', $cdnUrl, $path);
        } else {
            throw new ValidationException(['upload' => 'QiNiu cloud CDN address is not configured.']);
        }
    }
}
