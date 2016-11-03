<?php
/*
 * This file is part of flagrow/flarum-ext-file-upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Flagrow\Upload;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listeners\AddUploadsApi::class);
    $events->subscribe(Listeners\AddClientAssets::class);
};
