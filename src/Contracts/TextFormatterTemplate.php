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

namespace FoF\Upload\Contracts;

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
     *
     * @return string
     */
    public function template(): string;
}
