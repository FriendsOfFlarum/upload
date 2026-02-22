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

use Flarum\Search\Database\AbstractSearcher;
use Flarum\Search\Database\DatabaseSearchState;
use Flarum\User\User;
use FoF\Upload\File;
use Illuminate\Database\Eloquent\Builder;

class FileSearcher extends AbstractSearcher
{
    public function getQuery(User $actor): Builder
    {
        $actor->assertRegistered();

        return File::query()->select('fof_upload_files.*');
    }

    protected function applySort(DatabaseSearchState $state, ?array $sort = null, bool $sortIsDefault = false): void
    {
        $state->setDefaultSort(['id' => 'desc']);

        parent::applySort($state, $sort, $sortIsDefault);
    }
}
