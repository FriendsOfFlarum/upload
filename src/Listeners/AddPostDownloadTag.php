<?php

namespace Flagrow\Upload\Listeners;

use Flagrow\Upload\Repositories\FileRepository;
use Flarum\Event\ConfigureFormatter;
use Flarum\Event\ConfigureFormatterParser;
use Flarum\Event\ConfigureFormatterRenderer;
use Flarum\Forum\UrlGenerator;
use Illuminate\Events\Dispatcher;

class AddPostDownloadTag
{
    /**
     * @var UrlGenerator
     */
    protected $url;
    /**
     * @var FileRepository
     */
    private $files;

    function __construct(UrlGenerator $url, FileRepository $files)
    {
        $this->url = $url;
        $this->files = $files;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureFormatter::class, [$this, 'configure']);
        $events->listen(ConfigureFormatterParser::class, [$this, 'parse']);
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
        $tag->attributes->add('base_name');
        $tag->attributes->add('discussionid')->filterChain->append('#uint');
        $tag->attributes->add('number')->filterChain->append('#uint');
        $tag->attributes['discussionid']->required = false;
        $tag->attributes['number']->required = false;

        $tag->template = '<a href="{$FLAGROW_DOWNLOAD_URL}{@uuid}" class="Flagrow--Download-Button" data-uuid="{@uuid}">$<xsl:value-of select="@base_name"/></a>';

        $tag->filterChain->prepend([static::class, 'addAttributes'])
            ->addParameterByName('fileRepository')
            ->setJS('function() { return true; }');

        $configurator->Preg->match('/\$file-(?<uuid>[a-z0-9-]{36})/', $tagName);
    }

    /**
     * @param ConfigureFormatterParser $event
     */
    public function parse(ConfigureFormatterParser $event)
    {
        $event->parser->registeredVars['fileRepository'] = $this->files;
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

    public static function addAttributes($tag, FileRepository $files)
    {
        if ($file = $files->findByUuid($tag->getAttribute('uuid'))) {
            $tag->setAttribute('base_name', $file->base_name);

            return true;
        }
    }
}
