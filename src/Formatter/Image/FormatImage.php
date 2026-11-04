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
     *
     * @param Renderer $renderer
     * @param mixed    $context
     * @param string   $xml
     *
     * @return string $xml to be rendered
     */
    public function __invoke(Renderer $renderer, $context, string $xml)
    {
        return Utils::replaceAttributes($xml, 'UPL-IMAGE', function ($attributes) {
            $file = $this->files->findByUuid(Arr::get($attributes, 'uuid'));

            if ($file) {
                $attributes['url'] = $this->files->getUrlForFile($file) ?: $file->url;
            } else {
                unset($attributes['url']);
            }

            return $attributes;
        });
    }
}
