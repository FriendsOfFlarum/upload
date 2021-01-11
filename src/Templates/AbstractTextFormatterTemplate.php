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

namespace FoF\Upload\Templates;

use FoF\Upload\Contracts\TextFormatterTemplate;
use FoF\Upload\File;

abstract class AbstractTextFormatterTemplate extends AbstractTemplate implements TextFormatterTemplate
{
    public function preview(File $file): string
    {
        $bbcode = $this->bbcode();

        return preg_replace_callback_array([
            '/\](?<find>.*)\[/' => function ($m) use ($file) {
                return str_replace($m['find'], $file->base_name, $m[0]);
            },
            '/size=(?<find>{.*?})/' => function ($m) use ($file) {
                return str_replace($m['find'], $file->humanSize, $m[0]);
            },
            '/uuid=(?<find>{.*?})/' => function ($m) use ($file) {
                return str_replace($m['find'], $file->uuid, $m[0]);
            },
            '/url=(?<find>{.*?})/' => function ($m) use ($file) {
                return str_replace($m['find'], $file->url, $m[0]);
            },
        ], $bbcode);
    }
}
