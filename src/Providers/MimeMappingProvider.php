<?php

namespace FoF\Upload\Providers;

use Flarum\Foundation\AbstractServiceProvider;
use FoF\Upload\Mime\Mapping\AbstractMimeMap;
use FoF\Upload\Mime\Mapping\APK;

class MimeMappingProvider extends AbstractServiceProvider
{
    public function register()
    {
        $mappings = [
            APK::class,
        ];

        $this->container->singleton('fof-upload.mime-mappings', function () use ($mappings) {
            $registeredMappings = [];
            foreach ($mappings as $mappingClass) {
                if (is_subclass_of($mappingClass, AbstractMimeMap::class)) {
                    $registeredMappings[] = [
                        'mime' => $mappingClass::getMimeType(),
                        'extension' => $mappingClass::getExtension(),
                        'magicBytes' => $mappingClass::getMagicBytes(),
                    ];
                }
            }

            return $registeredMappings;
        });
    }
}
