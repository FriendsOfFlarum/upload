<?php

namespace Flagrow\Upload\Templates;

class TextTemplate extends AbstractTemplate
{
    /**
     * @var string
     */
    protected $tag = 'text';

    /**
     * {@inheritdoc}
     */
    public function name()
    {
				return 'Plain Text';
    }

    /**
     * {@inheritdoc}
     */
    public function description()
    {
				return 'Plain Text';
    }

    /**
     * The xsl template to use with this tag.
     *
     * @return string
     */
    public function template()
    {
        return $this->getView('flagrow.download.templates::text');
    }

    /**
     * The bbcode to be parsed.
     *
     * @return string
     */
    public function bbcode()
    {
        return '[upl-text uuid={IDENTIFIER} size={SIMPLETEXT2} url={URL}]{SIMPLETEXT1}[/upl-text]';
    }
}
