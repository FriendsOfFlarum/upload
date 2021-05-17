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
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\File;
use League\Flysystem\AdapterInterface;
use League\Flysystem\Config;
use Symfony\Component\HttpFoundation\File\UploadedFile;

abstract class Flysystem implements UploadAdapter
{
    /**
     * @var AdapterInterface
     */
    protected $adapter;

    /**
     * @var array|false
     */
    protected $meta;

    public function __construct(AdapterInterface $adapter)
    {
        $this->adapter = $adapter;
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
     * @param string       $contents
     *
     * @return File
     */
    public function upload(File $file, UploadedFile $upload, $contents)
    {
        $this->generateFilename($file);

        $method = 'write';

        if (is_resource($contents) && get_resource_type($contents) == 'stream') {
            $method = 'writeStream';
        }

        $meta = $this->adapter->{$method}($file->path, $contents, $this->getConfig());

        if (!$meta) {
            return false;
        }

        $this->meta = $meta;

        $this->generateUrl($file);

        return $file;
    }

    protected function generateFilename(File $file)
    {
        $today = (new Carbon());

        $file->path = sprintf(
            '%s%s%s',
            $today->toDateString(),
            $this instanceof Local ? DIRECTORY_SEPARATOR : '/',
            $today->timestamp.'-'.$today->micro.'-'.$file->base_name
        );
    }

    abstract protected function generateUrl(File $file);

    /**
     * In case deletion is not possible, return false.
     *
     * @param File $file
     *
     * @return File|bool
     */
    public function delete(File $file)
    {
        if ($this->adapter->delete($file->path)) {
            return $file;
        }

        return false;
    }

    /**
     * Whether the upload adapter works on a specific mime type.
     *
     * @param string $mime
     *
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
}
