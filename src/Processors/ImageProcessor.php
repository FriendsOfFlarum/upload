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

namespace FoF\Upload\Processors;

use Flarum\Foundation\ValidationException;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Contracts\Processable;
use FoF\Upload\File;
use FoF\Upload\Helpers\Util;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Intervention\Image\Exception\NotReadableException;
use Intervention\Image\Image;
use Intervention\Image\ImageManager;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageProcessor implements Processable
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

    public function process(File $file, UploadedFile $upload, string $mimeType): void
    {
        if ($mimeType == 'image/jpeg' || $mimeType == 'image/png') {
            try {
                $image = (new ImageManager())->make($upload->getRealPath());
            } catch (NotReadableException $e) {
                throw new ValidationException(['upload' => 'Corrupted image']);
            }

            if ($this->settings->get('fof-upload.mustResize')) {
                $this->resize($image);
            }

            if ($this->settings->get('fof-upload.addsWatermarks')) {
                $this->watermark($image);
            }

            $image->orientate();

            @file_put_contents(
                $upload->getRealPath(),
                $image->encode($mimeType)
            );
        }
    }

    /**
     * @param Image $manager
     */
    protected function resize(Image $manager)
    {
        $maxSize = $this->settings->get('fof-upload.resizeMaxWidth', Util::DEFAULT_MAX_IMAGE_WIDTH);
        $manager->resize(
            $maxSize,
            $maxSize,
            function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            }
        );
    }

    /**
     * @param Image $image
     */
    protected function watermark(Image $image)
    {
        if ($this->settings->get('fof-watermark_path')) {
            $image->insert(
                $this->assetsDir->get($this->settings->get('fof-watermark_path')),
                $this->settings->get('fof-upload.watermarkPosition', 'bottom-right')
            );
        }
    }
}
