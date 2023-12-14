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

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use FoF\Upload\Commands\DeleteFile;
use FoF\Upload\File;
use Illuminate\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class DeleteFileController extends AbstractDeleteController
{
    public function __construct(
        protected Dispatcher $bus
    ) {
    }

    public function delete(ServerRequestInterface $request): void
    {
        $actor = RequestUtil::getActor($request);

        $uuid = Arr::get($request->getQueryParams(), 'uuid');

        $file = File::byUuid($uuid)->firstOrFail();

        $this->bus->dispatch(
            new DeleteFile($file, $actor)
        );
    }
}
