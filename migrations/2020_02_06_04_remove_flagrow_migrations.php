<?php

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->getConnection()->table('migrations')->whereExtension('flagrow-upload')->delete();
    },
    'down' => function (Builder $schema) {
        // Not doing anything but `down` has to be defined
    },
];
