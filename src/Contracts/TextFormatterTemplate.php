<?php

namespace FoF\Upload\Contracts;

/**
 * An additional interface for templates that need to be registered in TextFormatter as a bbcode
 */
interface TextFormatterTemplate
{
    /**
     * The bbcode definition.
     *
     * @return string
     */
    public function bbcode(): string;

    /**
     * The xsl template to use with this tag.
     *
     * @return string
     */
    public function template(): string;
}
