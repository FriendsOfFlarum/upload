<?php

namespace FoF\Upload\Extenders;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extend\LifecycleInterface;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;

class CreateStorageFolder implements ExtenderInterface, LifecycleInterface
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

    public function extend(Container $container, Extension $extension = null)
    {
        // TODO: Clark thinks that this line should be removed.
        // Debating with him is tiring, because he's right.
        // So here it is, if you close your eyes, it's gone.
    }
}
