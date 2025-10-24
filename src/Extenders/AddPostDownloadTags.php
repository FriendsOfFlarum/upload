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

namespace FoF\Upload\Extenders;

use Flarum\Extend\Formatter;
use Flarum\Extension\Extension;
use FoF\Upload\Contracts\TextFormatterTemplate;
use FoF\Upload\Helpers\Util;
use Illuminate\Contracts\Container\Container;
use InvalidArgumentException;
use s9e\TextFormatter\Configurator;
use s9e\TextFormatter\Configurator\Exceptions\UnsafeTemplateException;

class AddPostDownloadTags extends Formatter
{
    public function extend(Container $container, ?Extension $extension = null)
    {
        $this->configure(function (Configurator $configurator) use ($container) {
            foreach ($container->make(Util::class)->getRenderTemplates() as $name => $template) {
                if ($template instanceof TextFormatterTemplate) {
                    $this->createTag($configurator, $name, $template);
                }
            }
        });

        parent::extend($container, $extension);
    }

    /**
     * @param Configurator          $configurator
     * @param string                $name
     * @param TextFormatterTemplate $template
     */
    protected function createTag(Configurator $configurator, string $name, TextFormatterTemplate $template)
    {
        try {
            $configurator->BBCodes->addCustom(
                $template->bbcode(),
                $template->template()->render()
            );
        } catch (InvalidArgumentException $e) {
            throw new InvalidArgumentException("Failed importing $name due to {$e->getMessage()}");
        } catch (UnsafeTemplateException $e) {
            throw new UnsafeTemplateException("Failed importing $name due to {$e->getMessage()}", $e->getNode());
        }
    }
}
