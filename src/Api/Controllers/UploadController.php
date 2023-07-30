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

namespace FoF\Upload\Api\Controllers;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Api\Serializers\FileSerializer;
use FoF\Upload\Commands\Upload;
use FoF\Upload\Exceptions\InvalidUploadException;
use FoF\Upload\Helpers\Util;
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

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(Dispatcher $bus, SettingsRepositoryInterface $settings)
    {
        $this->bus = $bus;
        $this->settings = $settings;
    }

    /**
     * @param \Psr\Http\Message\ServerRequestInterface $request
     * @param \Tobscure\JsonApi\Document               $document
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
            throw new InvalidUploadException('no_files_made_it_to_upload', 400, [
                'max' => $this->settings->get('fof-upload.maxFileSize', Util::DEFAULT_MAX_FILE_SIZE),
            ]);
        }

        return $collection;
    }
}
