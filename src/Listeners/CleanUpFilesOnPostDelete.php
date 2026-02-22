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

namespace FoF\Upload\Listeners;

use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Adapters\Manager;

class CleanUpFilesOnPostDelete
{
    public function __construct(
        private SettingsRepositoryInterface $settings,
        private Manager $manager,
    ) {
    }

    /**
     * Fires before the post is deleted (and before the DB cascade removes pivot rows),
     * so we can still read which files are associated with this post.
     */
    public function deleting(Post $post): void
    {
        if (!$this->settings->get('fof-upload.deleteFilesOnPostDelete', false)) {
            return;
        }

        // Load files now — before the cascade wipes the fof_upload_file_posts rows.
        $files = $post->files()
            ->where('shared', false)
            ->get();

        foreach ($files as $file) {
            // Only delete if this post is the file's sole association.
            // posts()->count() is still accurate here because the cascade hasn't run yet.
            if ($file->posts()->count() !== 1) {
                // File is referenced by other posts — leave it; cascade removes only this pivot row.
                continue;
            }

            $adapter = $this->manager->instantiate($file->upload_method);

            if ($adapter->delete($file)) {
                $file->delete();
            }
            // If storage deletion fails we leave the DB record intact — no silent data loss.
        }
    }
}
