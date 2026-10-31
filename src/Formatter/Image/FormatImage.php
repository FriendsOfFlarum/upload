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

namespace FoF\Upload\Formatter\Image;

use FoF\Upload\Relations\EmbeddedFiles;
use FoF\Upload\Repositories\FileRepository;
use Illuminate\Support\Arr;
use s9e\TextFormatter\Renderer;
use s9e\TextFormatter\Utils;

class FormatImage
{
    public function __construct(
        private FileRepository $files
    ) {
    }

    public function __invoke(Renderer $renderer, mixed $context, string $xml): string
    {
        if (!str_contains($xml, '<UPL-IMAGE ')) {
            return $xml;
        }

        $files = $this->files->findEmbeddedIn($xml, $context);

        return Utils::replaceAttributes($xml, 'UPL-IMAGE', function ($attributes) use ($files) {
            // Typed into the BBCode by hand, these must never reach the template.
            unset($attributes['thumbnail_url'], $attributes['width'], $attributes['height']);

            $file = EmbeddedFiles::pick($files, Arr::get($attributes, 'uuid'), Arr::get($attributes, 'url'));

            if (!$file) {
                return $attributes;
            }

            if ($fileUrl = $this->files->getUrlForFile($file)) {
                $attributes['url'] = $fileUrl;
            }

            $thumbnailUrl = $this->files->getThumbnailUrlForFile($file);

            if ($thumbnailUrl) {
                $attributes['thumbnail_url'] = $thumbnailUrl;
            }

            if ($thumbnailUrl && $file->thumbnail_width && $file->thumbnail_height) {
                $attributes['width'] = $file->thumbnail_width;
                $attributes['height'] = $file->thumbnail_height;
            } elseif ($file->image_width && $file->image_height) {
                $attributes['width'] = $file->image_width;
                $attributes['height'] = $file->image_height;
            }

            return $attributes;
        });
    }
}
