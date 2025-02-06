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

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $db = $schema->getConnection();

        $oldRegex = '^image\/.*';
        $newRegex = '^image\/(jpeg|png|gif|webp|avif|bmp|tiff|svg\+xml)$';

        $setting = $db->table('settings')->where('key', 'fof-upload.mimeTypes')->first();

        if ($setting && isset($setting->value)) {
            $decodedValue = json_decode($setting->value, true);

            if (is_array($decodedValue)) {
                $updatedValue = [];

                foreach ($decodedValue as $mime => $config) {
                    if ($mime === $oldRegex) {
                        // Replace the old regex with the new one
                        $updatedValue[$newRegex] = $config;
                    } else {
                        // Preserve all other settings
                        $updatedValue[$mime] = $config;
                    }
                }

                $jsonUpdated = json_encode($updatedValue, JSON_UNESCAPED_SLASHES);

                if ($jsonUpdated !== $setting->value) {
                    $db->table('settings')->where('key', 'fof-upload.mimeTypes')->update(['value' => $jsonUpdated]);
                }
            }
        }
    },

    'down' => function (Builder $schema) {
        $db = $schema->getConnection();

        $oldRegex = '^image\/(jpeg|png|gif|webp|avif|bmp|tiff|svg\+xml)$';
        $newRegex = '^image\/.*';

        $setting = $db->table('settings')->where('key', 'fof-upload.mimeTypes')->first();

        if ($setting && isset($setting->value)) {
            $decodedValue = json_decode($setting->value, true);

            if (is_array($decodedValue)) {
                $revertedValue = [];

                foreach ($decodedValue as $mime => $config) {
                    if ($mime === $newRegex) {
                        // Revert back to the old regex
                        $revertedValue[$oldRegex] = $config;
                    } else {
                        // Preserve all other settings
                        $revertedValue[$mime] = $config;
                    }
                }

                $jsonReverted = json_encode($revertedValue, JSON_UNESCAPED_SLASHES);

                if ($jsonReverted !== $setting->value) {
                    $db->table('settings')->where('key', 'fof-upload.mimeTypes')->update(['value' => $jsonReverted]);
                }
            }
        }
    },
];
