<?php

namespace Flagrow\Upload\Helpers;

use Flarum\Settings\SettingsRepositoryInterface;

/**
 * @property int $maxFileSize
 */
class Settings
{
    const DEFAULT_MAX_FILE_SIZE = 2048;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function get($name, $default = null)
    {
        return $this->{$name} ? $this->{$name} : $default;
    }

    public function __get($name)
    {
        return $this->settings->get('flagrow.file.' . $name);
    }

    public function __set($name, $value)
    {
        $this->settings->set('flagrow.file.' . $name, $value);
    }

    public function __isset($name)
    {
        return $this->settings->get('flagrow.file.' . $name) !== null;
    }
}