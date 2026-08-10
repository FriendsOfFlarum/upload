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

namespace FoF\Upload\Access;

use Flarum\Discussion\Discussion;
use Flarum\Extension\ExtensionManager;
use Flarum\User\User;
use FoF\Upload\File;

/**
 * Widens the scope of the existing 'fof-upload.download' permission so it can
 * optionally be restricted per tag.
 *
 * There is deliberately only ONE download permission. Checking it against a
 * Tag model makes flarum/tags' TagPolicy resolve it to
 * `tag{id}.fof-upload.download`, and it only does so when the tag is flagged
 * `is_restricted`. So an admin who does nothing keeps the existing global
 * behaviour; an admin who restricts a tag gets a per-tag dropdown for the same
 * permission.
 *
 * When flarum/tags is not enabled this gate is inert: only the global
 * permission applies.
 */
class TagScopedDownloadGate
{
    /**
     * The download ability. Combined with a tag id by flarum/tags' TagPolicy
     * as `tag{id}.fof-upload.download` — the same permission as the global
     * one, not a second permission.
     */
    public const ABILITY = 'fof-upload.download';

    public function __construct(
        protected ExtensionManager $extensions
    ) {
    }

    /**
     * Whether tag scoping applies at all on this forum.
     */
    public function enabled(): bool
    {
        return $this->extensions->isEnabled('flarum-tags');
    }

    /**
     * Whether the actor may download this file, given the discussion the
     * download was initiated from.
     *
     * $discussion is null for the bare-UUID download route, which carries no
     * post context. In that case the file's own post relationships are used
     * instead so the route cannot be used to sidestep tag scoping.
     */
    public function allows(User $actor, File $file, ?Discussion $discussion = null): bool
    {
        // Admins are never gated, consistent with Flarum's permission model.
        if ($actor->isAdmin() || !$this->enabled()) {
            return true;
        }

        $discussions = $discussion !== null
            ? [$discussion]
            : $this->discussionsForFile($file);

        // A file with no discussion context at all (e.g. a media-library file
        // that was never posted) is not tag-scoped.
        if (empty($discussions)) {
            return true;
        }

        // Most-restrictive semantics: the actor must be permitted in every
        // discussion the file appears in. This is deliberate for the primary
        // use case (confidential documents in a restricted tag) — a file that
        // also happens to be attached in an open discussion must not become
        // downloadable to everyone.
        foreach ($discussions as $each) {
            if (!$this->allowsForDiscussion($actor, $each)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Whether the actor may download files within this discussion.
     *
     * Exposed for the frontend so the download button can be rendered in a
     * disabled state: the client requirement is that users without permission
     * still SEE that a download exists. This is presentation only — the real
     * boundary is enforced in DownloadHandler.
     */
    public function allowsInDiscussion(User $actor, Discussion $discussion): bool
    {
        if ($actor->isAdmin()) {
            return true;
        }

        // Mirror the full server-side decision, global permission included, so the
        // button state matches what a download attempt would actually do.
        if (!$actor->hasPermission('fof-upload.download')) {
            return false;
        }

        if (!$this->enabled()) {
            return true;
        }

        return $this->allowsForDiscussion($actor, $discussion);
    }

    protected function allowsForDiscussion(User $actor, Discussion $discussion): bool
    {
        // 'tags' is a relation added at runtime by flarum/tags, so it is resolved
        // dynamically rather than as a declared property on Discussion.
        $tags = $discussion->getRelationValue('tags');

        if ($tags === null || $tags->isEmpty()) {
            return true;
        }

        // Only restricted tags narrow the download. An unrestricted tag returns
        // null from flarum/tags' TagPolicy, which falls back to the global
        // permission — already asserted by the caller. Skipping those tags keeps
        // this a pure *additional* restriction: a discussion whose tags are all
        // unrestricted behaves exactly as it did before this feature existed.
        foreach ($tags as $tag) {
            if (!$tag->is_restricted) {
                continue;
            }

            if (!$actor->can(self::ABILITY, $tag)) {
                return false;
            }
        }

        return true;
    }

    /**
     * All discussions this file has been posted in.
     *
     * @return Discussion[]
     */
    protected function discussionsForFile(File $file): array
    {
        $discussions = [];

        foreach ($file->posts()->with('discussion.tags')->get() as $post) {
            /** @var Discussion|null $discussion */
            $discussion = $post->getRelationValue('discussion');

            if ($discussion !== null) {
                $discussions[$discussion->id] = $discussion;
            }
        }

        return array_values($discussions);
    }
}
