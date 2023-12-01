<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) FriendsOfFlarum.
 * Copyright (c) Flagrow.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Validators;

use Flarum\Foundation\AbstractValidator;
use Flarum\Settings\SettingsRepositoryInterface;

class UploadValidator extends AbstractValidator
{
    protected function getRules(): array
    {
        return [
            'file' => [
                'required',
                'max:'.$this->maxFilesize(),
            ],
        ];
    }

    public function getMessages()
    {
        return [
            'max' => $this->translator->trans('fof-upload.forum.validation.max_size', [
                'max' => $this->maxFilesize(),
            ]),
        ];
    }

    protected function maxFilesize(): int
    {
        /** @var SettingsRepositoryInterface $settings */
        $settings = resolve(SettingsRepositoryInterface::class);

        return $settings->get('fof-upload.maxFileSize');
    }
}
