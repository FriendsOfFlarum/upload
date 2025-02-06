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

    protected function addType(string $mime, string $adapter = 'local', string $template = 'just-url')
    {
        $this->setting('fof-upload.mimeTypes', json_encode([
            $mime => [
                'adapter'   => $adapter,
                'template'  => $template,
            ],
        ]));
    }

    protected function giveNormalUserUploadPermission()
    {
        $this->prepareDatabase(
            [
                'group_permission' => [
                    ['group_id' => 3, 'permission' => 'fof-upload.upload'],
                ],
            ]
        );
    }
}
