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

use Flarum\Foundation\ValidationException;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\File;

class Qiniu extends Flysystem implements UploadAdapter
{
    protected function generateUrl(File $file): void
    {
        $path = $file->getAttribute('path');
        if ($cdnUrl = $this->settings->get('fof-upload.cdnUrl')) {
            $file->url = sprintf('%s/%s', $cdnUrl, $path);
        } else {
            throw new ValidationException(['upload' => 'QiNiu cloud CDN address is not configured.']);
        }
    }
}
