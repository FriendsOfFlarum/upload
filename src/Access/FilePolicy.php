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
use FoF\Upload\Helpers\Util;

class FilePolicy extends AbstractPolicy
{

    private const PERM_HIDE_OWN    = 'fof-upload.hideUserUploads';
    private const PERM_HIDE_OTHERS = 'fof-upload.hideOtherUsersUploads';
    private const PERM_HIDE_SHARED = 'fof-upload.hideSharedUploads';

    private const PERM_DELETE_SHARED  = 'fof-upload.deleteSharedUploads';
    private const PERM_DELETE_OWN     = 'fof-upload.deleteUserUploads';
    private const PERM_DELETE_OTHERS  = 'fof-upload.deleteOtherUsersUploads';

    public function __construct(
        protected Util $util
    ) {
    }

    public function viewInfo(User $actor, File $file)
    {
        // for now..
        return $this->deny();
    }

    public function hide(User $actor, File $file)
    {
        $isShared = $this->util->isPrivateShared($file) || $file->shared;

        if ($isShared) {
            return $actor->can('fof-upload.hideSharedUploads') ? $this->allow() : $this->deny();
        }

        if ($file->actor_id === $actor->id) {
            return $actor->can('fof-upload.hideUserUploads') ? $this->allow() : $this->deny();
        }

        return $actor->can('fof-upload.hideOtherUsersUploads') ? $this->allow() : $this->deny();
    }

    public function delete(User $actor, File $file)
    {
        $isShared = $this->util->isPrivateShared($file) || $file->shared;

        if ($isShared) {
            return $actor->can('fof-upload.deleteSharedUploads') ? $this->allow() : $this->deny();
        }

        if ($file->actor_id === $actor->id) {
            return $actor->can('fof-upload.deleteUserUploads') ? $this->allow() : $this->deny();
        }

        return $actor->can('fof-upload.deleteOtherUsersUploads') ? $this->allow() : $this->deny();
    }
}
