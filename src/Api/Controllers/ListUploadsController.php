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
use Flarum\Http\UrlGenerator;
use Flarum\User\User;
use FoF\Upload\Api\Serializers\FileSerializer;
use FoF\Upload\File;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListUploadsController extends AbstractListController
{
    public $serializer = FileSerializer::class;

    public $sortFields = ['id'];

    /**
     * @var UrlGenerator
     */
    protected $url;

    public function __construct(UrlGenerator $url)
    {
        $this->url = $url;
    }

    /**
     * @param \Psr\Http\Message\ServerRequestInterface $request
     * @param \Tobscure\JsonApi\Document               $document
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        /** @var User $actor */
        $actor = $request->getAttribute('actor');
        $params = $request->getQueryParams();

        // User is signed in
        $actor->assertRegistered();

        $filterUploads = Arr::get($params, 'filter.user', $actor->id);

        // Can this user load other their files?
        if (intval($filterUploads) !== $actor->id) {
            $actor->assertCan('fof-upload.viewUserUploads');
        }

        // Params
        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);

        $results = File::query()
            ->where('actor_id', $filterUploads)
            // Filter images hidden from the media manager for all users except for users
            // themselves and users with elevated permissions
            ->when(
                $filterUploads != $actor->id && $actor->cannot('fof-upload.deleteUserUploads'),
                fn ($query) => $query->where('hide_from_media_manager', false)
            )
            // Filter images contained in private discussions or posts, except for users
            // themselves or users with elevated permissions.
            ->when(
                $filterUploads != $actor->id && $actor->cannot('fof-upload.deleteUserUploads'),
                fn ($query) => $query
                    ->whereHas('posts', fn ($query) => $query->where('posts.is_private', 0))
                    ->whereHas('posts.discussion', fn ($query) => $query->where('discussions.is_private', 0))
            )
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
            $this->url->to('api')->route('fof-upload.list'),
            $params,
            $offset,
            $limit,
            $hasMoreResults ? null : 0
        );

        return $results;
    }
}
