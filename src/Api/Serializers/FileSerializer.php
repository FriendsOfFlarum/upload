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


namespace Flagrow\Upload\Api\Serializers;

use Flagrow\Upload\File;
use Flarum\Api\Serializer\AbstractSerializer;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class FileSerializer extends AbstractSerializer
{
    protected $type = 'files';

    /**
     * Get the default set of serialized attributes for a model.
     *
     * @param Collection $collection
     * @return array
     */
    protected function getDefaultAttributes($collection)
    {
        return $collection->map(function (File $file) {
            return Arr::only(
                $file->attributesToArray(),
                ['base_name', 'path', 'url', 'type', 'size', 'markdownString']

            );
        })->toArray();
    }
}
