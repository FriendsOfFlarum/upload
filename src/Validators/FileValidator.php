<?php

namespace Flagrow\Upload\Validators;

use Flagrow\Upload\Helpers\Settings;
use Flarum\Core\Validator\AbstractValidator;

class FileValidator extends AbstractValidator
{
    protected function getRules()
    {
        /** @var Settings $settings */
        $settings = app(Settings::class);

        return [
            'file' => [
                'required',
                'file',
                'max:' . $settings->get('maxFileSize', Settings::DEFAULT_MAX_FILE_SIZE)
            ]
        ];
    }
}