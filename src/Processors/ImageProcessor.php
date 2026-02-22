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
use Illuminate\Contracts\Filesystem\Factory;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\ImageInterface;
use RuntimeException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageProcessor implements Processable
{
    protected \Illuminate\Contracts\Filesystem\Filesystem $assetsDir;

    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected ImageManager $imageManager,
        Factory $factory
    ) {
        $this->assetsDir = $factory->disk('flarum-assets');
    }

    public function process(File $file, UploadedFile $upload, string $mimeType): void
    {
        if ($mimeType === 'image/jpeg' || $mimeType === 'image/png') {
            try {
                $image = $this->imageManager->read($upload->getRealPath());
            } catch (RuntimeException $e) {
                throw new ValidationException(['upload' => 'Corrupted image']);
            }

            if ($this->settings->get('fof-upload.mustResize')) {
                $this->resize($image);
            }

            if ($this->settings->get('fof-upload.addsWatermarks')) {
                $this->watermark($image);
            }

            $image->orient();

            $encoded = $mimeType === 'image/jpeg'
                ? $image->toJpeg(quality: 90)
                : $image->toPng();

            @file_put_contents(
                $upload->getRealPath(),
                $encoded->toString()
            );
        }
    }

    protected function resize(ImageInterface $image): void
    {
        $maxSize = $this->settings->get('fof-upload.resizeMaxWidth', Util::DEFAULT_MAX_IMAGE_WIDTH);
        $image->scaleDown(width: $maxSize, height: $maxSize);
    }

    protected function watermark(ImageInterface $image): void
    {
        $watermarkPath = $this->settings->get('fof-watermark_path');
        if ($watermarkPath && $this->assetsDir->exists($watermarkPath)) {
            $fullPath = $this->assetsDir->path($watermarkPath);
            $position = $this->settings->get('fof-upload.watermarkPosition', 'bottom-right');
            $image->place($fullPath, $position);
        }
    }
}
