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

use Flarum\Http\RequestUtil;
use Flarum\Post\PostRepository;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Api\Serializers\FileSerializer;
use FoF\Upload\Commands\Download;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Contracts\Session\Session;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class DownloadController implements RequestHandlerInterface
{
    public string $serializer = FileSerializer::class;

    public function __construct(
        protected Dispatcher $bus,
        protected PostRepository $posts,
        protected SettingsRepositoryInterface $settings
    ) {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $params = $request->getQueryParams();
        $uuid = Arr::get($params, 'uuid');
        $postId = Arr::get($params, 'post');
        $csrf = Arr::get($params, 'csrf');

        $discussionId = null;
        if ($postId !== null) {
            $post = $this->posts->findOrFail($postId, $actor);
            $discussionId = $post->discussion_id;
            $this->validateCsrf($csrf, $request->getAttribute('session'));
        }

        return $this->bus->dispatch(
            new Download($uuid, $actor, $discussionId, $postId)
        );
    }

    protected function validateCsrf(?string $csrf, Session $session): void
    {
        if ((bool) !$this->settings->get('fof-upload.disableHotlinkProtection') && $csrf !== $session->token()) {
            throw new ModelNotFoundException();
        }
    }
}
