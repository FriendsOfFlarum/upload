<?php

namespace FoF\Upload;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use FoF\Upload\Events\Adapter\Collecting;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Collection;

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

        $events->listen(Collecting::class, function (Collection &$adapters) {
            if ($force = $this->force) {
                $adapters = $adapters->only($force);
            } else {
                $adapters->forget($this->disabling);
            }
        });
    }
}
