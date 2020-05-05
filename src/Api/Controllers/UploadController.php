<?php

namespace FoF\Upload\Api\Controllers;

use FoF\Upload\Commands\Upload;
use FoF\Upload\Exceptions\InvalidUploadException;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

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
     * @throws InvalidUploadException
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
