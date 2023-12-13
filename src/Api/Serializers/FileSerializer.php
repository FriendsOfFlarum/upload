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
use Flarum\Api\Serializer\BasicUserSerializer;
use Flarum\Http\UrlGenerator;
use FoF\Upload\File;
use FoF\Upload\Helpers\Util;

class FileSerializer extends AbstractSerializer
{
    protected $type = 'files';

    public function __construct(
        protected Util $util,
        protected UrlGenerator $url
    ) {
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
        return [
            'baseName'    => $model->base_name,
            'path'        => $model->path,
            'url'         => $model->url,
            'type'        => $model->type,
            'size'        => $model->size,
            'humanSize'   => $model->humanSize,
            'createdAt'   => $this->formatDate($model->created_at),
            'uuid'        => $model->uuid,
            'tag'         => $model->tag,
            'hidden'      => $model->hidden,
            'bbcode'      => $this->util->getBbcodeForFile($model),
            'shared'      => $model->shared,
            'canViewInfo' => $this->actor->can('viewInfo', $model),
            'canHide'     => $this->actor->can('hide', $model),
            'canDelete'   => $this->actor->can('delete', $model),
        ];
    }

    public function actor($model)
    {
        return $this->hasOne($model, BasicUserSerializer::class);
    }
}
