<?php

namespace FoF\Upload\Validators;

use FoF\Upload\Helpers\Settings;
use Flarum\Foundation\AbstractValidator;

class UploadValidator extends AbstractValidator
{
    protected function getRules()
    {
        /** @var Settings $settings */
        $settings = app(Settings::class);

        return [
            'file' => [
                'required',
                'max:' . $settings->get('maxFileSize', Settings::DEFAULT_MAX_FILE_SIZE),
            ],
        ];
    }
}
