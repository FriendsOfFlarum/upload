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

use FoF\Upload\Contracts\TextFormatterTemplate;
use FoF\Upload\File;

abstract class AbstractTextFormatterTemplate extends AbstractTemplate implements TextFormatterTemplate
{
    public function preview(File $file, ?string $displayName = null): string
    {
        $bbcode = $this->bbcode();
        $label = $this->label($file, $displayName);

        return preg_replace_callback_array([
            '/\](?<find>.*)\[/' => function ($m) use ($label) {
                return str_replace($m['find'], $label, $m[0]);
            },
            '/size=(?<find>{.*?})/' => function ($m) use ($file) {
                return str_replace($m['find'], $file->humanSize, $m[0]);
            },
            '/uuid=(?<find>{.*?})/' => function ($m) use ($file) {
                return str_replace($m['find'], $file->uuid, $m[0]);
            },
            '/path=(?<find>{.*?})/' => function ($m) use ($file) {
                return str_replace($m['find'], $file->path, $m[0]);
            },
            '/url=(?<find>{.*?})/' => function ($m) use ($file) {
                return str_replace($m['find'], $file->url, $m[0]);
            },
        ], $bbcode);
    }

    /**
     * Resolve the label rendered as the BBCode body.
     *
     * Falls back to the file name when no display name is supplied, or when the
     * supplied one is effectively empty.
     *
     * The label sits between the opening and closing tags, so it has to survive
     * being embedded in BBCode source: newlines would terminate the body, and a
     * literal closing tag would let the label break out and inject sibling
     * markup. Both are neutralised here rather than relying on the parser, which
     * would simply fail to match the tag and degrade the post to raw text.
     */
    protected function label(File $file, ?string $displayName = null): string
    {
        $displayName = $this->sanitizeDisplayName($displayName);

        return $displayName !== '' ? $displayName : $file->base_name;
    }

    protected function sanitizeDisplayName(?string $displayName): string
    {
        if ($displayName === null) {
            return '';
        }

        // Collapse all whitespace (including newlines) into single spaces.
        $clean = preg_replace('/\s+/u', ' ', $displayName) ?? '';

        // Strip any attempt to close this tag early, in either case.
        $clean = preg_replace('/\[\/?'.preg_quote($this->tag(), '/').'[^\]]*\]/iu', '', $clean) ?? '';

        // Square brackets are what make a BBCode tag; without them the label
        // cannot open or close one, whatever it contains.
        $clean = str_replace(['[', ']'], '', $clean);

        return trim($clean);
    }
}
