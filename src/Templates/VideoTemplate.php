<?php

namespace FoF\Upload\Templates;

use Illuminate\Contracts\View\View;

class VideoTemplate extends AbstractTextFormatterTemplate
{
    /**
     * @var string
     */
    protected $tag = 'video-player';

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        // 如果你还没加语言包，可以直接写 'Video Player'，或者使用 $this->trans()
        return 'Video Player';
    }

    /**
     * {@inheritdoc}
     */
    public function description(): string
    {
        return 'Display as a video player';
    }

    /**
     * {@inheritdoc}
     */
    public function template(): View
    {
        // 对应资源目录下的 video.blade.php
        return $this->getView('fof-upload.templates::video');
    }

    /**
     * {@inheritdoc}
     */
    public function bbcode(): string
    {
        return '[video uuid={IDENTIFIER} url={URL}]{SIMPLETEXT}[/video]';
    }
}
