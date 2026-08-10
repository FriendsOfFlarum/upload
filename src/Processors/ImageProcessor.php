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
        if (!in_array($mimeType, ['image/jpeg', 'image/png', 'image/gif'], true)) {
            return;
        }

        try {
            $image = $this->imageManager->read($upload->getRealPath());
        } catch (RuntimeException $e) {
            throw new ValidationException(['upload' => 'Corrupted image']);
        }

        if ($this->settings->get('fof-upload.mustResize')) {
            $this->resize($image);
        }

        // Watermarks are not applied to GIFs — palette reduction causes quality degradation.
        if ($this->settings->get('fof-upload.addsWatermarks') && $mimeType !== 'image/gif') {
            $this->watermark($image);
        }

        $image->orient();

        $encoded = match ($mimeType) {
            'image/jpeg' => $image->toJpeg(quality: 90),
            'image/gif'  => $image->toGif(),
            default      => $image->toPng(),
        };

        // Store dimensions so the browser can reserve layout space before the image loads.
        $file->image_width = $image->width();
        $file->image_height = $image->height();

        // Generate a downscaled thumbnail for faster page loads.
        //
        // Scaled from the in-memory image, before the full-size encode is written
        // back below. Re-reading the encoded file instead would put the thumbnail
        // through two lossy passes — the full-size quality, then the thumbnail's —
        // which visibly softens detailed images. The in-memory copy has already
        // been resized, watermarked and oriented, so the thumbnail still reflects
        // everything the full-size image shows.
        if ($this->settings->get('fof-upload.generateThumbnails')) {
            $maxWidth = max(1, (int) $this->settings->get('fof-upload.thumbnailMaxWidth'));
            $thumb = clone $image;
            $thumb->scaleDown(width: $maxWidth);

            // Store the thumbnail's own dimensions so the rendered <img> reserves the
            // correct layout space for the thumbnail it actually loads, rather than the
            // (larger) full-image dimensions.
            $file->thumbnail_width = $thumb->width();
            $file->thumbnail_height = $thumb->height();

            $useWebp = (bool) $this->settings->get('fof-upload.thumbnailWebp');
            $quality = max(1, min(100, (int) $this->settings->get('fof-upload.thumbnailQuality')));

            $thumbEncoded = $useWebp
                ? $thumb->toWebp(quality: $quality)
                : match ($mimeType) {
                    'image/jpeg' => $thumb->toJpeg(quality: $quality),
                    // GIF and PNG are lossless formats; the quality setting does
                    // not apply to them.
                    'image/gif'  => $thumb->toGif(),
                    default      => $thumb->toPng(),
                };

            $file->thumbnailContent = $thumbEncoded->toString();
            $file->thumbnailExtension = $useWebp ? 'webp' : match ($mimeType) {
                'image/jpeg' => 'jpg',
                'image/gif'  => 'gif',
                default      => 'png',
            };
        }

        // Written after the thumbnail is taken, so the thumbnail is scaled from
        // the decoded image rather than from this re-encoded file.
        @file_put_contents($upload->getRealPath(), $encoded->toString());
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
            $opacity = max(0, min(100, (int) $this->settings->get('fof-upload.watermarkOpacity', 100)));
            $sizePercent = max(1, min(100, (int) $this->settings->get('fof-upload.watermarkSizePercent', 25)));
            $padding = max(0, (int) $this->settings->get('fof-upload.watermarkPadding', 10));

            $targetWidth = (int) round($image->width() * $sizePercent / 100);
            $watermark = $this->imageManager->read($fullPath);
            $watermark->scale(width: $targetWidth);

            $image->place($watermark, $position, $padding, $padding, $opacity);
        }
    }
}
