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
use Flarum\Http\RequestUtil;
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
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $uuid = Arr::get($request->getParsedBody(), 'uuid');

        if (empty($uuid)) {
            throw new ValidationException(['uuid' => 'UUID cannot be empty.']);
        }

        $fileUpload = File::byUuid($uuid)->firstOrFail();

        $actor->assertCan('hide', $fileUpload);

        $fileUpload->hidden = true;
        $fileUpload->save();

        return new EmptyResponse(202);
    }
}
