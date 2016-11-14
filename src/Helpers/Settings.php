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


namespace Flagrow\Upload\Helpers;

use Aws\AwsClient;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Imgur\Client as Imgur;

/**
 * @property int $maxFileSize
 */
class Settings
{
    const DEFAULT_MAX_FILE_SIZE = 2048;
    const DEFAULT_MAX_IMAGE_WIDTH = 100;

    protected $definition = [
        'uploadMethod',
        'mimeTypesAllowed',

        // Images
        'mustResize',
        'resizeMaxWidth',
        'cdnUrl',

        // Watermarks
        'addsWatermarks',
        'watermarkPosition',
        'watermark',

        // Override avatar upload
        'overrideAvatarUpload',

        // Imgur
        'imgurClientId',

        // AWS
        'awsS3Key',
        'awsS3Secret',
        'awsS3Bucket',
        'awsS3Region',
    ];

    protected $prefix = 'flagrow.upload.';

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
        $definition = $this->definition;

        if ($only) {
            $definition = Arr::only($definition, $only);
        }

        $result = [];

        foreach ($definition as $property) {
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

    /**
     * @return Collection
     */
    public function getAvailableUploadMethods()
    {
        /** @var Collection $methods */
        $methods = [
            'local'
        ];

        if (class_exists(AwsClient::class)) {
            $methods[] = 'aws-s3';
        }

        $methods[] = 'imgur';

        return collect($methods)
            ->keyBy(function ($item) {
                return $item;
            })
            ->map(function ($item) {
                return app('translator')->trans('flagrow-upload.admin.upload_methods.' . $item);
            });
    }
}
