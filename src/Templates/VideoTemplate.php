<?php

namespace FoF\Upload\Templates;

use Illuminate\Contracts\View\View;

class VideoTemplate extends AbstractTextFormatterTemplate
{
    /**
     * @var string
     */
    protected $tag = 'upl-video'; 

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
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
        return $this->getView('fof-upload.templates::video');
    }

    /**
     * {@inheritdoc}
     */
    public function bbcode(): string
    {
        return '[upl-video uuid={IDENTIFIER}]{URL}[/upl-video]';
    }
}
