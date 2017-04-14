<?php

namespace Flagrow\Upload\Listeners;

use Flarum\Event\ConfigureFormatter;
use Flarum\Event\ConfigureFormatterRenderer;
use Flarum\Forum\UrlGenerator;
use Illuminate\Events\Dispatcher;

class AddPostDownloadTag
{
    /**
     * @var UrlGenerator
     */
    protected $url;

    function __construct(UrlGenerator $url)
    {
        $this->url = $url;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureFormatter::class, [$this, 'configure']);
        $events->listen(ConfigureFormatterRenderer::class, [$this, 'render']);
    }

    /**
     * @param ConfigureFormatter $event
     */
    public function configure(ConfigureFormatter $event)
    {
        $configurator = $event->configurator;

        $tagName = 'FLAGROW_DOWNLOAD';

        $tag = $configurator->tags->add($tagName);

        $tag->attributes->add('uuid');
        $tag->attributes->add('discussionid')->filterChain->append('#uint');
        $tag->attributes->add('number')->filterChain->append('#uint');
        $tag->attributes['discussionid']->required = false;
        $tag->attributes['number']->required = false;

        $tag->template = '<a href="{$FLAGROW_DOWNLOAD_URL}{@uuid}" class="Flagrow--Download-Button" data-uuid="{@uuid}">$<xsl:value-of uuid="$uuid"/></a>';

        $configurator->Preg->match('/\$(?<uuid>[a-z0-9-]{36})/', $tagName);
    }

    /**
     * @param ConfigureFormatterRenderer $event
     */
    public function render(ConfigureFormatterRenderer $event)
    {
        // @todo URL cannot be resolved somehow
//        $event->renderer->setParameter('FLAGROW_DOWNLOAD_URL', $this->url->toRoute('flagrow.upload', ['uuid' => '']));
        $event->renderer->setParameter('FLAGROW_DOWNLOAD_URL', '/flagrow/download/');
    }
}
