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

use Flarum\Http\UrlGenerator;
use FoF\Upload\Relations\EmbeddedFiles;
use FoF\Upload\Repositories\FileRepository;
use s9e\TextFormatter\Renderer;
use s9e\TextFormatter\Utils;
use Symfony\Contracts\Translation\TranslatorInterface;

class FormatTextPreview
{
    public function __construct(
        private FileRepository $files,
        protected TextSnippets $snippets,
        protected TranslatorInterface $translator,
        protected UrlGenerator $url
    ) {
    }

    public function __invoke(Renderer $renderer, mixed $context, string $xml): string
    {
        if (!str_contains($xml, '<UPL-TEXT-PREVIEW')) {
            return $xml;
        }

        $files = $this->files->findEmbeddedIn($xml, $context);

        return Utils::replaceAttributes($xml, 'UPL-TEXT-PREVIEW', function ($attributes) use ($files) {
            $file = EmbeddedFiles::pick($files, $attributes['uuid'] ?? null, null);

            $attributes['has_snippet'] = 'true';
            $snippet = '';
            $hasMore = false;

            if ($file) {
                if ($fileUrl = $this->files->getUrlForFile($file)) {
                    $attributes['url'] = $fileUrl;
                }

                $kept = $this->snippets->for($file);
                $hasMore = $kept && $kept['hasMore'];

                $attributes['has_snippet'] = $hasMore ? 'true' : 'false';
                $snippet = $kept['snippet'] ?? '';
            }

            $attributes['snippet'] = $snippet;

            // The browser fetches the whole file to expand it, which only works same-origin.
            $attributes['expandable'] = $file && $hasMore && $this->isSameOrigin($attributes['url'] ?? '') ? 'true' : 'false';

            $attributes['empty_text'] = $this->translator->trans($file ? 'fof-upload.forum.text_preview.no_snippet' : 'fof-upload.forum.text_preview.error');
            $attributes['expand_text'] = $this->translator->trans('fof-upload.forum.text_preview.expand');
            $attributes['collapse_text'] = $this->translator->trans('fof-upload.forum.text_preview.collapse');
            $attributes['download_text'] = $this->translator->trans('fof-upload.forum.text_preview.download');

            return $attributes;
        });
    }

    protected function isSameOrigin(string $fileUrl): bool
    {
        $file = parse_url($fileUrl);
        $forum = parse_url($this->url->to('forum')->base());

        if (!$file || !$forum || empty($file['host'])) {
            return false;
        }

        return strtolower($file['scheme'] ?? '') === strtolower($forum['scheme'] ?? '')
            && strtolower($file['host']) === strtolower($forum['host'] ?? '')
            && ($file['port'] ?? null) === ($forum['port'] ?? null);
    }
}
