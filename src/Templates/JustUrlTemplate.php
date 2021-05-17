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

class JustUrlTemplate extends AbstractTemplate
{
    /**
     * @var string
     */
    protected $tag = 'just-url';

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return $this->trans('fof-upload.admin.templates.just-url');
    }

    /**
     * {@inheritdoc}
     */
    public function description(): string
    {
        return $this->trans('fof-upload.admin.templates.just-url_description');
    }

    /**
     * {@inheritdoc}
     */
    public function preview(File $file): string
    {
        return $file->url;
    }
}
