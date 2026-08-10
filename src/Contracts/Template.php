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
     * $displayName optionally overrides the label shown to readers. Templates
     * that render a label should use it in place of the file name; the rest
     * may ignore it. Implementations added before this parameter existed remain
     * signature-compatible, since it is optional.
     *
     * @param File        $file
     * @param string|null $displayName
     *
     * @return string
     */
    public function preview(File $file, ?string $displayName = null): string;
}
