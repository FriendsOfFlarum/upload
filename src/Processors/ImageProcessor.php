<?php

namespace FoF\Upload\Processors;

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
     * @param Settings $settings
     */
    public function __construct(Settings $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param File         $file
     * @param UploadedFile $upload
     */
    public function process(File $file, UploadedFile $upload, String $mimeType)
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
        $manager->resize(
            $this->settings->get('resizeMaxWidth', Settings::DEFAULT_MAX_IMAGE_WIDTH),
            null,
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
                storage_path($this->settings->get('watermark')),
                $this->settings->get('watermarkPosition', 'bottom-right')
            );
        }
    }
}
