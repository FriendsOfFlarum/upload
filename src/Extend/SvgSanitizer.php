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

namespace FoF\Upload\Extend;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;

class SvgSanitizer implements ExtenderInterface
{
    protected $allowedAttrs = [];

    protected $allowedTags = [];

    protected $removeAttrs = [];

    protected $removeTags = [];

    public function allowAttr(string $attr): self
    {
        $this->allowedAttrs[] = $attr;

        return $this;
    }

    public function allowTag(string $tag): self
    {
        $this->allowedTags[] = $tag;

        return $this;
    }

    public function removeAttr($attr): self
    {
        $this->removeAttrs[] = $attr;

        return $this;
    }

    public function removeTag($tag): self
    {
        $this->removeTags[] = $tag;

        return $this;
    }

    public function extend(Container $container, ?Extension $extension = null)
    {
        $container->extend('fof.upload.sanitizer.svg_allowed_attrs', function ($items): array {
            return array_merge($items, $this->allowedAttrs);
        });

        $container->extend('fof.upload.sanitizer.svg_disallowed_attrs', function ($items): array {
            return array_merge($items, $this->removeAttrs);
        });

        $container->extend('fof.upload.sanitizer.svg_allowed_tags', function ($items): array {
            return array_merge($items, $this->allowedTags);
        });

        $container->extend('fof.upload.sanitizer.svg_disallowed_tags', function ($items): array {
            return array_merge($items, $this->removeTags);
        });
    }
}
