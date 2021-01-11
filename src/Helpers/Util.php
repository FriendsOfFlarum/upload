<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) 2020 - 2021 FriendsOfFlarum.
 * Copyright (c) 2016 - 2019 Flagrow
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Helpers;

use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Adapters\Manager;
use FoF\Upload\Contracts\Template;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class Util
{
    const DEFAULT_MAX_FILE_SIZE = 2048;
    const DEFAULT_MAX_IMAGE_WIDTH = 100;

    /**
     * The templates used to render files.
     *
     * @var array
     */
    protected $renderTemplates = [];

    /**
     * @return Collection
     */
    public function getAvailableUploadMethods()
    {
        /** @var Manager $manager */
        $manager = app(Manager::class);

        return $manager->adapters()
            ->filter(function ($available) {
                return $available;
            })
            ->map(function ($available, $item) {
                return app('translator')->trans('fof-upload.admin.upload_methods.'.$item);
            });
    }

    /**
     * @param $field
     * @param null $default
     * @param null $attribute
     *
     * @return Collection|mixed|null
     */
    public function getJsonValue($json, $default = null, $attribute = null)
    {
        if (empty($json)) {
            return $default;
        }

        $collect = collect(json_decode($json, true));

        if ($attribute) {
            return $collect->get($attribute, $default);
        }

        return $collect;
    }

    /**
     * @return Collection
     */
    public function getMimeTypesConfiguration()
    {
        $settings = app(SettingsRepositoryInterface::class);
        $mimeTypes = $settings->get('fof-upload.mimeTypes');

        $adapters = $this->getAvailableUploadMethods();

        return $this->getJsonValue(
            $mimeTypes,
            collect(['^image\/.*' => ['adapter' => $adapters->flip()->last(), 'template' => 'image-preview']])
        )->filter();
    }

    /**
     * @param Template $template
     */
    public function addRenderTemplate(Template $template)
    {
        $this->renderTemplates[$template->tag()] = $template;
    }

    /**
     * @return Template[]
     */
    public function getRenderTemplates()
    {
        return $this->renderTemplates;
    }

    /**
     * @param Template[] $templates
     */
    public function setRenderTemplates(array $templates)
    {
        $this->renderTemplates = $templates;
    }

    /**
     * @return Collection|Template[]
     */
    public function getAvailableTemplates()
    {
        $collect = [];

        /**
         * @var Template $template
         */
        foreach ($this->renderTemplates as $tag => $template) {
            $collect[$tag] = [
                'name'        => $template->name(),
                'description' => $template->description(),
            ];
        }

        return collect($collect);
    }

    /**
     * @param string $template
     *
     * @return Template|null
     */
    public function getTemplate($template)
    {
        return Arr::get($this->renderTemplates, $template);
    }
}
