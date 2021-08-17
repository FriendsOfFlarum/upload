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

class BbcodeImageTemplate extends AbstractTemplate
{
    /**
     * @var string
     */
    protected $tag = 'bbcode-image';

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return $this->trans('fof-upload.admin.templates.bbcode-image');
    }

    /**
     * {@inheritdoc}
     */
    public function description(): string
    {
        return $this->trans('fof-upload.admin.templates.bbcode-image_description');
    }

    /**
     * {@inheritdoc}
     */
    public function preview(File $file): string
    {
        return '[URL='.$file->url.'][IMG]'.$file->url.'[/IMG][/URL]';
    }
}
