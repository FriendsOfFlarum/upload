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

namespace FoF\Upload\Listeners;

use Flarum\Foundation\ValidationException;
use Flarum\Settings\Event\Saving;
use FoF\Upload\Helpers\Util;
use Symfony\Contracts\Translation\TranslatorInterface;

class ValidateMimeTypes
{
    public const KEY = 'fof-upload.mimeTypes';

    public function __construct(
        protected TranslatorInterface $translator
    ) {
    }

    public function handle(Saving $event): void
    {
        if (!array_key_exists(self::KEY, $event->settings) || Util::isBlankSetting($event->settings[self::KEY])) {
            return;
        }

        $rules = json_decode((string) $event->settings[self::KEY], true);

        if (!is_array($rules)) {
            $this->fail('fof-upload.api.mime_types_invalid');
        }

        foreach (array_keys($rules) as $pattern) {
            // Compiled exactly as Util::getMimeConfiguration() runs it.
            if (trim((string) $pattern) === '' || @preg_match('/'.$pattern.'/', '') === false) {
                $this->fail('fof-upload.api.mime_pattern_invalid', ['pattern' => (string) $pattern]);
            }
        }
    }

    protected function fail(string $key, array $parameters = []): never
    {
        throw new ValidationException([self::KEY => $this->translator->trans($key, $parameters)]);
    }
}
