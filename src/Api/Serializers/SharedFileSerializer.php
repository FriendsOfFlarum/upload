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

class SharedFileSerializer extends FileSerializer
{
    protected $type = 'shared-files';

    protected function getDefaultAttributes($model)
    {
        $attributes = parent::getDefaultAttributes($model);

        $attributes['isPrivateShared'] = $this->util->isPrivateShared($model);

        return $attributes;
    }
}
