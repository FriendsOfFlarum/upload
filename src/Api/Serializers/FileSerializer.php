<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
 * Copyright (c) 2016 - 2019 Flagrow
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Formatter\Formatter;
use FoF\Upload\File;
use FoF\Upload\Helpers\Settings;
use Illuminate\Support\Arr;

class FileSerializer extends AbstractSerializer
{
    protected $type = 'files';
    /**
     * @var Settings
     */
    private $settings;
    /**
     * @var Formatter
     */
    private $formatter;

    public function __construct(Settings $settings, Formatter $formatter)
    {
        $this->settings = $settings;
        $this->formatter = $formatter;
    }

    /**
     * Get the default set of serialized attributes for a model.
     *
     * @param File $model
     *
     * @return array
     */
    protected function getDefaultAttributes($model)
    {
        $attributes = Arr::only(
            $model->attributesToArray(),
            ['uuid', 'base_name', 'tag']
        );

        return $attributes;
    }
}
