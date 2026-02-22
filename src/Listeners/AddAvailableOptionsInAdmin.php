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

use Flarum\Group\Group;
use Flarum\Group\Permission;
use Flarum\Settings\Event\Deserializing;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Helpers\Util;

class AddAvailableOptionsInAdmin
{
    public function __construct(
        protected Util $util,
        protected SettingsRepositoryInterface $settings
    ) {
    }

    public function handle(Deserializing $event): void
    {
        $event->settings['fof-upload.availableUploadMethods'] = $this->util->getAvailableUploadMethods()->toArray();
        $event->settings['fof-upload.availableTemplates'] = $this->util->getAvailableTemplates()->toArray();
        $event->settings['fof-upload.php_ini.post_max_size'] = ini_get('post_max_size');
        $event->settings['fof-upload.php_ini.upload_max_filesize'] = ini_get('upload_max_filesize');

        // Expose mime-type permissions for dynamic frontend registration in the permission grid
        $mimePermissions = $this->util->getMimePermissions();
        $event->settings['fof-upload.mimePermissions'] = $mimePermissions->toArray();

        // Seed the default group (Member) for any mime permission slug that has never been
        // seeded before. We track seeded slugs in a setting so that we do NOT re-seed on
        // subsequent page loads — otherwise an admin setting a permission to "Admin only"
        // (which deletes the group_permission row) would have it restored on the next visit.
        $seeded = json_decode($this->settings->get('fof-upload.seededMimePermissions', '[]'), true) ?? [];

        $newlySeeded = false;
        foreach ($mimePermissions as $perm) {
            $slug = $perm['slug'];
            if (in_array($slug, $seeded, true)) {
                continue;
            }
            // Mark as seeded regardless — if a row already exists (left over from a previous
            // version of this code) we skip the insert to avoid a duplicate-key error, but we
            // still record the slug so we never attempt to seed it again.
            if (!Permission::where('permission', 'fof-upload.upload-mime.'.$slug)
                           ->where('group_id', Group::MEMBER_ID)
                           ->exists()) {
                Permission::insert(['permission' => 'fof-upload.upload-mime.'.$slug, 'group_id' => Group::MEMBER_ID]);
            }
            $seeded[] = $slug;
            $newlySeeded = true;
        }

        if ($newlySeeded) {
            $this->settings->set('fof-upload.seededMimePermissions', json_encode(array_values($seeded)));
        }
    }
}
