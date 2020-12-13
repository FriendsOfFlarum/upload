<?php

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
