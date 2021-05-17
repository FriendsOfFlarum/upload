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

namespace FoF\Upload\Extenders;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extend\LifecycleInterface;
use Flarum\Extension\Extension;
use Flarum\Foundation\Paths;
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
        @mkdir($container->make(Paths::class)->storage.DIRECTORY_SEPARATOR.$this->path);
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
