<?php

use Flarum\Database\Migration;

return Migration::addColumns('fof_upload_files', [
    'shared' => ['boolean', 'default' => false],
]);
