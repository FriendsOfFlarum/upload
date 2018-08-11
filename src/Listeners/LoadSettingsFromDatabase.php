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

use Flagrow\Upload\Helpers\Settings;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\Event\Deserializing;
use Illuminate\Contracts\Events\Dispatcher;

class LoadSettingsFromDatabase
{
    /**
     * @var Settings
     */
    protected $settings;

    /**
     * Gets the settings variable. Called on Object creation.
     *
     * @param Settings $settings
     */
    public function __construct(Settings $settings)
    {
        $this->settings = $settings;
    }

    /**
     * Subscribes to the Flarum events.
     *
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(Deserializing::class, [$this, 'addUploadMethods']);
        $events->listen(Deserializing::class, [$this, 'addTemplates']);
        $events->listen(Serializing::class, [$this, 'prepareApiAttributes']);
    }

    /**
     * Get the setting values from the database and make them available
     * in the forum.
     *
     * @param Serializing $event
     */
    public function prepareApiAttributes(Serializing $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes = array_merge($event->attributes, $this->settings->toArrayFrontend());
        }
    }

    /**
     * @param Deserializing $event
     */
    public function addUploadMethods(Deserializing $event)
    {
        $event->settings['flagrow.upload.availableUploadMethods'] = $this->settings->getAvailableUploadMethods()->toArray();
    }

    /**
     * @param Deserializing $event
     */
    public function addTemplates(Deserializing $event)
    {
        $event->settings['flagrow.upload.availableTemplates'] = $this->settings->getAvailableTemplates()->toArray();
    }
}
