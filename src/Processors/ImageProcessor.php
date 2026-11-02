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
use Throwable;
use ValueError;

class ImageProcessor implements Processable
{
    public const PROCESSED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

    /**
     * Types that get a thumbnail and recorded dimensions, but whose full-size
     * file is stored as uploaded. A re-encode could drop WebP animation, and
     * not every server's image driver can read or write these formats.
     */
    public const THUMBNAIL_ONLY_TYPES = ['image/webp', 'image/avif'];

    /**
     * Every type a thumbnail can be generated for.
     */
    public const THUMBNAIL_TYPES = [...self::PROCESSED_TYPES, ...self::THUMBNAIL_ONLY_TYPES];

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
        if (in_array($mimeType, self::THUMBNAIL_ONLY_TYPES, true)) {
            $this->processThumbnailOnly($file, $upload->getRealPath(), $mimeType);

            return;
        }

        if (!in_array($mimeType, self::PROCESSED_TYPES, true)) {
            return;
        }

        try {
            $image = $this->imageManager->read($upload->getRealPath());
        } catch (RuntimeException|ValueError $e) {
            // A ValueError is how intervention/gif rejects values it doesn't
            // know, such as a frame disposal method GIF89a reserves (#528).
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
        $this->generateThumbnail($file, $image, $mimeType);

        // Written after the thumbnail is taken, so the thumbnail is scaled from
        // the decoded image rather than from this re-encoded file.
        @file_put_contents($upload->getRealPath(), $encoded->toString());
    }

    /**
     * Prepare a thumbnail for a stored image that is about to be written to an
     * adapter again, such as a shared image made public. Unreadable contents
     * leave the file without one, as a thumbnail is optional.
     */
    public function generateThumbnailFromContents(File $file, string $contents): void
    {
        if (!in_array($file->type, self::THUMBNAIL_TYPES, true) || !$this->settings->get('fof-upload.generateThumbnails')) {
            return;
        }

        try {
            $image = $this->imageManager->read($contents);
        } catch (Throwable) {
            // Broad on purpose: the decoders also throw ValueError (#528), and
            // an optional thumbnail must never stop the file being stored.
            return;
        }

        $this->generateOptionalThumbnail($file, $image, $file->type);
    }

    /**
     * Record the dimensions of a WebP or AVIF upload and prepare its thumbnail.
     * The upload itself is not changed. When the image driver cannot read or
     * encode the format, the file is stored without them, as it was before
     * these formats got thumbnails.
     */
    protected function processThumbnailOnly(File $file, string $path, string $mimeType): void
    {
        try {
            $image = $this->imageManager->read($path);
            $image->orient();
        } catch (Throwable) {
            return;
        }

        $file->image_width = $image->width();
        $file->image_height = $image->height();

        $this->generateOptionalThumbnail($file, $image, $mimeType);
    }

    /**
     * Generate a thumbnail, or leave the file without one when that fails. A
     * driver can decode a format it cannot encode, and an optional thumbnail
     * must never stop the file being stored.
     */
    protected function generateOptionalThumbnail(File $file, ImageInterface $image, string $mimeType): void
    {
        try {
            $this->generateThumbnail($file, $image, $mimeType);
        } catch (Throwable) {
            $file->thumbnail_width = null;
            $file->thumbnail_height = null;
            $file->thumbnailContent = null;
            $file->thumbnailExtension = null;
        }
    }

    /**
     * Sets the file's thumbnail content, extension and dimensions, which the
     * adapter's upload() writes alongside the file. A no-op with thumbnails off.
     */
    public function generateThumbnail(File $file, ImageInterface $image, string $mimeType): void
    {
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

            [$file->thumbnailContent, $file->thumbnailExtension] = self::encodeThumbnail($thumb, $mimeType, $useWebp, $quality);
        }
    }

    /**
     * Encode a scaled thumbnail. With WebP thumbnails off, it keeps the
     * source's format.
     *
     * @return array{string, string} The encoded bytes and the file extension.
     */
    public static function encodeThumbnail(ImageInterface $thumb, string $mimeType, bool $useWebp, int $quality): array
    {
        if ($useWebp) {
            return [$thumb->toWebp(quality: $quality)->toString(), 'webp'];
        }

        return match ($mimeType) {
            'image/jpeg' => [$thumb->toJpeg(quality: $quality)->toString(), 'jpg'],
            'image/webp' => [$thumb->toWebp(quality: $quality)->toString(), 'webp'],
            'image/avif' => [$thumb->toAvif(quality: $quality)->toString(), 'avif'],
            // GIF and PNG are lossless formats; the quality setting does
            // not apply to them.
            'image/gif'  => [$thumb->toGif()->toString(), 'gif'],
            default      => [$thumb->toPng()->toString(), 'png'],
        };
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
