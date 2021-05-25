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

namespace FoF\Upload\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use FoF\Upload\File;
use FoF\Upload\Helpers\Util;

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
        /** @var Util */
        $util = resolve(Util::class);

        return [
            'baseName'  => $model->base_name,
            'path'      => $model->path,
            'url'       => $model->url,
            'type'      => $model->type,
            'size'      => $model->size,
            'humanSize' => $model->humanSize,
            'createdAt' => $model->created_at,
            'uuid'      => $model->uuid,
            'tag'       => $model->tag,
            'hidden'    => $model->hidden_from_media_manager,
            'bbcode'    => $util->getBbcodeForFile($model),
        ];
    }
}
