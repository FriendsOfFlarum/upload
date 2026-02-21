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

namespace FoF\Upload\Api\Controllers;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Filesystem\Factory;
use Psr\Http\Message\ServerRequestInterface;

/**
 * @TODO: Remove this in favor of one of the API resource classes that were added.
 *      Or extend an existing API Resource to add this to.
 *      Or use a vanilla RequestHandlerInterface controller.
 *
 *      @link https://docs.flarum.org/2.x/extend/api#endpoints
 */
class WatermarkDeleteController extends AbstractDeleteController
{
    const SETTINGS_KEY = 'fof-watermark_path';

    protected \Illuminate\Contracts\Filesystem\Filesystem $assetsDir;

    public function __construct(
        Factory $factory,
        protected SettingsRepositoryInterface $settings
    ) {
        $this->assetsDir = $factory->disk('flarum-assets');
    }

    protected function delete(ServerRequestInterface $request): void
    {
        RequestUtil::getActor($request)->assertAdmin();

        $path = $this->settings->get(self::SETTINGS_KEY);

        if ($this->assetsDir->exists($path)) {
            $this->assetsDir->delete($path);
        }

        $this->settings->delete(self::SETTINGS_KEY);
    }
}
