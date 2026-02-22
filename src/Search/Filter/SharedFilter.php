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

namespace FoF\Upload\Search\Filter;

use Flarum\Search\Database\DatabaseSearchState;
use Flarum\Search\Filter\FilterInterface;
use Flarum\Search\SearchState;

/**
 * @implements FilterInterface<DatabaseSearchState>
 */
class SharedFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'shared';
    }

    public function filter(SearchState $state, string|array $value, bool $negate): void
    {
        $shared = $this->isTruthy($value);

        $query = $state->getQuery();

        if ($negate) {
            $query->where('shared', '!=', $shared);
        } else {
            $query->where('shared', $shared);

            if ($shared && $state->getActor()->cannot('fof-upload.upload-shared-files')) {
                $query->where('hidden', false);
            }
        }
    }

    private function isTruthy(string|array $value): bool
    {
        if (is_array($value)) {
            return !empty($value);
        }

        $str = trim((string) $value, '"');

        return $str === '1' || $str === 'true' || $str === 'yes';
    }
}
