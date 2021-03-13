<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) 2020 - 2021 FriendsOfFlarum.
 * Copyright (c) 2016 - 2019 Flagrow
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

use Flarum\Database\Migration;
use Flarum\Group\Group;

return Migration::addPermissions([
    'fof-upload.viewUserUploads'   => Group::MODERATOR_ID,
    'fof-upload.deleteUserUploads' => Group::MODERATOR_ID,
]);
