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

namespace FoF\Upload\Contracts;

use FoF\Upload\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;

interface Processable
{
    /**
     * @param File         $file
     * @param UploadedFile $upload
     * @param string       $mime
     *
     * @return File
     */
    public function process(File $file, UploadedFile $upload, string $mime);
}
