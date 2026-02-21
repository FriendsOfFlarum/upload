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
use Flarum\Search\ValidateFilterTrait;

/**
 * @implements FilterInterface<DatabaseSearchState>
 */
class UserFilter implements FilterInterface
{
    use ValidateFilterTrait;

    public function getFilterKey(): string
    {
        return 'user';
    }

    public function filter(SearchState $state, string|array $value, bool $negate): void
    {
        $userId = $this->asInt($value);
        $actor = $state->getActor();

        if ($userId !== (int) $actor->id) {
            $actor->assertCan('fof-upload.viewUserUploads');
        }

        $query = $state->getQuery();

        if ($negate) {
            $query->where('actor_id', '!=', $userId);
        } else {
            $query->where('actor_id', $userId)
                ->where('hidden', false)
                ->where('shared', false);
        }
    }
}
