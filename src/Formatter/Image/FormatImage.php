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

use FoF\Upload\File;
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
        if (strpos($xml, '<UPL-IMAGE ') === false) {
            return $xml;
        }

        $uuids = [];

        Utils::replaceAttributes($xml, 'UPL-IMAGE', function ($attributes) use (&$uuids) {
            $uuids[] = Arr::get($attributes, 'uuid');

            return $attributes;
        });

        $files = File::query()->whereIn('uuid', array_filter($uuids))->get()->keyBy('uuid');

        return Utils::replaceAttributes($xml, 'UPL-IMAGE', function ($attributes) use ($files) {
            $file = $files->get(Arr::get($attributes, 'uuid'));

            if ($file) {
                $attributes['url'] = $this->files->getEmbedUrlForFile($file);
            } else {
                unset($attributes['url']);
            }

            return $attributes;
        });
    }
}
