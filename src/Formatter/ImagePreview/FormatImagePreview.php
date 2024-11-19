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

namespace FoF\Upload\Formatter\ImagePreview;

use FoF\Upload\Repositories\FileRepository;
use Illuminate\Support\Arr;
use s9e\TextFormatter\Renderer;
use s9e\TextFormatter\Utils;

class FormatImagePreview
{
    public function __construct(
        private FileRepository $files
    ) {
    }

    /**
     * Configure rendering for image preview uploads.
     *
     * @param Renderer $renderer
     * @param mixed    $context
     * @param string   $xml
     *
     * @return string $xml to be rendered
     */
    public function __invoke(Renderer $renderer, $context, string $xml)
    {
        return Utils::replaceAttributes($xml, 'UPL-IMAGE-PREVIEW', function ($attributes) {
            $url = Arr::get($attributes, 'url');
            $uuid = Arr::get($attributes, 'uuid');

            if ($uuid) {
                $file = $this->files->findByUuid($uuid);
            } else {
                $file = $this->files->findByUrl($url);
            }

            if ($file) {
                if ($fileUrl = $this->files->getUrlForFile($file)) {
                    $attributes['url'] = $fileUrl;
                }

                if (Arr::get($attributes, 'alt') === '{TEXT?}') {
                    $attributes['alt'] = '';
                }

                $attributes['title'] = $file->base_name;
            }

            return $attributes;
        });
    }
}
