<?php

namespace FoF\Upload\Templates;

use FoF\Upload\File;

class VideoTemplate extends AbstractTemplate
{
    public function name(): string
    {
        return 'Video Player'; // 界面显示的名字
    }

    public function tag(): string
    {
        return 'video-player';
    }

    public function template(): string
    {
        return '<video controls preload="metadata" style="max-width:100%"><source src="{@url}"></video>';
    }

    public function bbcode(): string
    {
        return '[video]{url}[/video]';
    }
}
