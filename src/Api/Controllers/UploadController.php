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

namespace FoF\Upload\Api\Controllers;

use FoF\Upload\Commands\Upload;
use FoF\Upload\Exceptions\InvalidUploadException;
use FoF\Upload\Api\Serializers\FileSerializer;
use Flarum\Api\Controller\AbstractListController;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UploadController extends AbstractListController
{
    public $serializer = FileSerializer::class;

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
     * @param \Tobscure\JsonApi\Document $document
     *
     * @throws InvalidUploadException
     */
    protected function data(ServerRequestInterface $request, Document $document)
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

        return $collection;
    }
}
