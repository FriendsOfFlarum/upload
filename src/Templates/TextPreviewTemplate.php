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

namespace FoF\Upload\Templates;

use FoF\Upload\File;
use Illuminate\Contracts\View\View;

class TextPreviewTemplate extends AbstractTextFormatterTemplate
{
    /**
     * @var string
     */
    protected $tag = 'text-preview';

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return $this->trans('fof-upload.admin.templates.text-preview');
    }

    /**
     * {@inheritdoc}
     */
    public function description(): string
    {
        return $this->trans('fof-upload.admin.templates.text-preview_description');
    }

    public function template(): View
    {
        return $this->getView('fof-upload.templates::text-preview');
    }

    /**
     * {@inheritdoc}
     */
    public function bbcode(): string
    {
        return '[upl-text-preview uuid={IDENTIFIER} url={URL} has_snippet={SIMPLETEXT?} snippet={SIMPLETEXT?}]{SIMPLETEXT1}[/upl-text-preview]';
    }

    public function preview(File $file): string
    {
        return "[upl-text-preview uuid={$file->uuid} url={$file->url} has_snippet=false]{$file->base_name}[/upl-text-preview]";
    }
}
