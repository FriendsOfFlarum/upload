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
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;

class AddForumAttributes
{
    /**
     * @var Cloud
     */
    protected $assetsDir;

    public function __construct(
        protected SettingsRepositoryInterface $settings,
        Factory $factory
    ) {
        $this->assetsDir = $factory->disk('flarum-assets');
    }

    public function __invoke(ForumSerializer $serializer): array
    {
        $attributes['fof-upload.canUpload'] = $serializer->getActor()->can('fof-upload.upload');
        $attributes['fof-upload.canDownload'] = $serializer->getActor()->can('fof-upload.download');
        $attributes['fof-upload.composerButtonVisiblity'] = $this->settings->get('fof-upload.composerButtonVisiblity', 'both');

        if ($watermark = $this->settings->get('fof-watermark_path')) {
            $attributes['fof-watermarkUrl'] = $this->assetsDir->url($watermark);
        }

        $serializer->getActor()->load('foffiles');
        $serializer->getActor()->load('foffilesCurrent');

        return $attributes;
    }
}
