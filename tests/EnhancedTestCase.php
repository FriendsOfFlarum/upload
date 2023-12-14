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

namespace FoF\Upload\Tests;

use Flarum\Testing\integration\TestCase as BaseTestCase;
use Laminas\Diactoros\ServerRequest;
use Laminas\Diactoros\Stream;
use Laminas\Diactoros\UploadedFile;
use Psr\Http\Message\ServerRequestInterface;

class EnhancedTestCase extends BaseTestCase
{
    protected function request(string $method, string $path, array $options = []): ServerRequestInterface
    {
        // Check if 'multipart' is in options
        if (isset($options['multipart'])) {
            return $this->requestWithMultipart($method, $path, $options);
        }

        // Otherwise, use the parent implementation
        return parent::request($method, $path, $options);
    }

    protected function requestWithMultipart(string $method, string $path, array $options): ServerRequestInterface
    {
        $uploadedFiles = [];
        foreach ($options['multipart'] as $fileData) {
            if (!is_string($fileData['contents'])) {
                throw new \InvalidArgumentException("The 'contents' must be a string file path.");
            }

            $stream = new Stream(fopen($fileData['contents'], 'r+'));
            $uploadedFile = new UploadedFile(
                $stream,
                $stream->getSize(),
                UPLOAD_ERR_OK,
                $fileData['filename'],
                $fileData['type'] ?? 'application/octet-stream'
            );

            $uploadedFiles['files'][] = $uploadedFile; // Adjust here to group files under the 'files' key
        }

        $request = new ServerRequest([], $uploadedFiles, $path, $method);

        // Do we want a JSON request body?
        if (isset($options['json'])) {
            $request = $this->requestWithJsonBody(
                $request,
                $options['json']
            );
        }

        // Authenticate as a given user
        if (isset($options['authenticatedAs'])) {
            $request = $this->requestAsUser(
                $request,
                $options['authenticatedAs']
            );
        }

        return $request;
    }
}
