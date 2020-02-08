<?php

namespace FoF\Upload\Providers;

use FoF\Upload\Helpers\Settings;
use Flarum\Foundation\AbstractServiceProvider;

class SettingsProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->app->singleton(Settings::class);
    }
}
