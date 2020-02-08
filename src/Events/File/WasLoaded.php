<?php

namespace FoF\Upload\Events\File;

use FoF\Upload\File;

class WasLoaded
{
    /**
     * @var File
     */
    public $file;

    public function __construct(File $file)
    {
        $this->file = $file;
    }
}
