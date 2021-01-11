<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) 2020 - 2021 FriendsOfFlarum.
 * Copyright (c) 2016 - 2019 Flagrow
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Contracts;

use FoF\Upload\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;

interface UploadAdapter
{
    /**
     * Whether the upload adapter works on a specific mime type.
     *
     * @param string $mime
     *
     * @return bool
     */
    public function forMime($mime);

    /**
     * Whether the upload supports a stream.
     *
     * @return bool
     */
    public function supportsStreams();

    /**
     * Attempt to upload to the (remote) filesystem.
     *
     * @param File         $file
     * @param UploadedFile $upload
     * @param string       $contents
     *
     * @return File|bool
     */
    public function upload(File $file, UploadedFile $upload, $contents);

    /**
     * In case deletion is not possible, return false.
     *
     * @param File $file
     *
     * @return File|bool
     */
    public function delete(File $file);
}
