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

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\ForumSerializer;
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
        $events->listen(Serializing::class, [$this, 'prepareApiAttributes']);
    }

    /**
     * Gets the api attributes and makes them available to the forum.
     *
     * @param Serializing $event
     */
    public function prepareApiAttributes(Serializing $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes['canUpload'] = $event->actor->can('flagrow.upload');
            $event->attributes['canDownload'] = $event->actor->can('flagrow.upload.download');
        }
    }
}
