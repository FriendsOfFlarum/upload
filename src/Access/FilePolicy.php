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
        $privateShared = $this->util->isPrivateShared($file);
        $fileIsShared = $privateShared || $file->shared;

        if ($fileIsShared) {
            if ($actor->can('fof-upload.hideSharedUploads')) {
                return $this->allow();
            }
        } else {
            if ($file->actor_id === $actor->id) {
                if ($actor->can('fof-upload.hideUserUploads')) {
                    return $this->allow();
                }
            } else {
                if ($actor->can('fof-upload.hideOtherUsersUploads')) {
                    return $this->allow();
                }
            }
        }

        /**
         * Deny by default if none of the above conditions are met.
         */
        return $this->deny();
    }

    public function delete(User $actor, File $file)
    {
        $privateShared = $this->util->isPrivateShared($file);
        $fileIsShared = $privateShared || $file->shared;

        if ($fileIsShared) {
            if ($actor->can('fof-upload.deleteSharedUploads')) {
                return $this->allow();
            }
        } else {
            if ($file->actor_id === $actor->id) {
                if ($actor->can('fof-upload.deleteUserUploads')) {
                    return $this->allow();
                }
            } else {
                if ($actor->can('fof-upload.deleteOtherUsersUploads')) {
                    return $this->allow();
                }
            }
        }

        /**
         * Deny by default if none of the above conditions are met.
         */
        return $this->deny();
    }
}
