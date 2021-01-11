<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) 2020 - 2021 FriendsOfFlarum.
 * Copyright (c) 2016 - 2019 Flagrow
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Formatter;

use FoF\Upload\Helpers\Util;
use FoF\Upload\Repositories\FileRepository;
use s9e\TextFormatter\Parser;

/**
 * Adds support for flagrow/upload pre-0.6 file tags
 * Format was either $file-766cc417-aba7-46f0-b032-cb5b2be2d66c or $image-766cc417-aba7-46f0-b032-cb5b2be2d66c
 * In 0.6 up to 0.7 they were still supported as deprecated
 * The FoF package no longer includes the deprecated templates, but will replace existing old tags with the new bbcode when saving.
 */
class ReplaceDeprecatedTemplates
{
    /**
     * @var Util
     */
    protected $util;

    /**
     * @var FileRepository
     */
    protected $repository;

    public function __construct(Util $util, FileRepository $repository)
    {
        $this->Util = $util;
        $this->repository = $repository;
    }

    public function __invoke(Parser $parser, $content, string $text): string
    {
        return preg_replace_callback('/\$(file|image)\-([a-z0-9-]{36})/', function ($matches) {
            $file = $this->repository->findByUuid($matches[2]);

            // If the file doesn't exist, leave the text untouched
            if (!$file) {
                return $matches[0];
            }

            if ($matches[1] === 'file') {
                $template = $this->util->getTemplate('file');
            } else {
                $template = $this->util->getTemplate('image');
            }

            return $template->preview($file);
        }, $text);
    }
}
