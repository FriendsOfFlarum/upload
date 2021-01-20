<?php

namespace FoF\Upload\Events\Adapter;

use FoF\Upload\Helpers\Util;

class Instantiate
{
    public string $adapter;
    public Util $util;

    public function __construct(string $adapter, Util $util)
    {
        $this->adapter = $adapter;
        $this->util = $util;
    }
}
