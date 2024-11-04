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

namespace FoF\Upload\Formatter\TextPreview;

use Flarum\Foundation\Paths;
use FoF\Upload\Repositories\FileRepository;
use s9e\TextFormatter\Renderer;
use s9e\TextFormatter\Utils;

class FormatTextPreview
{
    public function __construct(
        private FileRepository $files,
        private Paths $paths
    ) {
    }

    /**
     * Configure rendering for text preview uploads.
     *
     * @param Renderer $renderer
     * @param mixed    $context
     * @param string   $xml
     *
     * @return string $xml to be rendered
     */
    public function __invoke(Renderer $renderer, $context, string $xml)
    {
        return Utils::replaceAttributes($xml, 'UPL-TEXT-PREVIEW', function ($attributes) {
            $file = $this->files->findByUuid($attributes['uuid']);

            $attributes['has_snippet'] = 'true';
            $snippet = '';

            if ($file) {
                $file_contents = file_get_contents($this->paths->public.'/assets/files/'.$file->path);
                $lines = preg_split('/\R/', $file_contents);
                $lines = array_filter($lines, 'trim');

                if (count($lines) <= 5) {
                    $attributes['has_snippet'] = 'false';
                }

                $snippet = implode("\n", array_slice($lines, 0, 5));
            }

            $attributes['snippet'] = $snippet;

            return $attributes;
        });
    }
}
