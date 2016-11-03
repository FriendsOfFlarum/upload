<?php

namespace Flagrow\Upload\Api\Serializers;

use Flagrow\Upload\File;
use Flarum\Api\Serializer\AbstractSerializer;
use Illuminate\Support\Arr;

class FileSerializer extends AbstractSerializer
{
    protected $type = 'files';

    /**
     * Get the default set of serialized attributes for a model.
     *
     * @param File $model
     * @return array
     */
    protected function getDefaultAttributes($model)
    {
        return Arr::only(
            $model->attributesToArray(),
            ['path', 'url', 'id', 'type', 'size']
        );
    }
}