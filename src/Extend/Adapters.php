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
    /** @var string[] */
    protected array $disabling = [];
    protected ?string $force = null;

    public function disable(string $adapter): static
    {
        $this->disabling[] = $adapter;

        return $this;
    }

    public function force(string $adapter): static
    {
        $this->force = $adapter;

        return $this;
    }

    public function extend(Container $container, ?Extension $extension = null): void
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
