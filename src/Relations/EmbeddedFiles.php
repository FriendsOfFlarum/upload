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

namespace FoF\Upload\Relations;

use Flarum\Post\Post;
use FoF\Upload\File;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use s9e\TextFormatter\Utils;

/**
 * The files a post's content embeds as previews, which rendering it looks up.
 *
 * They are read from the content itself rather than the fof_upload_file_posts
 * mapping, which can miss them: image previews from before #420 name their
 * file by URL alone, and forums that never ran fof:upload:map have no mapping
 * for them. Eager loaded, the files for every post on a page take one query.
 *
 * @extends Relation<File, Post, Collection<int, File>>
 */
class EmbeddedFiles extends Relation
{
    public const NAME = 'fofEmbeddedFiles';

    /** @var array{uuids: string[], urls: string[]} */
    protected array $references = ['uuids' => [], 'urls' => []];

    public function __construct(Post $post)
    {
        parent::__construct(File::query(), $post);
    }

    /**
     * The uuids and URLs by which content names the files it embeds.
     *
     * @return array{uuids: string[], urls: string[]}
     */
    public static function referencesIn(?string $xml): array
    {
        $references = ['uuids' => [], 'urls' => []];

        if ($xml === null || !str_contains($xml, '<UPL-')) {
            return $references;
        }

        foreach (['UPL-IMAGE-PREVIEW', 'UPL-IMAGE', 'UPL-TEXT-PREVIEW'] as $tagName) {
            Utils::replaceAttributes($xml, $tagName, function (array $attributes) use (&$references) {
                if (!empty($attributes['uuid'])) {
                    $references['uuids'][] = $attributes['uuid'];
                } elseif (!empty($attributes['url'])) {
                    $references['urls'][] = $attributes['url'];
                }

                return $attributes;
            });
        }

        return array_map(fn (array $values) => array_values(array_unique($values)), $references);
    }

    /**
     * Narrow a query to the files with these uuids or URLs.
     *
     * @param Builder<File>                          $query
     * @param array{uuids: string[], urls: string[]} $references
     *
     * @return Builder<File>
     */
    public static function constrain(Builder $query, array $references): Builder
    {
        return $query->where(function (Builder $query) use ($references) {
            $query->whereIn('uuid', $references['uuids'])->orWhereIn('url', $references['urls']);
        });
    }

    /**
     * The one a preview names, by its uuid or, without one, its URL.
     *
     * @param Collection<int, File> $files
     */
    public static function pick(Collection $files, ?string $uuid, ?string $url): ?File
    {
        if ($uuid) {
            return $files->first(fn (File $file) => $file->uuid === $uuid);
        }

        return $url ? $files->first(fn (File $file) => $file->url === $url) : null;
    }

    public function addConstraints(): void
    {
        if (static::$constraints) {
            $this->addEagerConstraints([$this->parent]);
        }
    }

    public function addEagerConstraints(array $models): void
    {
        foreach ($models as $post) {
            $references = static::referencesIn($this->contentOf($post));

            $this->references['uuids'] = array_merge($this->references['uuids'], $references['uuids']);
            $this->references['urls'] = array_merge($this->references['urls'], $references['urls']);
        }

        $this->references = array_map(fn (array $values) => array_values(array_unique($values)), $this->references);

        static::constrain($this->query, $this->references);
    }

    public function initRelation(array $models, $relation): array
    {
        foreach ($models as $post) {
            $post->setRelation($relation, $this->related->newCollection());
        }

        return $models;
    }

    public function match(array $models, Collection $results, $relation): array
    {
        foreach ($models as $post) {
            $references = static::referencesIn($this->contentOf($post));

            $post->setRelation($relation, $results->filter(
                fn (File $file) => in_array($file->uuid, $references['uuids'], true) || in_array($file->url, $references['urls'], true)
            )->values());
        }

        return $models;
    }

    public function getResults(): Collection
    {
        return $this->embedsAny() ? $this->query->get() : new Collection();
    }

    public function getEager(): Collection
    {
        // Posts without previews, like most, need no query at all.
        return $this->embedsAny() ? parent::getEager() : new Collection();
    }

    protected function embedsAny(): bool
    {
        return $this->references['uuids'] || $this->references['urls'];
    }

    /** The content as stored, which only comment posts hold as XML. */
    protected function contentOf(Model $post): ?string
    {
        $content = $post->getAttributes()['content'] ?? null;

        return is_string($content) ? $content : null;
    }
}
