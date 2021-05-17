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

namespace FoF\Upload\Extend;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use FoF\Upload\Events\Adapter\Collecting;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

class Adapters implements ExtenderInterface
{
    protected $disabling = [];
    protected $force;

    public function disable(string $adapter)
    {
        $this->disabling[] = $adapter;

        return $this;
    }

    public function force(string $adapter)
    {
        $this->force = $adapter;

        return $this;
    }

    public function extend(Container $container, Extension $extension = null)
    {
        /** @var Dispatcher $events */
        $events = $container->make(Dispatcher::class);

        $events->listen(Collecting::class, function (Collecting $event) {
            if ($force = $this->force) {
                $event->adapters = $event->adapters->only($force);
            } else {
                $event->adapters->forget($this->disabling);
            }
        });
    }
}
