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
use Flarum\Http\UrlGenerator;

class Local extends Flysystem implements UploadAdapter
{
    /**
     * @param File $file
     */
    protected function generateUrl(File $file)
    {
        $searches = [];
        $replaces = [];

        if (is_link($filesDir = public_path('assets/files'))) {
            $searches[] = realpath($filesDir);
            $replaces[] = 'assets/files';
        }

        if (is_link($assetsDir = public_path('assets'))) {
            $searches[] = realpath($assetsDir);
            $replaces[] = 'assets';
        }

        $searches = array_merge($searches, [public_path(), DIRECTORY_SEPARATOR]);
        $replaces = array_merge($replaces, [ '', '/']);

        $file->url = str_replace(
            $searches,
            $replaces,
            $this->adapter->applyPathPrefix($this->meta['path'])
        );

        /** @var Settings $settings */
        $settings = app()->make(Settings::class);
        /** @var UrlGenerator $generator */
        $generator = app()->make(UrlGenerator::class);

        if ($settings->get('cdnUrl')) {
            $file->url = $settings->get('cdnUrl') . $file->url;
        } else {
            $file->url = $generator->to('forum')->path(ltrim($file->url, '/'));
        }
    }
}
