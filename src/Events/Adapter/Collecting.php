<?php

namespace FoF\Upload\Events\Adapter;

use Illuminate\Support\Collection;

class Collecting
{
    /**
     * @var Collection
     */
    public $adapters;

    public function __construct(Collection &$adapters)
    {
        $this->adapters = &$adapters;
    }
}
