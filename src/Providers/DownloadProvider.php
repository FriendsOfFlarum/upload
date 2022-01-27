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

namespace FoF\Upload\Providers;

use Flarum\Foundation\AbstractServiceProvider;
use FoF\Upload\Commands\DownloadHandler;
use FoF\Upload\Downloader\DefaultDownloader;
use FoF\Upload\Helpers\Util;
use FoF\Upload\Templates\BbcodeImageTemplate;
use FoF\Upload\Templates\FileTemplate;
use FoF\Upload\Templates\ImagePreviewTemplate;
use FoF\Upload\Templates\ImageTemplate;
use FoF\Upload\Templates\JustUrlTemplate;
use FoF\Upload\Templates\MarkdownImageTemplate;
use FoF\Upload\Templates\TextPreviewTemplate;

class DownloadProvider extends AbstractServiceProvider
{
    public function register()
    {
        DownloadHandler::addDownloader(
            $this->container->make(DefaultDownloader::class)
        );

        /** @var Util $util */
        $util = $this->container->make(Util::class);

        $util->addRenderTemplate($this->container->make(FileTemplate::class));
        $util->addRenderTemplate($this->container->make(ImageTemplate::class));
        $util->addRenderTemplate($this->container->make(ImagePreviewTemplate::class));
        $util->addRenderTemplate($this->container->make(JustUrlTemplate::class));
        $util->addRenderTemplate($this->container->make(MarkdownImageTemplate::class));
        $util->addRenderTemplate($this->container->make(BbcodeImageTemplate::class));
        $util->addRenderTemplate($this->container->make(TextPreviewTemplate::class));
    }
}
