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
use Flarum\Http\RequestUtil;
use FoF\Upload\Api\Resource\FileResource;
use FoF\Upload\Commands\Upload;
use FoF\Upload\Exceptions\InvalidUploadException;
use FoF\Upload\Helpers\Util;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

use function Tobyz\JsonApiServer\json_api_response;

class UploadHandler implements RequestHandlerInterface
{
    public function __construct(
        protected JsonApi $api,
        protected Dispatcher $bus,
        protected \Flarum\Settings\SettingsRepositoryInterface $settings
    ) {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        /** @var array<int, \Psr\Http\Message\UploadedFileInterface> $uploadedFiles */
        $uploadedFiles = Arr::get($request->getUploadedFiles(), 'files', []) ?? [];
        $files = collect($uploadedFiles);
        $params = $request->getParsedBody() ?? [];

        $hideFromMediaManager = $this->getOption('hidden', $params);
        $shared = $this->getOption('shared', $params);

        $collection = $this->bus->dispatch(
            new Upload($files, $actor, $hideFromMediaManager, $shared)
        );

        if ($collection->isEmpty()) {
            throw new InvalidUploadException('no_files_made_it_to_upload', 400, [
                'max' => $this->settings->get('fof-upload.maxFileSize', Util::DEFAULT_MAX_FILE_SIZE),
            ]);
        }

        /** @var \Flarum\Api\Resource\AbstractResource $collectionResource */
        $collectionResource = $this->api->getCollection(FileResource::class);
        $endpoint = null;
        foreach ($collectionResource->resolveEndpoints() as $ep) {
            if ($ep->name === 'index') {
                $endpoint = $ep;
                break;
            }
        }
        if ($endpoint === null) {
            throw new \RuntimeException('File resource index endpoint not found');
        }
        $context = (new Context($this->api, $request))
            ->withCollection($collectionResource)
            ->withEndpoint($endpoint);

        $serializer = new Serializer($context);
        foreach ($collection as $model) {
            $resourceType = $collectionResource->resource($model, $context);
            $resource = $context->resource($resourceType ?? 'files');
            $serializer->addPrimary($resource, $model, ['actor' => []]);
        }

        [$data, $included] = $serializer->serialize();

        return json_api_response(compact('data', 'included'));
    }

    protected function getOption(string $option, array $params): bool
    {
        $value = Arr::get($params, 'options.'.$option);

        return $value === 'true' || $value === true;
    }
}
