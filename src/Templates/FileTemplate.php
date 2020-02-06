<?php

namespace FoF\Upload\Templates;

class FileTemplate extends AbstractTemplate
{
    /**
     * @var string
     */
    protected $tag = 'file';

    /**
     * {@inheritdoc}
     */
    public function name()
    {
        return $this->trans('fof-upload.admin.templates.file');
    }

    /**
     * {@inheritdoc}
     */
    public function description()
    {
        return $this->trans('fof-upload.admin.templates.file_description');
    }

    /**
     * The xsl template to use with this tag.
     *
     * @return string
     */
    public function template()
    {
        return $this->getView('fof-upload.templates::file');
    }

    /**
     * The bbcode to be parsed.
     *
     * @return string
     */
    public function bbcode()
    {
        return '[upl-file uuid={IDENTIFIER} size={SIMPLETEXT2}]{SIMPLETEXT1}[/upl-file]';
    }
}
