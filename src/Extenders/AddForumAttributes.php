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

namespace FoF\Upload\Extenders;

use Flarum\Api\Serializer\ForumSerializer;

class AddForumAttributes
{
    public function __invoke(ForumSerializer $serializer)
    {
        $attributes['fof-upload.canUpload'] = $serializer->getActor()->can('fof-upload.upload');
        $attributes['fof-upload.canDownload'] = $serializer->getActor()->can('fof-upload.download');

        return $attributes;
    }
}
