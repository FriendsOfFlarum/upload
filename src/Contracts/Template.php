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

use FoF\Upload\File;

/**
 * The base interface for a file template.
 */
interface Template
{
    /**
     * The unique tag for this template.
     *
     * @return string
     */
    public function tag(): string;

    /**
     * The human readable name of the template.
     *
     * @return string
     */
    public function name(): string;

    /**
     * A clarification of how this template works.
     *
     * @return string
     */
    public function description(): string;

    /**
     * Generates a preview bbcode string.
     *
     * @param File $file
     *
     * @return string
     */
    public function preview(File $file): string;
}
