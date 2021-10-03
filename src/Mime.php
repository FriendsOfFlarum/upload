<?php

namespace FoF\Upload;

use Flarum\Database\AbstractModel;

/**
 * @property int $id
 * @property string $adapter
 * @property string $template
 * @property string $regex
 */
class Mime extends AbstractModel
{
    protected $table = 'fof_upload_mimes';
    public $timestamps = false;
}
