<?php
namespace Flagrow\Upload\Adapters;

use Flagrow\Upload\Contracts\UploadAdapter;
use Flagrow\Upload\File;
use Flagrow\Upload\Helpers\Settings;
use Flarum\Foundation\ValidationException;

/**
 *
 */
class Qiniu extends Flysystem implements UploadAdapter
{

    /**
     * @param File $file
     */
    protected function generateUrl(File $file)
    {
        /** @var Settings $settings */
        $settings = app()->make(Settings::class);
        $path     = $file->getAttribute('path');
        if ($cdnUrl = $settings->get('cdnUrl')) {
            $file->url = sprintf('%s/%s', $cdnUrl, $path);
        } else {
            throw new ValidationException(['upload' => 'QiNiu cloud CDN address is not configured.']);

        }
    }
}
