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

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;
use FoF\Upload\File;

/**
 * Refusals return null rather than deny(): a deny() would override the admin
 * fallback in the Gate, and admins may hide and delete any file.
 */
class FilePolicy extends AbstractPolicy
{
    public function viewInfo(User $actor, File $file): string
    {
        // for now..
        return $this->deny();
    }

    public function hide(User $actor, File $file): ?string
    {
        // Hiding a shared file moves it between public and private storage.
        if ($file->shared) {
            return $actor->hasPermission('fof-upload.upload-shared-files') ? $this->allow() : null;
        }

        if ($this->owns($actor, $file) || $actor->hasPermission('fof-upload.deleteUserUploads')) {
            return $this->allow();
        }

        return null;
    }

    public function delete(User $actor, File $file): ?string
    {
        if ($file->shared) {
            return $actor->hasPermission('fof-upload.upload-shared-files') ? $this->allow() : null;
        }

        if ($actor->hasPermission('fof-upload.deleteUserUploads')) {
            return $this->allow();
        }

        if ($this->owns($actor, $file) && $actor->hasPermission('fof-upload.deleteOwnUploads')) {
            return $this->allow();
        }

        return null;
    }

    /**
     * Compared on actor_id, so it needs no query, and a file whose uploader was
     * deleted belongs to nobody (rather than to any guest-like actor).
     */
    protected function owns(User $actor, File $file): bool
    {
        return $file->actor_id !== null && $actor->id !== null && (int) $file->actor_id === (int) $actor->id;
    }
}
