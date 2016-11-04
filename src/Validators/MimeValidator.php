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
                'regex:/^(image|audio|video)\/.*$/'
            ]
        ];
    }
}
