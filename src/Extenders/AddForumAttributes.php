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

namespace FoF\Upload\Extenders;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\SettingsRepositoryInterface;

class AddForumAttributes
{
    public function __construct(
        protected SettingsRepositoryInterface $settings
    ) {
    }

    public function __invoke(ForumSerializer $serializer): array
    {
        $attributes['fof-upload.canUpload'] = $serializer->getActor()->can('fof-upload.upload');
        $attributes['fof-upload.canDownload'] = $serializer->getActor()->can('fof-upload.download');
        $attributes['fof-upload.composerButtonVisiblity'] = $this->settings->get('fof-upload.composerButtonVisiblity', 'both');

        $serializer->getActor()->load('foffiles');
        $serializer->getActor()->load('foffilesCurrent');

        return $attributes;
    }
}
