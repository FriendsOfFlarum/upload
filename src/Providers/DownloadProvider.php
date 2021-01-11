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

namespace FoF\Upload\Providers;

use Flarum\Foundation\AbstractServiceProvider;
use FoF\Upload\Commands\DownloadHandler;
use FoF\Upload\Downloader\DefaultDownloader;
use FoF\Upload\Helpers\Util;
use FoF\Upload\Templates\FileTemplate;
use FoF\Upload\Templates\ImagePreviewTemplate;
use FoF\Upload\Templates\ImageTemplate;
use FoF\Upload\Templates\JustUrlTemplate;

class DownloadProvider extends AbstractServiceProvider
{
    public function register()
    {
        DownloadHandler::addDownloader(
            $this->app->make(DefaultDownloader::class)
        );

        /** @var Util $util */
        $util = $this->app->make(Util::class);

        $util->addRenderTemplate($this->app->make(FileTemplate::class));
        $util->addRenderTemplate($this->app->make(ImageTemplate::class));
        $util->addRenderTemplate($this->app->make(ImagePreviewTemplate::class));
        $util->addRenderTemplate($this->app->make(JustUrlTemplate::class));
    }
}
