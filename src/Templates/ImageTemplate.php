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

class ImageTemplate extends AbstractTextFormatterTemplate
{
    protected $tag = 'image';

    public function name(): string
    {
        return $this->trans('fof-upload.admin.templates.image');
    }

    public function description(): string
    {
        return $this->trans('fof-upload.admin.templates.image_description');
    }

    public function template(): View
    {
        return $this->getView('fof-upload.templates::image');
    }

    // thumbnail_url is filled in at render time; it is declared so the template may use it as a src.
    public function bbcode(): string
    {
        return '[upl-image uuid={IDENTIFIER} size={SIMPLETEXT2} url={URL} thumbnail_url={URL?}]{TEXT1}[/upl-image]';
    }

    public function preview(File $file, ?string $displayName = null): string
    {
        $label = $this->label($file, $displayName);

        return "[upl-image uuid={$file->uuid} size={$file->humanSize} url={$file->url}]{$label}[/upl-image]";
    }
}
