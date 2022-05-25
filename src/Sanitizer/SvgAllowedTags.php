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

namespace FoF\Upload\Sanitizer;

use enshrined\svgSanitize\data\AllowedTags;

class SvgAllowedTags extends AllowedTags
{
    public static function getTags(): array
    {
        return array_diff(
            array_merge(parent::getTags(), resolve('fof.upload.sanitizer.svg_allowed_tags')),
            resolve('fof.upload.sanitizer.svg_disallowed_tags')
        );
    }
}
