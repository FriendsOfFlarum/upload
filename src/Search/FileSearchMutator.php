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

namespace FoF\Upload\Search;

use Flarum\Search\Database\DatabaseSearchState;
use Flarum\Search\SearchCriteria;
use Flarum\Search\SearchState;

class FileSearchMutator
{
    public function __invoke(SearchState $state, SearchCriteria $criteria): void
    {
        if (! $state instanceof DatabaseSearchState) {
            return;
        }

        $filters = $criteria->filters;

        // When neither shared nor user filter is applied, default to actor's own files
        if (empty($filters['shared']) && empty($filters['user'])) {
            $actor = $state->getActor();
            $state->getQuery()
                ->where('actor_id', $actor->id)
                ->where('hidden', false)
                ->where('shared', false);
        }
    }
}
