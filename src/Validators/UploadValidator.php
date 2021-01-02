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

namespace FoF\Upload\Validators;

use Flarum\Foundation\AbstractValidator;
use FoF\Upload\Helpers\Settings;

class UploadValidator extends AbstractValidator
{
    protected function getRules()
    {
        /** @var Settings $settings */
        $settings = app(Settings::class);

        return [
            'file' => [
                'required',
                'max:'.$settings->get('maxFileSize', Settings::DEFAULT_MAX_FILE_SIZE),
            ],
        ];
    }
}
