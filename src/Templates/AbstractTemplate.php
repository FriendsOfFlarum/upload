<?php

namespace Flagrow\Upload\Templates;

use Flagrow\Upload\Repositories\FileRepository;
use s9e\TextFormatter\Parser\Tag as ParserTag;
use s9e\TextFormatter\Configurator\Items\Tag as Tag;

abstract class AbstractTemplate
{
    /**
     * @var string
     */
    protected $tag;

    /**
     * The unique tag for this template.
     *
     * @return string
     */
    public function tag()
    {
        return $this->tag;
    }

    /**
     * The xsl template to use with this tag.
     *
     * @return string
     */
    abstract public function template();

    /**
     * Used to configure attributes and their filtering.
     *
     * @param Tag $tag
     */
    public function configureAttributes(Tag &$tag)
    {
        // ..
    }

    /**
     * Can be used to inject more file attributes into the template.
     *
     * @param ParserTag $tag
     * @param FileRepository $files
     * @return bool
     */
    public static function addAttributes(ParserTag $tag, FileRepository $files)
    {
        return true;
    }
}
