<?php

namespace FoF\Upload\Extenders;

use FoF\Upload\Helpers\Settings;
use FoF\Upload\Templates\AbstractTemplate;
use Flarum\Extend\Formatter;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;
use InvalidArgumentException;
use s9e\TextFormatter\Configurator;
use s9e\TextFormatter\Configurator\Exceptions\UnsafeTemplateException;

class AddPostDownloadTags extends Formatter
{
    public function extend(Container $container, Extension $extension = null)
    {
        $this->configure(function (Configurator $configurator) use ($container) {
            foreach ($container->make(Settings::class)->getRenderTemplates() as $name => $template) {
                $this->createTag($configurator, $name, $template);
            }
        });

        parent::extend($container, $extension);
    }

    protected function createTag(Configurator $configurator, string $name, AbstractTemplate $template)
    {
        try {
            $configurator->BBCodes->addCustom(
                $template->bbcode(),
                $template->template()
            );
        } catch (InvalidArgumentException $e) {
            throw new InvalidArgumentException("Failed importing $name due to {$e->getMessage()}");
        } catch (UnsafeTemplateException $e) {
            throw new UnsafeTemplateException("Failed importing $name due to {$e->getMessage()}", $e->getNode());
        }
    }
}
