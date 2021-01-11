<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) 2020 - 2021 FriendsOfFlarum.
 * Copyright (c) 2016 - 2019 Flagrow
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Validators;

use Flarum\Foundation\AbstractValidator;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Helpers\Util;

class UploadValidator extends AbstractValidator
{
    protected function getRules()
    {
        /** @var SettingsRepositoryInterface $settings */
        $settings = app(SettingsRepositoryInterface::class);

        return [
            'file' => [
                'required',
                'max:'.$settings->get('fof-upload.maxFileSize', Util::DEFAULT_MAX_FILE_SIZE),
            ],
        ];
    }
}
