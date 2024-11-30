<?php

namespace FoF\Upload\Mime\Mapping;

abstract class AbstractMimeMap
{
    /**
     * Get the MIME type.
     *
     * @return string
     */
    abstract public static function getMimeType(): string;

    /**
     * Get the associated file extension.
     *
     * @return string
     */
    abstract public static function getExtension(): string;

    /**
     * Get the magic bytes for identification.
     *
     * @return array
     */
    abstract public static function getMagicBytes(): array;
}
