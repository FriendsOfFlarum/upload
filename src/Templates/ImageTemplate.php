<?php

namespace FoF\Upload\Templates;

class ImageTemplate extends AbstractTemplate
{
    /**
     * @var string
     */
    protected $tag = 'image';

    /**
     * {@inheritdoc}
     */
    public function name()
    {
        return $this->trans('fof-upload.admin.templates.image');
    }

    /**
     * {@inheritdoc}
     */
    public function description()
    {
        return $this->trans('fof-upload.admin.templates.image_description');
    }

    /**
     * The xsl template to use with this tag.
     *
     * @return string
     */
    public function template()
    {
        return $this->getView('fof-upload.templates::image');
    }

    /**
     * The bbcode to be parsed.
     *
     * @return string
     */
    public function bbcode()
    {
        return '[upl-image uuid={IDENTIFIER} size={SIMPLETEXT2} url={URL}]{SIMPLETEXT1}[/upl-image]';
    }
}
