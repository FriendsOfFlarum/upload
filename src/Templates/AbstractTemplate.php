<?php

namespace Flagrow\Upload\Templates;

use Flagrow\Upload\Repositories\FileRepository;
use Illuminate\Contracts\View\Factory;
use s9e\TextFormatter\Parser\Tag as ParserTag;
use s9e\TextFormatter\Configurator\Items\Tag as Tag;

abstract class AbstractTemplate
{
    /**
     * @var string
     */
    protected $tag;

    /**
     * The human readable name of the template.
     *
     * @return string
     */
    abstract public function name();

    /**
     * A clarification of how this template works.
     *
     * @return string
     */
    abstract public function description();
    /**
     * The unique tag for this template.
     *
     * @return string
     */
    public function tag()
    {
        return $this->tag;
    }

    /**
     * @param string $view
     * @param array $arguments
     * @return string
     */
    protected function getView($view, $arguments = [])
    {
        return app(Factory::class)->make($view, $arguments);
    }

    /**
     * @param $key
     * @param array $params
     * @return mixed
     */
    protected function trans($key, array $params = [])
    {
        return app('translator')->trans($key, $params);
    }

    /**
     * The xsl template to use with this tag.
     *
     * @return string
     */
    abstract public function template();

    /**
     * Used to configure attributes and their filtering.
     *
     * @param Tag $tag
     */
    public function configureAttributes(Tag &$tag)
    {
        // ..
    }

    /**
     * Can be used to inject more file attributes into the template.
     *
     * @param ParserTag $tag
     * @param FileRepository $files
     * @return bool
     */
    public static function addAttributes(ParserTag $tag, FileRepository $files)
    {
        return true;
    }
}
