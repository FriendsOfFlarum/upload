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

namespace FoF\Upload\Contracts;

use Illuminate\Contracts\View\View;

/**
 * An additional interface for templates that need to be registered in TextFormatter as a bbcode.
 */
interface TextFormatterTemplate
{
    /**
     * The bbcode definition.
     *
     * @return string
     */
    public function bbcode(): string;

    /**
     * The xsl template to use with this tag.
     */
    public function template(): View;
}
