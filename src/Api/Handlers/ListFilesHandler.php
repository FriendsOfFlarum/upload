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

namespace FoF\Upload\Api\Handlers;

use Flarum\Api\JsonApi;
use FoF\Upload\Api\Resource\FileResource;
use Laminas\Diactoros\Uri;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ListFilesHandler implements RequestHandlerInterface
{
    public function __construct(
        protected JsonApi $api
    ) {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $uri = $request->getUri();
        $path = $uri->getPath();
        $queryParams = $request->getQueryParams();

        if (str_contains($path, 'shared-files')) {
            $queryParams['filter'] = ($queryParams['filter'] ?? []) + ['shared' => true];
            $request = $request->withQueryParams($queryParams);
        }

        $request = $request->withUri($uri->withPath('/files'));

        return $this->api
            ->forResource(FileResource::class)
            ->forEndpoint('index')
            ->handle($request);
    }
}
