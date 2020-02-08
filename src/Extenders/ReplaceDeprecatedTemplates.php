<?php

namespace FoF\Upload\Extenders;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Formatter\Event\Parsing;
use FoF\Upload\Helpers\Settings;
use FoF\Upload\Repositories\FileRepository;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Adds support for flagrow/upload pre-0.6 file tags
 * Format was either $file-766cc417-aba7-46f0-b032-cb5b2be2d66c or $image-766cc417-aba7-46f0-b032-cb5b2be2d66c
 * In 0.6 up to 0.7 they were still supported as deprecated
 * The FoF package no longer includes the deprecated templates, but will replace existing old tags with the new bbcode when saving
 */
class ReplaceDeprecatedTemplates implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container->make(Dispatcher::class)->listen(Parsing::class, [$this, 'parsing']);
    }

    public function parsing(Parsing $event)
    {
        $event->text = preg_replace_callback('/\$(file|image)\-([a-z0-9-]{36})/', function ($matches) {
            /** @var Settings $settings */
            $settings = app(Settings::class);

            /** @var FileRepository $repository */
            $repository = app(FileRepository::class);

            $file = $repository->findByUuid($matches[2]);

            // If the file doesn't exist, leave the text untouched
            if (!$file) {
                return $matches[0];
            }

            if ($matches[1] === 'file') {
                $template = $settings->getTemplate('file');
            } else {
                $template = $settings->getTemplate('image');
            }

            return $template->preview($file);
        }, $event->text);
    }
}
