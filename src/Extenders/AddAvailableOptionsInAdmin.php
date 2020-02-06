<?php

namespace FoF\Upload\Extenders;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Settings\Event\Deserializing;
use FoF\Upload\Helpers\Settings;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

class AddAvailableOptionsInAdmin implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container->make(Dispatcher::class)->listen(Deserializing::class, [$this, 'deserializing']);
    }

    public function deserializing(Deserializing $event)
    {
        /** @var Settings $settings */
        $settings = app(Settings::class);

        $event->settings['fof-upload.availableUploadMethods'] = $settings->getAvailableUploadMethods()->toArray();
        $event->settings['fof-upload.availableTemplates'] = $settings->getAvailableTemplates()->toArray();
    }
}
