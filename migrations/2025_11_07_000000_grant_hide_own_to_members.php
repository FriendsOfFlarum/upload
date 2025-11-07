<?php

use Flarum\Database\Migration;
use Flarum\Group\Group;

return Migration::addPermissions([
    'fof-upload.hideUserUploads' => Group::MEMBER_ID,
]);
