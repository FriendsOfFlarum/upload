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

use Flarum\Foundation\ValidationException;
use Flarum\User\Exception\PermissionDeniedException;
use Flarum\User\User;
use FoF\Upload\File;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class HideUploadFromMediaManagerController implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        /** @var User */
        $actor = $request->getAttribute('actor');
        $actor->assertRegistered();

        $uuid = Arr::get($request->getParsedBody(), 'uuid');

        if (empty($uuid)) {
            throw new ValidationException(['UUID cannot be empty']);
        }

        $fileUpload = File::where('uuid', $uuid)->firstOrFail();

        // If the actor does not own the file and the actor does not have edit uploads of others permission..
        if ($actor->id !== $fileUpload->actor_id && !$actor->hasPermission('fof-upload.deleteUserUploads')) {
            throw new PermissionDeniedException();
        }

        $fileUpload->hide_from_media_manager = true;
        $fileUpload->save();

        return new EmptyResponse(202);
    }
}
