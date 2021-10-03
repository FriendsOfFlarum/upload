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

namespace FoF\Upload;

use Flarum\Database\AbstractModel;

/**
 * @property int    $id
 * @property string $adapter
 * @property string $template
 * @property string $regex
 */
class Mime extends AbstractModel
{
    protected $table = 'fof_upload_mimes';
    public $timestamps = false;
}
