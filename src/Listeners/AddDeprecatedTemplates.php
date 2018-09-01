<?php

namespace Flagrow\Upload\Listeners;

use Flagrow\Upload\Repositories\FileRepository;
use Flagrow\Upload\Templates\Deprecated\AbstractTemplate;
use Flagrow\Upload\Templates\Deprecated\FileTemplate;
use Flagrow\Upload\Templates\Deprecated\ImageTemplate;
use Flarum\Formatter\Event\Configuring;
use Flarum\Formatter\Event\Parsing;
use Illuminate\Events\Dispatcher;
use s9e\TextFormatter\Configurator;

class AddDeprecatedTemplates
{
    /**
     * @var FileRepository
     */
    private $files;

    /**
     * @var array|AbstractTemplate[]
     */
    protected static $templates = [];

    public function __construct(FileRepository $files)
    {
        $this->files = $files;

        static::addTemplate(app()->make(FileTemplate::class));
        static::addTemplate(app()->make(ImageTemplate::class));
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(Configuring::class, [$this, 'configure']);
        $events->listen(Parsing::class, [$this, 'parse']);
    }

    /**
     * @param Configuring $event
     */
    public function configure(Configuring $event)
    {
        foreach (static::$templates as $name => $template) {
            $this->createTag($event->configurator, $name, $template);
        }
    }

    /**
     * @param Configurator     $configurator
     * @param string           $name
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
            ->setJS('function() { return true; }');

        $configurator->Preg->match(
            '/'.preg_quote('$'.$name.'-').'(?<uuid>[a-z0-9-]{36})/',
            $tagName
        );
    }

    /**
     * @param Parsing $event
     */
    public function parse(Parsing $event)
    {
        $event->parser->registeredVars['fileRepository'] = $this->files;
    }

    /**
     * @param AbstractTemplate $template
     */
    public static function addTemplate(AbstractTemplate $template)
    {
        static::$templates[$template->tag()] = $template;
    }
}
