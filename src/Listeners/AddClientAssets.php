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

use DirectoryIterator;
use Flarum\Event\ConfigureLocales;
use Flarum\Frontend\Event\Rendering;
use Illuminate\Contracts\Events\Dispatcher;

class AddClientAssets
{

    /**
     * Subscribes to the Flarum events.
     *
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(Rendering::class, [$this, 'addForumAssets']);
        $events->listen(Rendering::class, [$this, 'addAdminAssets']);
        $events->listen(ConfigureLocales::class, [$this, 'addLocales']);
    }

    /**
     * Modifies the client view for the Forum.
     *
     * @param Rendering $event
     */
    public function addForumAssets(Rendering $event)
    {
        if ($event->isForum()) {
            $event->addAssets([
                __DIR__ . '/../../less/forum/upload.less',
                __DIR__ . '/../../less/forum/download.less',
                __DIR__ . '/../../js/forum/dist/extension.js'
            ]);
            $event->addBootstrapper('flagrow/upload/main');
        }
    }

    /**
     * Modifies the client view for the Admin.
     *
     * @param Rendering $event
     */
    public function addAdminAssets(Rendering $event)
    {
        if ($event->isAdmin()) {
            $event->addAssets([
                __DIR__ . '/../../less/admin/settingsPage.less',
                __DIR__ . '/../../js/admin/dist/extension.js'
            ]);
            $event->addBootstrapper('flagrow/upload/main');
        }
    }

    /**
     * Provides i18n files.
     *
     * @param ConfigureLocales $event
     */
    public function addLocales(ConfigureLocales $event)
    {
        foreach (new DirectoryIterator(__DIR__ . '/../../locale') as $file) {
            if ($file->isFile() && in_array($file->getExtension(), ['yml', 'yaml'])) {
                $event->locales->addTranslations($file->getBasename('.' . $file->getExtension()), $file->getPathname());
            }
        }
    }
}
