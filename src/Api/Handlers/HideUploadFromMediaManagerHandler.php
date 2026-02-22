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

use Flarum\Api\Context;
use Flarum\Api\JsonApi;
use Flarum\Api\Serializer;
use Flarum\Foundation\ValidationException;
use Flarum\Http\RequestUtil;
use FoF\Upload\Api\Resource\FileResource;
use FoF\Upload\File;
use FoF\Upload\Helpers\Util;
use Illuminate\Support\Arr;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

use function Tobyz\JsonApiServer\json_api_response;

class HideUploadFromMediaManagerHandler implements RequestHandlerInterface
{
    public function __construct(
        protected JsonApi $api,
        protected Util $util
    ) {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $uuid = Arr::get($request->getParsedBody(), 'uuid');

        if (empty($uuid)) {
            throw new ValidationException(['uuid' => 'UUID cannot be empty.']);
        }

        /** @var File $fileUpload */
        $fileUpload = File::byUuid($uuid)->firstOrFail();
        $actor->assertCan('hide', $fileUpload);

        if ($fileUpload->getAttribute('shared')) {
            $fileUpload = $this->moveStorage($fileUpload, $actor);
        }

        $fileUpload->setAttribute('hidden', !$fileUpload->getAttribute('hidden'));
        $fileUpload->save();

        $collection = $this->api->getCollection(FileResource::class);
        $context = (new Context($this->api, $request))->withCollection($collection);
        $resourceType = $collection->resource($fileUpload, $context);
        $resource = $context->resource($resourceType ?? 'files');

        $serializer = new Serializer($context);
        $serializer->addPrimary($resource, $fileUpload, ['actor' => []]);
        [$data, $included] = $serializer->serialize();

        $document = ['data' => $data[0]];
        if (!empty($included)) {
            $document['included'] = $included;
        }

        return json_api_response($document);
    }

    private function moveStorage(File $file, \Flarum\User\User $actor): File
    {
        if (!$file->shared) {
            return $file;
        }

        if ($this->util->isPrivateShared($file)) {
            return $this->util->moveFileToPublic($file);
        }

        return $this->util->moveFileToPrivate($file, $actor);
    }
}
