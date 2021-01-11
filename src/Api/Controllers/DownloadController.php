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
    public $serializer = FileSerializer::class;

    /**
     * @var Dispatcher
     */
    protected $bus;
    /**
     * @var PostRepository
     */
    private $posts;
    /**
     * @var SettingsRepositoryInterface
     */
    private $settings;

    public function __construct(Dispatcher $bus, PostRepository $posts, SettingsRepositoryInterface $settings)
    {
        $this->bus = $bus;
        $this->posts = $posts;
        $this->settings = $settings;
    }

    /**
     * @param \Psr\Http\Message\ServerRequestInterface $request
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = $request->getAttribute('actor');
        $uuid = Arr::get($request->getQueryParams(), 'uuid');
        $postId = Arr::get($request->getQueryParams(), 'post');
        $csrf = Arr::get($request->getQueryParams(), 'csrf');

        $post = $this->posts->findOrFail($postId, $actor);
        $discussion = $post->discussion_id;

        /** @var Session $session */
        $session = $request->getAttribute('session');

        if ($this->settings->get('fof-upload.disableHotlinkProtection') != 1 && $csrf !== $session->token()) {
            throw new ModelNotFoundException();
        }

        return $this->bus->dispatch(
            new Download($uuid, $actor, $discussion, $postId)
        );
    }
}
