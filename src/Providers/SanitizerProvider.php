<?php

namespace FoF\Upload\Providers;

use enshrined\svgSanitize\Sanitizer;
use Flarum\Foundation\AbstractServiceProvider;
use FoF\Upload\Sanitizer\SvgAllowedAttrs;
use FoF\Upload\Sanitizer\SvgAllowedTags;

class SanitizerProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->container->singleton(Sanitizer::class, function (): Sanitizer {
            $sanitizer = new Sanitizer();
            $sanitizer->setAllowedAttrs(new SvgAllowedAttrs());
            $sanitizer->setAllowedTags(new SvgAllowedTags());
            $sanitizer->removeRemoteReferences(true);

            return $sanitizer;
        });
    }
}
