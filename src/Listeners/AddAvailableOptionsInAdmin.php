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
use FoF\Upload\Helpers\Util;

class AddAvailableOptionsInAdmin
{
    public function __construct(
        protected Util $util
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

        // Seed the default group (Member) for any new mime permission that has no assignment yet
        foreach ($mimePermissions as $perm) {
            $permKey = 'fof-upload.upload-mime.' . $perm['slug'];
            if (!Permission::where('permission', $permKey)->exists()) {
                Permission::insert(['permission' => $permKey, 'group_id' => Group::MEMBER_ID]);
            }
        }
    }
}
