<?php

namespace FoF\Upload\Extenders;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use FoF\Upload\Events\File\WillBeUploaded;
use FoF\Upload\Processors\ImageProcessor;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

class AddImageProcessor implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container->make(Dispatcher::class)->listen(WillBeUploaded::class, [$this, 'processor']);
    }

    public function processor(WillBeUploaded $event)
    {
        if ($this->validateMime($event->mime)) {
            app(ImageProcessor::class)->process($event->file, $event->uploadedFile, $event->mime);
        }
    }

    protected function validateMime($mime): bool
    {
        if ($mime == 'image/jpeg' || $mime == 'image/png' || $mime == 'image/gif' || $mime == 'image/svg+xml') {
            return true;
        }

        return false;
    }
}
