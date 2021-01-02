<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
 * Copyright (c) 2016 - 2019 Flagrow
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Processors;

use Flarum\Foundation\Paths;
use Flarum\Foundation\ValidationException;
use FoF\Upload\Contracts\Processable;
use FoF\Upload\File;
use FoF\Upload\Helpers\Settings;
use Intervention\Image\Exception\NotReadableException;
use Intervention\Image\Image;
use Intervention\Image\ImageManager;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageProcessor implements Processable
{
    /**
     * @var Settings
     */
    protected $settings;

    /**
     * @var Paths
     */
    protected $paths;

    /**
     * @param Settings $settings
     * @param Paths    $paths
     */
    public function __construct(Settings $settings, Paths $paths)
    {
        $this->settings = $settings;
        $this->paths = $paths;
    }

    /**
     * @param File         $file
     * @param UploadedFile $upload
     */
    public function process(File $file, UploadedFile $upload, string $mimeType)
    {
        if ($mimeType == 'image/jpeg' || $mimeType == 'image/png') {
            try {
                $image = (new ImageManager())->make($upload->getRealPath());
            } catch (NotReadableException $e) {
                throw new ValidationException(['upload' => 'Corrupted image']);
            }

            if ($this->settings->get('mustResize')) {
                $this->resize($image);
            }

            if ($this->settings->get('addsWatermarks')) {
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
        $maxSize = $this->settings->get('resizeMaxWidth', Settings::DEFAULT_MAX_IMAGE_WIDTH);
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
        if ($this->settings->get('watermark')) {
            $image->insert(
                $this->paths->storage.DIRECTORY_SEPARATOR.$this->settings->get('watermark'),
                $this->settings->get('watermarkPosition', 'bottom-right')
            );
        }
    }
}
