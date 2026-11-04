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

    /**
     * Show an image card's file from where it is kept, never from the URL it
     * was posted with.
     */
    public function __invoke(Renderer $renderer, mixed $context, string $xml): string
    {
        if (!str_contains($xml, '<UPL-IMAGE ')) {
            return $xml;
        }

        $files = $this->files->findEmbeddedIn($xml, $context);

        return Utils::replaceAttributes($xml, 'UPL-IMAGE', function (array $attributes) use ($files) {
            $file = EmbeddedFiles::pick($files, Arr::get($attributes, 'uuid'), null);

            if ($file) {
                $attributes['url'] = $this->files->getEmbedUrlForFile($file);
            } else {
                unset($attributes['url']);
            }

            return $attributes;
        });
    }
}
