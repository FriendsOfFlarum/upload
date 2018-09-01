<?php

/*
 * This file is part of flagrow/upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Flagrow\Upload;

use Flarum\Extend;
use Flarum\Foundation\Application;
use Illuminate\Contracts\Events\Dispatcher;

return [
    (new Extend\Routes('api'))
        ->post('/flagrow/upload', 'flagrow.upload', Api\Controllers\UploadController::class)
        ->post('/flagrow/watermark', 'flagrow.watermark', Api\Controllers\WatermarkUploadController::class)
        ->get('/flagrow/download/{uuid}/{post}/{csrf}', 'flagrow.upload.download', Api\Controllers\DownloadController::class),
    (new Extend\Frontend('admin'))
        ->css(__DIR__.'/resources/less/admin/settingsPage.less')
        ->js(__DIR__.'/js/dist/admin.js'),
    (new Extend\Frontend('forum'))
        ->css(__DIR__.'/resources/less/forum/download.less')
        ->css(__DIR__.'/resources/less/forum/upload.less')
        ->js(__DIR__.'/js/dist/forum.js'),
    new Extend\Locales(__DIR__.'/resources/locale'),
    function (Dispatcher $events, Application $app) {
        $app->register(Providers\SettingsProvider::class);

        $app->register(Providers\StorageServiceProvider::class);
        $app->register(Providers\DownloadProvider::class);

        $events->subscribe(Listeners\AddPostDownloadTags::class);
        $events->subscribe(Listeners\AddUploadsApi::class);
        $events->subscribe(Listeners\LoadSettingsFromDatabase::class);
        $events->subscribe(Listeners\ProcessesImages::class);

        $events->subscribe(Listeners\AddDeprecatedTemplates::class);
    },
];
