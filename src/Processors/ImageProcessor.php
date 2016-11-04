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

namespace Flagrow\Upload\Processors;

use Flagrow\Upload\Contracts\Processable;
use Flagrow\Upload\File;
use Flagrow\Upload\Helpers\Settings;
use Intervention\Image\ImageManager;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageProcessor implements Processable
{
    /**
     * @var Settings
     */
    protected $settings;


    /**
     * @param Settings $settings
     */
    public function __construct(Settings $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param File $file
     * @param UploadedFile $upload
     * @return File
     */
    public function process(File &$file, UploadedFile &$upload)
    {
        if ($this->settings->get('mustResize') && $upload->getMimeType() != 'image/gif') {
            @file_put_contents(
                $upload->getRealPath(),
                (new ImageManager())
                    ->make($upload->getRealPath())
                    ->resize(
                        $this->settings->get('resizeMaxWidth', Settings::DEFAULT_MAX_IMAGE_WIDTH),
                        null,
                        function ($constraint) {
                            $constraint->aspectRatio();
                            $constraint->upsize();
                        })
                    ->encode($upload->getMimeType()));
        }
    }
}
