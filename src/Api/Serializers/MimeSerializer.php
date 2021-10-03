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

class MimeSerializer extends AbstractSerializer
{
    protected $type = '';

    protected function getDefaultAttributes($model)
    {
        // TODO: Implement getDefaultAttributes() method.
    }
}
