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

namespace FoF\Upload\Templates;

use FoF\Upload\Contracts\Template;
use Illuminate\Contracts\View\Factory;

abstract class AbstractTemplate implements Template
{
    /**
     * @var string
     */
    protected $tag;

    public function tag(): string
    {
        return $this->tag;
    }

    /**
     * @param string $view
     * @param array  $arguments
     *
     * @return string
     */
    protected function getView($view, $arguments = [])
    {
        return resolve(Factory::class)->make($view, $arguments);
    }

    /**
     * @param $key
     * @param array $params
     *
     * @return mixed
     */
    protected function trans($key, array $params = [])
    {
        return resolve('translator')->trans($key, $params);
    }
}
