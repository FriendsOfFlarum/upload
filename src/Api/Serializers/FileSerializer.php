<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) 2020 - 2021 FriendsOfFlarum.
 * Copyright (c) 2016 - 2019 Flagrow
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use FoF\Upload\File;
use Illuminate\Support\Arr;

class FileSerializer extends AbstractSerializer
{
    protected $type = 'files';

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
