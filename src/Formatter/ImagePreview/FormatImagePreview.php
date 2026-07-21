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

                $attributes['title'] = $file->base_name;

                // Set alt to the filename unless the user provided a custom value.
                // Also handles legacy posts where alt="{TEXT?}" was stored literally.
                $alt = Arr::get($attributes, 'alt', '');
                if (empty($alt) || $alt === '{TEXT?}') {
                    $attributes['alt'] = $file->base_name;
                }

                // Always set thumbnail_url so the template always has a valid src.
                // Derived from thumbnail_path + live hostname so CDN domain changes
                // are reflected automatically, same as getUrlForFile() does for url.
                // Falls back to the main URL when no thumbnail exists (old posts, Imgur, etc.).
                $thumbnailUrl = $this->files->getThumbnailUrlForFile($file);
                $attributes['thumbnail_url'] = $thumbnailUrl ?: $attributes['url'];

                // The <img> loads thumbnail_url as its src, so width/height must describe
                // the thumbnail — otherwise the browser upscales it to the full-image size.
                // Only fall back to the full-image dimensions when no thumbnail is rendered.
                if ($thumbnailUrl && $file->thumbnail_width && $file->thumbnail_height) {
                    $attributes['width'] = $file->thumbnail_width;
                    $attributes['height'] = $file->thumbnail_height;
                } elseif ($file->image_width && $file->image_height) {
                    $attributes['width'] = $file->image_width;
                    $attributes['height'] = $file->image_height;
                }
            }

            return $attributes;
        });
    }
}
