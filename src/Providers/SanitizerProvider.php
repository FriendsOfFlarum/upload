<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) FriendsOfFlarum.
 * Copyright (c) Flagrow.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Providers;

use enshrined\svgSanitize\Sanitizer;
use Flarum\Foundation\AbstractServiceProvider;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Sanitizer\SvgAllowedAttrs;
use FoF\Upload\Sanitizer\SvgAllowedTags;
use Illuminate\Contracts\Container\Container;

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

        $this->container->singleton('fof.upload.sanitizer.svg_allowed_attrs', function (): array {
            return [];
        });

        $this->container->singleton('fof.upload.sanitizer.svg_disallowed_attrs', function (): array {
            return [];
        });

        $this->container->singleton('fof.upload.sanitizer.svg_allowed_tags', function (Container $container): array {
            /** @var SettingsRepositoryInterface $settings */
            $settings = $container->make(SettingsRepositoryInterface::class);
            $svgAnimateAllowed = (bool) $settings->get('fof-upload.svgAnimateAllowed');

            return $svgAnimateAllowed ? ['animate'] : [];
        });

        $this->container->singleton('fof.upload.sanitizer.svg_disallowed_tags', function (): array {
            return [];
        });
    }
}
