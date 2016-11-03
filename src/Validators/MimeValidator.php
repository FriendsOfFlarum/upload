<?php

namespace Flagrow\Upload\Validators;

use Flarum\Core\Validator\AbstractValidator;

class MimeValidator extends AbstractValidator
{

    public function getRules()
    {
        return [
            'mime' => [
                'required',
                'string',
                'regex:/^(image|text|audio|video)\/.*$/'
            ]
        ];
    }
}