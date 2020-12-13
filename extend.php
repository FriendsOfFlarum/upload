<?php

namespace FoF\Upload;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extend;
use Flarum\Foundation\Application;
use Flarum\Settings\Event\Deserializing;
use FoF\Upload\Listeners\AddAvailableOptionsInAdmin;

return [
    (new Extend\Routes('api'))
        ->post('/fof/upload', 'fof-upload.upload', Api\Controllers\UploadController::class)
        ->post('/fof/watermark', 'fof-upload.watermark', Api\Controllers\WatermarkUploadController::class)
        ->get('/fof/download/{uuid}/{post}/{csrf}', 'fof-upload.download', Api\Controllers\DownloadController::class),

    (new Extend\Frontend('admin'))
        ->css(__DIR__ . '/resources/less/admin.less')
        ->js(__DIR__ . '/js/dist/admin.js'),

    (new Extend\Frontend('forum'))
        ->css(__DIR__ . '/resources/less/forum/download.less')
        ->css(__DIR__ . '/resources/less/forum/upload.less')
        ->js(__DIR__ . '/js/dist/forum.js'),
    new Extend\Locales(__DIR__ . '/resources/locale'),

    new Extenders\AddImageProcessor(),
    new Extenders\AddPostDownloadTags(),
    new Extenders\ReplaceDeprecatedTemplates(),
    new Extenders\CreateStorageFolder('tmp'),

    function (Application $app) {
        $app->register(Providers\SettingsProvider::class);

        $app->register(Providers\StorageServiceProvider::class);
        $app->register(Providers\DownloadProvider::class);
    },

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->mutate(Extenders\AddForumAttributes::class),

    (new Extend\Event())
        ->listen(Deserializing::class, AddAvailableOptionsInAdmin::class),
];
