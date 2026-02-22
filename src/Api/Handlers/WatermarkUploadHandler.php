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

use Flarum\Api\JsonApi;
use Flarum\Api\Resource\ForumResource;
use Flarum\Foundation\Paths;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UploadedFileInterface;
use Psr\Http\Server\RequestHandlerInterface;

class WatermarkUploadHandler implements RequestHandlerInterface
{
    public function __construct(
        protected JsonApi $api,
        protected SettingsRepositoryInterface $settings,
        protected Paths $paths,
        protected Factory $filesystemFactory
    ) {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        RequestUtil::getActor($request)->assertAdmin();

        /** @var UploadedFileInterface|null $file */
        $file = Arr::get($request->getUploadedFiles(), 'fof-watermark');

        if ($file !== null) {
            $tmpFile = @tempnam($this->paths->storage.'/tmp', 'fof-watermark');
            $file->moveTo($tmpFile);

            $uploadName = 'fof-upload-watermark-'.Str::lower(Str::random(8)).'-'.$file->getClientFilename();

            $assetsDir = $this->filesystemFactory->disk('flarum-assets');
            $assetsDir->put($uploadName, file_get_contents($tmpFile));

            $this->settings->set('fof-watermark_path', $uploadName);

            @unlink($tmpFile);
        }

        return $this->api
            ->forResource(ForumResource::class)
            ->forEndpoint('show')
            ->handle($request->withMethod('GET')->withUri($request->getUri()->withPath('/api/forum')));
    }
}
