<?php

namespace FoF\Upload\Extenders;

use Flarum\Extend\LifecycleInterface;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;

class CreateStorageFolder implements LifecycleInterface
{
    /**
     * @var string
     */
    private $path;

    public function __construct(string $path)
    {
        $this->path = $path;
    }

    public function onEnable(Container $container, Extension $extension)
    {
        @mkdir(storage_path($this->path));
    }

    public function onDisable(Container $container, Extension $extension)
    {
        // Nee, no, nein, nada, pas de rein.
    }
}
