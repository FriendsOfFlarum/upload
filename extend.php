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

namespace FoF\Upload;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extend;
use Flarum\Settings\Event\Deserializing;
use FoF\Upload\Events\File\WillBeUploaded;

return [
    (new Extend\Routes('api'))
        ->post('/fof/upload', 'fof-upload.upload', Api\Controllers\UploadController::class)
        ->post('/fof/watermark', 'fof-upload.watermark', Api\Controllers\WatermarkUploadController::class)
        ->get('/fof/download/{uuid}/{post}/{csrf}', 'fof-upload.download', Api\Controllers\DownloadController::class),

    (new Extend\Frontend('admin'))
        ->css(__DIR__.'/resources/less/admin.less')
        ->js(__DIR__.'/js/dist/admin.js'),

    (new Extend\Frontend('forum'))
        ->css(__DIR__.'/resources/less/forum/download.less')
        ->css(__DIR__.'/resources/less/forum/upload.less')
        ->js(__DIR__.'/js/dist/forum.js'),
    new Extend\Locales(__DIR__.'/resources/locale'),

    new Extenders\AddPostDownloadTags(),
    new Extenders\CreateStorageFolder('tmp'),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->mutate(Extenders\AddForumAttributes::class),

    (new Extend\Event())
        ->listen(Deserializing::class, Listeners\AddAvailableOptionsInAdmin::class)
        ->listen(WillBeUploaded::class, Listeners\AddImageProcessor::class),

    (new Extend\ServiceProvider())
        ->register(Providers\UtilProvider::class)
        ->register(Providers\StorageServiceProvider::class)
        ->register(Providers\DownloadProvider::class),

    (new Extend\View())
        ->namespace('fof-upload.templates', __DIR__.'/resources/templates'),

    (new Extend\Formatter())
        ->parse(Formatter\ReplaceDeprecatedTemplates::class),
];
