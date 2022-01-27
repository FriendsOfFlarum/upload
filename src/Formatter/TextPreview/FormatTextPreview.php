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
use Symfony\Contracts\Translation\TranslatorInterface;

class FormatTextPreview
{
    /**
     * @var FileRepository
     */
    private $files;

    /**
     * @var TranslatorInterface
     */
    private $translator;

    /**
     * @var Paths
     */
    private $paths;

    public function __construct(FileRepository $files, TranslatorInterface $translator, Paths $paths)
    {
        $this->files = $files;
        $this->translator = $translator;
        $this->paths = $paths;
    }

    /**
     * Configure rendering for text preview uploads.
     *
     * @param s9e\TextFormatter\Renderer $renderer
     * @param mixed                      $context
     * @param string|null                $xml
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

                $file_contents_normalised = str_replace(["\r\n", "\r", "\n"], "\n", $file_contents);

                // automatically normalises line endings
                $lines = explode("\n", $file_contents_normalised);
                $first_five_lines = array_slice($lines, 0, 5);
                $snippet = implode("\n", $first_five_lines);

                if ($snippet !== $file_contents_normalised) {
                    $attributes['has_snippet'] = 'false';
                }
            }

            $attributes['snippet'] = $snippet;

            return $attributes;
        });
    }
}
