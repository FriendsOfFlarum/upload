<?php

namespace Flagrow\Upload\Listeners;

use Flagrow\Upload\Helpers\Settings;
use Flagrow\Upload\Repositories\FileRepository;
use Flagrow\Upload\Templates\AbstractTemplate;
use Flarum\Formatter\Event\Configuring;
use Flarum\Formatter\Event\Parsing;
use Illuminate\Events\Dispatcher;
use InvalidArgumentException;
use s9e\TextFormatter\Configurator;
use s9e\TextFormatter\Configurator\Exceptions\UnsafeTemplateException;

class AddPostDownloadTags
{
    /**
     * @var FileRepository
     */
    private $files;

    /**
     * @var array|AbstractTemplate[]
     */
    protected $templates = [];
    /**
     * @var Settings
     */
    private $settings;

    public function __construct(FileRepository $files, Settings $settings)
    {
        $this->files = $files;
        $this->settings = $settings;
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
        foreach ($this->settings->getRenderTemplates() as $name => $template) {
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

    /**
     * @param Parsing $event
     */
    public function parse(Parsing $event)
    {
        $event->parser->registeredVars['fileRepository'] = $this->files;
    }
}
