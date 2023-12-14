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
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use FoF\Upload\Api\Serializers\SharedFileSerializer;
use FoF\Upload\File;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListSharedUploadsController extends AbstractListController
{
    public $serializer = SharedFileSerializer::class;

    public $sortFields = ['id'];

    public function __construct(
        protected UrlGenerator $url
    ) {
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $params = $request->getQueryParams();

        // Params
        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);

        // Build query
        $query = File::sharedFiles();

        if ($actor->cannot('fof-upload.upload-shared-files')) {
            $query->where('hidden', false);
        }

        $results = $query
            ->skip($offset)
            ->take($limit + 1)
            ->orderBy('id', 'desc')
            ->get();

        // Check for more results
        $hasMoreResults = $limit > 0 && $results->count() > $limit;

        // Pop
        if ($hasMoreResults) {
            $results->pop();
        }

        // Add pagination to the request
        $document->addPaginationLinks(
            $this->url->to('api')->route('fof-upload.shared-files.index'),
            $params,
            $offset,
            $limit,
            $hasMoreResults ? null : 0
        );

        return $results;
    }
}
