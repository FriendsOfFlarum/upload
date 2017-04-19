<?php

namespace Flagrow\Upload\Templates;

use Flagrow\Upload\Repositories\FileRepository;
use s9e\TextFormatter\Parser\Tag as ParserTag;
use s9e\TextFormatter\Configurator\Items\Tag as Tag;

class ImageTemplate extends AbstractTemplate
{
    /**
     * @var string
     */
    protected $tag = 'image';

    /**
     * The xsl template to use with this tag.
     *
     * @return string
     */
    public function template()
    {
        return
            '<div class="flagrow-download-button" data-uuid="{@uuid}">'.
                '<img src="{@url}" alt="{@base_name}" />'.
                '<div class="ButtonGroup">'.
                    '<div class="Button hasIcon Button--icon Button--primary download"><i class="fa fa-download"></i></div>'.
                    '<div class="Button"><xsl:value-of select="@base_name"/></div>'.
                    '<div class="Button"><xsl:value-of select="@size"/></div>'.
                    '<div class="Button"><xsl:value-of select="@downloads"/></div>'.
                '</div>'.
            '</div>';
    }

    /**
     * @param Tag $tag
     */
    public function configureAttributes(Tag &$tag)
    {
        $tag->attributes->add('uuid');
        $tag->attributes->add('base_name');
        $tag->attributes->add('url')->filterChain->append('#url');
        $tag->attributes->add('downloads')->filterChain->append('#uint');
        $tag->attributes->add('size');
    }

    /**
     * @param ParserTag $tag
     * @param FileRepository $files
     * @return bool
     */
    public static function addAttributes(ParserTag $tag, FileRepository $files)
    {
        $file = $files->findByUuid($tag->getAttribute('uuid'));
        $tag->setAttribute('base_name', $file->base_name);
        $tag->setAttribute('downloads', $file->downloads->count());
        $tag->setAttribute('size', $file->humanSize);
        $tag->setAttribute('url', $file->url);
        return true;
    }
}
