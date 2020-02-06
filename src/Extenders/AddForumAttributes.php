<?php

namespace FoF\Upload\Extenders;

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

class AddForumAttributes implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container->make(Dispatcher::class)->listen(Serializing::class, [$this, 'serializing']);
    }

    public function serializing(Serializing $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes['fof-upload.canUpload'] = $event->actor->can('fof-upload.upload');
            $event->attributes['fof-upload.canDownload'] = $event->actor->can('fof-upload.download');
        }
    }
}
