<?php

namespace Flagrow\Upload\Api\Controllers;

use Flagrow\Upload\Api\Serializers\FileSerializer;
use Flagrow\Upload\Commands\Upload;
use Flarum\Api\Controller\AbstractResourceController;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UploadController extends AbstractResourceController
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
     * Get the data to be serialized and assigned to the response document.
     *
     * @param ServerRequestInterface $request
     * @param Document $document
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $postId = Arr::get($request->getQueryParams(), 'post');
        $actor = $request->getAttribute('actor');
        $file = Arr::get($request->getUploadedFiles(), 'file');

        return $this->bus->dispatch(
            new Upload()
        );
    }
}