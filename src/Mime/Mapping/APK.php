<?php

namespace FoF\Upload\Mime\Mapping;

class APK extends AbstractMimeMap
{
    public static function getMimeType(): string
    {
        return 'application/vnd.android.package-archive';
    }

    public static function getExtension(): string
    {
        return 'apk';
    }

    public static function getMagicBytes(): array
    {
        return ["\x50\x4B\x03\x04"]; // ZIP signature
    }
}
