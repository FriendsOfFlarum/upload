<?php

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
        if ($this->settings->get('mustResize')) {
            (new ImageManager())
                ->make($upload->getPath())
                ->resize($this->settings->get('resizeMaxWidth', Settings::DEFAULT_MAX_IMAGE_WIDTH),
                    function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    })
                ->save();
        }
    }
}