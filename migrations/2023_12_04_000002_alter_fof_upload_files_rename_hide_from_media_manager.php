<?php

use Flarum\Database\Migration;

return Migration::renameColumn('fof_upload_files', 'hide_from_media_manager', 'hidden');
