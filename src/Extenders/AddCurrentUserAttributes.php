<?php

namespace FoF\Upload\Extenders;

use Flarum\Api\Serializer\CurrentUserSerializer;
use Flarum\User\User;

class AddCurrentUserAttributes
{
    public function __invoke(CurrentUserSerializer $serializer, User $user, array $attributes): array
    {
        $actor = $serializer->getActor();

        if ($viewOthers = $actor->hasPermission('fof-upload.viewUserUploads')) {
            $attributes['fof-upload-viewOthersMediaLibrary'] = $viewOthers;
        }

        if ($deleteOthers = $actor->hasPermission('fof-upload.deleteUserUploads')) {
            $attributes['fof-upload-deleteOthersMediaLibrary'] = $deleteOthers;
        }

        return $attributes;
    }
}
