<?php

/*
 * This file is part of flagrow/upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Flagrow\Upload\Api\Controllers;

use Flagrow\Upload\Commands\Upload;
use Flagrow\Upload\Exceptions\InvalidUploadException;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response\JsonResponse;

class UploadController implements RequestHandlerInterface
{
    /**
     * @var Dispatcher
     */
    protected $bus;

    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    /**
     * @param \Psr\Http\Message\ServerRequestInterface $request
     *
     * @throws \Flagrow\Upload\Exceptions\InvalidUploadException
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = $request->getAttribute('actor');
        $files = collect(Arr::get($request->getUploadedFiles(), 'files', []));

        /** @var Collection $collection */
        $collection = $this->bus->dispatch(
            new Upload($files, $actor)
        );

        if ($collection->isEmpty()) {
            throw new InvalidUploadException('No files were uploaded');
        }

        return new JsonResponse($collection->toArray(), 201);
    }
}
