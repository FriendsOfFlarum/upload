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

namespace FoF\Upload\Adapters;

use Carbon\Carbon;
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\File;
use League\Flysystem\Config;
use League\Flysystem\FilesystemAdapter;
use League\Flysystem\FilesystemException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

abstract class Flysystem implements UploadAdapter
{
    /**
     * @var array
     */
    protected $meta;

    public function __construct(
        protected FilesystemAdapter $adapter,
        protected SettingsRepositoryInterface $settings,
        protected UrlGenerator $url
    ) {
    }

    /**
     * Define adapter-specific configuration.
     *
     * @return Config
     */
    protected function getConfig()
    {
        return new Config();
    }

    /**
     * @param File         $file
     * @param UploadedFile $upload
     * @param mixed        $contents
     *
     * @return File|bool
     */
    public function upload(File $file, ?UploadedFile $upload = null, $contents = null)
    {
        $this->generateFilename($file);

        $method = 'write';

        if (is_resource($contents) && get_resource_type($contents) == 'stream') {
            $method = 'writeStream';
        }

        try {
            $this->adapter->{$method}($file->path, $contents, $this->getConfig());
        } catch (FilesystemException $e) {
            return false;
        }

        $this->meta = ['path' => $file->path];

        $this->generateUrl($file);

        // Write thumbnail if ImageProcessor generated one.
        if ($file->thumbnailContent !== null) {
            $thumbPath = $this->thumbnailPath($file);

            try {
                $this->adapter->write($thumbPath, $file->thumbnailContent, $this->getConfig());
                $file->thumbnail_path = $thumbPath;
                $this->generateThumbnailUrl($file);
            } catch (FilesystemException) {
                // Non-fatal — thumbnail is optional; continue without it.
            } finally {
                $file->thumbnailContent = null; // free memory
            }
        }

        return $file;
    }

    protected function generateFilename(File $file): void
    {
        $today = (new Carbon());

        $file->path = sprintf(
            '%s%s%s',
            $today->toDateString(),
            $this instanceof Local ? DIRECTORY_SEPARATOR : '/',
            $today->timestamp.'-'.$today->micro.'-'.$file->base_name
        );
    }

    abstract protected function generateUrl(File $file): void;

    /**
     * Derive the thumbnail storage path from the main file path.
     * e.g. 2026-02-22/1234-photo.jpg → 2026-02-22/1234-photo-thumb.webp.
     */
    protected function thumbnailPath(File $file): string
    {
        $ext = $file->thumbnailExtension ?? 'webp';

        return preg_replace('/\.[^.\/]+$/', "-thumb.{$ext}", $file->path)
            ?? $file->path."-thumb.{$ext}";
    }

    /**
     * Generate and store the thumbnail URL by temporarily swapping the file path.
     * Reuses the subclass generateUrl() logic without duplication.
     */
    protected function generateThumbnailUrl(File $file): void
    {
        $savedPath = $file->path;
        $savedUrl = $file->url;

        $file->path = $file->thumbnail_path;
        $this->generateUrl($file);
        $file->thumbnail_url = $file->url;

        $file->path = $savedPath;
        $file->url = $savedUrl;
    }

    /**
     * Write a thumbnail for an existing file (used by the backfill console command).
     * Sets $file->thumbnail_path and $file->thumbnail_url; caller must call $file->save().
     */
    public function storeThumbnail(File $file, string $content, string $ext): bool
    {
        $file->thumbnailExtension = $ext;
        $thumbPath = $this->thumbnailPath($file);

        try {
            $this->adapter->write($thumbPath, $content, $this->getConfig());
            $file->thumbnail_path = $thumbPath;
            $this->generateThumbnailUrl($file);

            return true;
        } catch (FilesystemException) {
            return false;
        }
    }

    /**
     * In case deletion is not possible, return false.
     *
     * @param File $file
     *
     * @return File|bool
     */
    public function delete(File $file)
    {
        try {
            $this->adapter->delete($file->path);

            return $file;
        } catch (FilesystemException $e) {
            return false;
        }
    }

    /**
     * Whether the upload adapter works on a specific mime type.
     *
     * @param string $mime
     *
     * @return bool
     */
    public function forMime($mime): bool
    {
        // We allow all, no checking.
        return true;
    }

    /**
     * @return bool
     */
    public function supportsStreams(): bool
    {
        return true;
    }
}
