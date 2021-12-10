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

namespace FoF\Upload;

use Flarum\Api\Serializer\CurrentUserSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Extend;
use Flarum\Settings\Event\Deserializing;
use FoF\Upload\Events\File\WillBeUploaded;

return [
    (new Extend\Routes('api'))
        ->get('/fof/uploads', 'fof-upload.list', Api\Controllers\ListUploadsController::class)
        ->post('/fof/upload', 'fof-upload.upload', Api\Controllers\UploadController::class)
        ->post('/fof/watermark', 'fof-upload.watermark', Api\Controllers\WatermarkUploadController::class)
        ->get('/fof/download/{uuid}/{post}/{csrf}', 'fof-upload.download', Api\Controllers\DownloadController::class)
        ->patch('/fof/upload/hide', 'fof-upload.hide', Api\Controllers\HideUploadFromMediaManagerController::class),

    (new Extend\Csrf())->exemptRoute('fof-upload.download'),

    (new Extend\Frontend('admin'))
        ->css(__DIR__.'/resources/less/admin.less')
        ->js(__DIR__.'/js/dist/admin.js'),

    (new Extend\Frontend('forum'))
        ->css(__DIR__.'/resources/less/forum/download.less')
        ->css(__DIR__.'/resources/less/forum/upload.less')
        ->css(__DIR__.'/resources/less/forum/fileManagerModal.less')
        ->css(__DIR__.'/resources/less/forum/fileList.less')
        ->css(__DIR__.'/resources/less/forum/textPreview.less')
        ->js(__DIR__.'/js/dist/forum.js'),
    new Extend\Locales(__DIR__.'/resources/locale'),

    new Extenders\AddPostDownloadTags(),
    new Extenders\CreateStorageFolder('tmp'),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(Extenders\AddForumAttributes::class),

    (new Extend\Event())
        ->listen(Deserializing::class, Listeners\AddAvailableOptionsInAdmin::class)
        ->listen(WillBeUploaded::class, Listeners\AddImageProcessor::class),

    (new Extend\ServiceProvider())
        ->register(Providers\UtilProvider::class)
        ->register(Providers\StorageServiceProvider::class)
        ->register(Providers\DownloadProvider::class),

    (new Extend\View())
        ->namespace('fof-upload.templates', __DIR__.'/resources/templates'),

    (new Extend\ApiSerializer(CurrentUserSerializer::class))
        ->attributes(Extenders\AddCurrentUserAttributes::class),

    (new Extend\ApiSerializer(UserSerializer::class))
        ->attributes(Extenders\AddUserAttributes::class),

    (new Extend\Formatter())
        ->render(Formatter\TextPreview\FormatTextPreview::class),
];
