<?php

use Flarum\Group\Permission;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        Permission::query()
            ->where('permission', 'flagrow.upload')
            ->update(['permission' => 'fof-upload.upload']);
        Permission::query()
            ->where('permission', 'flagrow.upload.download')
            ->update(['permission' => 'fof-upload.download']);
    },
    'down' => function (Builder $schema) {
        // Not doing anything but `down` has to be defined
    },
];
