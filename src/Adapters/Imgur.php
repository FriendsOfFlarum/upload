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

namespace FoF\Upload\Adapters;

use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\File;
use GuzzleHttp\Client as Guzzle;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class Imgur implements UploadAdapter
{
    public function __construct(
        protected Guzzle $api
    ) {
    }

    public function forMime($mime): bool
    {
        return Str::startsWith($mime, 'image/');
    }

    public function supportsStreams(): bool
    {
        return false;
    }

    /**
     * Attempt to upload to the (remote) filesystem.
     *
     * @param File         $file
     * @param UploadedFile $upload
     * @param string       $contents
     *
     * @return File|bool
     */
    public function upload(File $file, ?UploadedFile $upload, $contents)
    {
        $response = $this->api->post('upload', [
            'multipart' => [
                [
                    'name'     => 'type',
                    'contents' => 'file',
                ],
                [
                    'name'     => 'image',
                    'contents' => $contents,
                    'filename' => $file->base_name,
                ],
            ],
        ]);

        // successful upload, let's get the generated URL
        if ($response->getStatusCode() == 200) {
            $meta = Arr::get(json_decode($response->getBody(), true), 'data', []);

            $link = Arr::get($meta, 'link');

            $file->url = $link;
            $file->remote_id = Arr::get($meta, 'id');
        }

        if ($response->getStatusCode() != 200 || empty($file->url)) {
            return false;
        }

        return $file;
    }

    /**
     * In case deletion is not possible, return false.
     *
     * @param File $file
     *
     * @return File|bool
     */
    public function delete(File $file)
    {
        // TODO: Implement delete() method.

        return false;
    }
}
