<?php

namespace Flagrow\Upload\Helpers;

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;

/**
 * @property int $maxFileSize
 */
class Settings
{
    const DEFAULT_MAX_FILE_SIZE = 2048;

    protected $definition = [
        'uploadMethod',
        'imgurClientId',
        'mustResize',
        'resizeMaxWidth',
        'resizeMaxHeight'
    ];

    protected $prefix = 'flagrow.file.';

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __get($name)
    {
        return $this->settings->get($this->prefix . $name);
    }

    public function __set($name, $value)
    {
        $this->settings->set($this->prefix . $name, $value);
    }

    public function __isset($name)
    {
        return $this->settings->get($this->prefix . $name) !== null;
    }

    /**
     * @param bool $prefixed
     * @param array|null $only
     * @return array
     */
    public function toArray($prefixed = true, array $only = null)
    {
        $definion = $this->definition;

        if ($only) {
            $definion = Arr::only($definion, $only);
        }

        $result = [];

        foreach ($definion as $property) {
            if ($prefixed) {
                $result[$this->prefix . $property] = $this->get($property);
            } else {
                $result[$property] = $this->get($property);
            }
        }

        return $result;
    }

    public function get($name, $default = null)
    {
        return $this->{$name} ? $this->{$name} : $default;
    }

    public function getDefinition()
    {
        return $this->definition;
    }

    /**
     * @return string
     */
    public function getPrefix()
    {
        return $this->prefix;
    }
}