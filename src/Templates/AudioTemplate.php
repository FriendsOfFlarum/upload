<?php

namespace Flagrow\Upload\Templates;

class AudioTemplate extends AbstractTemplate
{
    /**
     * @var string
     */
    protected $tag = 'audio';

    /**
     * {@inheritdoc}
     */
    public function name()
    {
        return 'MP3 Audio';
    }

    /**
     * {@inheritdoc}
     */
    public function description()
    {
        return 'MP3 Audio';
    }

    /**
     * The xsl template to use with this tag.
     *
     * @return string
     */
    public function template()
    {
        return $this->getView('flagrow.download.templates::audio');
    }

    /**
     * The bbcode to be parsed.
     *
     * @return string
     */
    public function bbcode()
    {
        return '[upl-audio uuid={IDENTIFIER} size={SIMPLETEXT2} url={URL}]{SIMPLETEXT1}[/upl-audio]';
    }
}
