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
        $tag->attributes->add('downloads')->filterChain->append('#uint');
        $tag->attributes->add('discussionid')->filterChain->append('#uint');
        $tag->attributes->add('number')->filterChain->append('#uint');
        $tag->attributes['discussionid']->required = false;
        $tag->attributes['number']->required = false;

        $tag->template =
            '<div class="Button hasIcon flagrow-download-button" data-uuid="{@uuid}">'.
            '<xsl:value-of select="@base_name"/>'.
            '</div>';

        $tag->filterChain->prepend([static::class, 'addAttributes'])
            ->addParameterByName('fileRepository')
            ->setJS('function() { return true; }');

        $configurator->Preg->match('/'. preg_quote('$file-') .'(?<uuid>[a-z0-9-]{36})/', $tagName);
    }

    /**
     * @param ConfigureFormatterParser $event
     */
    public function parse(ConfigureFormatterParser $event)
    {
        $event->parser->registeredVars['fileRepository'] = $this->files;
    }

    /**
     * @param $tag
     * @param FileRepository $files
     * @return bool
     */
    public static function addAttributes($tag, FileRepository $files)
    {
        $file = $files->findByUuid($tag->getAttribute('uuid'));
        $tag->setAttribute('base_name', $file->base_name);
        $tag->setAttribute('downloads', $file->downloads->count());
        return true;
    }
}
