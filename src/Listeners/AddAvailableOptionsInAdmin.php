<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) 2020 - 2021 FriendsOfFlarum.
 * Copyright (c) 2016 - 2019 Flagrow
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Listeners;

use Flarum\Settings\Event\Deserializing;
use FoF\Upload\Helpers\Util;

class AddAvailableOptionsInAdmin
{
    /**
     * @var Util
     */
    protected $util;

    public function __construct(Util $util)
    {
        $this->util = $util;
    }

    public function handle(Deserializing $event)
    {
        $event->settings['fof-upload.availableUploadMethods'] = $this->util->getAvailableUploadMethods()->toArray();
        $event->settings['fof-upload.availableTemplates'] = $this->util->getAvailableTemplates()->toArray();
    }
}
