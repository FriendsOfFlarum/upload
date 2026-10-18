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

namespace FoF\Upload\Api\Resource;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use Flarum\Http\UrlGenerator;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Upload\Commands\DeleteFile;
use FoF\Upload\File;
use FoF\Upload\Helpers\Util;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Database\Eloquent\Builder;
use Tobyz\JsonApiServer\Context as OriginalContext;

/**
 * @extends Resource\AbstractDatabaseResource<File>
 */
class FileResource extends Resource\AbstractDatabaseResource
{
    public function __construct(
        protected Util $util,
        protected UrlGenerator $url
    ) {
    }

    public function type(): string
    {
        return 'files';
    }

    public function model(): string
    {
        return File::class;
    }

    public function scope(Builder $query, OriginalContext $context): void
    {
        $actor = $context->getActor();
        $actor->assertRegistered();

        // Deleting looks the file up through this scope, and the listing rules
        // below would 404 everything but the actor's own visible files. The
        // endpoint's can('delete') decides instead. Narrowed to this resource's
        // own Delete: the scope also runs for `files` loaded from other resources.
        if ($context->endpoint instanceof Endpoint\Delete && $context->collection instanceof self) {
            return;
        }

        $filters = $context->request->getQueryParams()['filter'] ?? [];

        if (isset($filters['shared']) && $filters['shared']) {
            if ($actor->cannot('fof-upload.access-shared-files') && $actor->cannot('fof-upload.upload-shared-files')) {
                throw new PermissionDeniedException();
            }

            $query->where('shared', true);
            if ($actor->cannot('fof-upload.upload-shared-files')) {
                $query->where('hidden', false);
            }
        } else {
            $userId = $filters['user'] ?? $actor->id;
            if ((int) $userId !== (int) $actor->id) {
                $actor->assertCan('fof-upload.viewUserUploads');
            }
            $query->where('actor_id', $userId)
                ->where('hidden', false)
                ->where('shared', false);
        }
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Index::make()
                ->authenticated()
                ->defaultInclude(['actor'])
                // FilePolicy reads each file's uploader to answer canHide and
                // canDelete: one query per file otherwise.
                ->eagerLoad(['actor'])
                ->defaultSort('-id')
                ->paginate(20, 50),
            Endpoint\Delete::make()
                ->can('delete'),
        ];
    }

    public function fields(): array
    {
        return [
            Schema\Str::make('baseName')
                ->property('base_name'),
            Schema\Str::make('path'),
            Schema\Str::make('url'),
            Schema\Str::make('type'),
            Schema\Integer::make('size'),
            Schema\Str::make('humanSize')
                ->get(fn (File $file) => $file->humanSize),
            Schema\DateTime::make('createdAt'),
            Schema\Str::make('uuid'),
            Schema\Str::make('tag'),
            Schema\Boolean::make('hidden'),
            Schema\Str::make('bbcode')
                ->get(fn (File $file) => $this->util->getBbcodeForFile($file)),
            Schema\Boolean::make('shared'),
            Schema\Boolean::make('isPrivateShared')
                ->get(fn (File $file) => $this->util->isPrivateShared($file)),
            Schema\Boolean::make('canViewInfo')
                ->get(fn (File $file, Context $context) => $context->getActor()->can('viewInfo', $file)),
            Schema\Boolean::make('canHide')
                ->get(fn (File $file, Context $context) => $context->getActor()->can('hide', $file)),
            Schema\Boolean::make('canDelete')
                ->get(fn (File $file, Context $context) => $context->getActor()->can('delete', $file)),

            Schema\Relationship\ToOne::make('actor')
                ->includable()
                ->type('users'),
        ];
    }

    /**
     * Through the same command as /fof/upload/delete, so the stored objects go
     * too, and a storage failure keeps the row rather than orphaning them.
     */
    public function delete(object $model, OriginalContext $context): void
    {
        resolve(Dispatcher::class)->dispatch(new DeleteFile($model, $context->getActor()));
    }

    public function sorts(): array
    {
        return [
            SortColumn::make('id'),
            SortColumn::make('createdAt'),
        ];
    }
}
