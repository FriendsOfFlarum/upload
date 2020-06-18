<?php

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $fromKey = 'fof-upload.resizeMaxWidth';
        $toKey = 'fof-upload.resizeMaxSize';

        $settings = app(SettingsRepositoryInterface::class);
        $value = $settings->get($fromKey);
        if (!is_null($value)) {
            $settings->set($toKey, $value);
            $settings->delete($fromKey);
        }
    },
    'down' => function (Builder $schema) {
        $fromKey = 'fof-upload.resizeMaxSize';
        $toKey = 'fof-upload.resizeMaxWidth';

        $settings = app(SettingsRepositoryInterface::class);
        $value = $settings->get($fromKey);
        if (!is_null($value)) {
            $settings->set($toKey, $value);
            $settings->delete($fromKey);
        }
    },
];
