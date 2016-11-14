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


namespace Flagrow\Upload\Listeners;

use Flagrow\Upload\Api\Controllers\UploadController;
use Flagrow\Upload\Api\Controllers\WatermarkUploadController;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\ConfigureApiRoutes;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Events\Dispatcher;

class AddUploadsApi
{
    /**
     * Subscribes to the Flarum api routes configuration event.
     *
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    /**
     * Registers our routes.
     *
     * @param ConfigureApiRoutes $event
     */
    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        $event->post('/flagrow/upload', 'flagrow.upload', UploadController::class);
        $event->post('/flagrow/watermark', 'flagrow.watermark', WatermarkUploadController::class);
    }

    /**
     * Gets the api attributes and makes them available to the forum.
     *
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes['canUpload'] = $event->actor->can('flagrow.upload');
        }
    }
}
