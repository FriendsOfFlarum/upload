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

use FoF\Upload\Relations\EmbeddedFiles;
use FoF\Upload\Repositories\FileRepository;
use s9e\TextFormatter\Renderer;
use s9e\TextFormatter\Utils;

class FormatTextPreview
{
    public function __construct(
        private FileRepository $files,
        protected TextSnippets $snippets
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
        if (!str_contains($xml, '<UPL-TEXT-PREVIEW')) {
            return $xml;
        }

        $files = $this->files->findEmbeddedIn($xml, $context);

        return Utils::replaceAttributes($xml, 'UPL-TEXT-PREVIEW', function ($attributes) use ($files) {
            $file = EmbeddedFiles::pick($files, $attributes['uuid'] ?? null, null);

            $attributes['has_snippet'] = 'true';
            $snippet = '';

            if ($file) {
                if ($fileUrl = $this->files->getUrlForFile($file)) {
                    $attributes['url'] = $fileUrl;
                }

                $kept = $this->snippets->for($file);

                $attributes['has_snippet'] = $kept && $kept['hasMore'] ? 'true' : 'false';
                $snippet = $kept['snippet'] ?? '';
            }

            $attributes['snippet'] = $snippet;

            return $attributes;
        });
    }
}
