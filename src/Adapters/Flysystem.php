<?php

/*
 * This file is part of flagrow/upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */


namespace Flagrow\Upload\Adapters;

use Carbon\Carbon;
use Flagrow\Upload\Contracts\UploadAdapter;
use Flagrow\Upload\File;
use League\Flysystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;

abstract class Flysystem implements UploadAdapter
{
    /**
     * @var Filesystem
     */
    protected $filesystem;

    public function __construct(Filesystem $filesystem)
    {
        $this->filesystem = $filesystem;
    }

    /**
     * @param File $file
     * @param UploadedFile $upload
     * @param string $contents
     * @return File
     */
    public function upload(File $file, UploadedFile $upload, $contents)
    {
        $this->generateFilename($file);

        $method = 'write';

        if (is_resource($contents) && get_resource_type($contents) == 'stream') {
            $method = 'writeStream';
        }

        if (!$this->filesystem->{$method}(
            $file->path,
            $contents
        )
        ) {
            return false;
        }

        $this->generateUrl($file);

        return $file;
    }

    /**
     * @param File $file
     */
    protected function generateFilename(File $file)
    {
        $today = (new Carbon());

        $file->path = sprintf(
            "%s%s%s",
            $today->toDateString(),
            $this instanceof Local ? DIRECTORY_SEPARATOR : '/',
            $today->toTimeString() . $today->micro . '-' . $file->base_name
        );
    }

    /**
     * @param File $file
     */
    abstract protected function generateUrl(File $file);

    /**
     * In case deletion is not possible, return false.
     *
     * @param File $file
     * @return File|bool
     */
    public function delete(File $file)
    {
        if ($this->filesystem->delete($file->path)) {
            return $file;
        }

        return false;
    }

    /**
     * Whether the upload adapter works on a specific mime type.
     *
     * @param string $mime
     * @return bool
     */
    public function forMime($mime)
    {
        // We allow all, no checking.
        return true;
    }

    /**
     * @return bool
     */
    public function supportsStreams()
    {
        return true;
    }

    /**
     * @return Filesystem
     */
    public function getFilesystem()
    {
        return $this->filesystem;
    }
}
