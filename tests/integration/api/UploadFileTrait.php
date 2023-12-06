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

namespace FoF\Upload\Tests\integration\api;

trait UploadFileTrait
{
    protected function uploadFile(string $path)
    {
        if (!file_exists($path)) {
            throw new \InvalidArgumentException("File not found at path: $path");
        }

        return [
            'name'     => 'files',
            'contents' => $path,
            'filename' => basename($path),
        ];
    }

    protected function fixtures(string $file): string
    {
        return __DIR__.'/../../fixtures/'.$file;
    }
}
