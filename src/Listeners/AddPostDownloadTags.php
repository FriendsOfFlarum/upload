<?php

namespace Flagrow\Upload\Listeners;

use Flagrow\Upload\Helpers\Settings;
use Flagrow\Upload\Repositories\FileRepository;
use Flagrow\Upload\Templates\AbstractTemplate;
use Flarum\Event\ConfigureFormatter;
use Flarum\Event\ConfigureFormatterParser;
use Flarum\Forum\UrlGenerator;
use Illuminate\Events\Dispatcher;
use s9e\TextFormatter\Configurator;

class AddPostDownloadTags
{
    /**
     * @var UrlGenerator
     */
    protected $url;
    /**
     * @var FileRepository
     */
    private $files;

    /**
     * @var array|AbstractTemplate[]
     */
    protected $templates = [];

    function __construct(UrlGenerator $url, FileRepository $files, Settings $settings)
    {
        $this->url = $url;
        $this->files = $files;
        $this->templates = $settings->getRenderTemplates();
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
        foreach ($this->templates as $name => $template) {
            $this->createTag($event->configurator, $name, $template);
        }
    }

    /**
     * @param Configurator $configurator
     * @param string $name
     * @param AbstractTemplate $template
     */
    protected function createTag(Configurator &$configurator, $name, AbstractTemplate $template)
    {
        $tagName = strtoupper("FLAGROW_FILE_$name");

        $tag = $configurator->tags->add($tagName);

        $template->configureAttributes($tag);

        $tag->template = $template->template();

        $tag->filterChain->prepend([$template, 'addAttributes'])
            ->addParameterByName('fileRepository')
            ->setJS('function() { return true; }')
        ;

        $configurator->Preg->match(
            '/' . preg_quote('$' . $name . '-') . '(?<uuid>[a-z0-9-]{36})/',
            $tagName
        );
    }

    /**
     * @param ConfigureFormatterParser $event
     */
    public function parse(ConfigureFormatterParser $event)
    {
        $event->parser->registeredVars['fileRepository'] = $this->files;
    }
}
