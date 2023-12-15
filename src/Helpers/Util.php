<?php

/*
 * This file is part of fof/upload.
 *
 * Copyright (c) FriendsOfFlarum.
 * Copyright (c) Flagrow.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Upload\Helpers;

use Flarum\Foundation\ValidationException;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Adapters\Manager;
use FoF\Upload\Contracts\Template;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\File;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Symfony\Contracts\Translation\TranslatorInterface;

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
        return resolve(Manager::class)->adapters()
            ->filter(function ($available) {
                return $available;
            })
            ->map(function ($available, $item) {
                return resolve(TranslatorInterface::class)->trans('fof-upload.admin.upload_methods.'.$item);
            });
    }

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
        $mimeTypes = resolve(SettingsRepositoryInterface::class)->get('fof-upload.mimeTypes');

        return $this->getJsonValue(
            $mimeTypes,
            $this->defaultMimeTypes()
        )->filter();
    }

    public function defaultMimeTypes(): Collection
    {
        $adapters = $this->getAvailableUploadMethods();

        return collect([
            '^image\/.*' => [
                'adapter'  => $adapters->flip()->last(),
                'template' => 'image-preview',
            ],
        ]);
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
     * @return Collection
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
     * @param string|Template|null $template
     *
     * @return Template|array|null
     */
    public function getTemplate($template)
    {
        return Arr::get($this->renderTemplates, $template);
    }

    /**
     * @param File $file
     *
     * @return string|null
     */
    public function getBbcodeForFile(File $file): ?string
    {
        $template = $this->getTemplate($file->tag);

        if (is_array($template)) {
            return null;
        }

        return $template ? $template->preview($file) : null;
    }

    public function isPrivateShared(File $model): bool
    {
        return $model->shared && $model->hidden;
    }

    public function getAdapterForFile(File $file): ?UploadAdapter
    {
        if ($this->isPrivateShared($file)) {
            throw new ValidationException(['shared-file' => 'Private shared files are handled differently, not by an adapter.']);
        }

        return $this->getAdapterForMime($file->type);
    }

    public function getAdapterForMime(?string $mime): ?UploadAdapter
    {
        return $this->getAdapter(
            Arr::get($this->getMimeConfiguration($mime), 'adapter')
        );
    }

    /**
     * @param $mime
     *
     * @return mixed
     */
    public function getMimeConfiguration(?string $mime)
    {
        return $this->getMimeTypesConfiguration()->first(function ($_, $regex) use ($mime) {
            return preg_match("/$regex/", $mime);
        });
    }

    /**
     * @param ?string $adapter
     *
     * @return UploadAdapter|null
     */
    public function getAdapter(?string $adapter)
    {
        if (!$adapter) {
            return null;
        }

        /** @var Manager $manager */
        $manager = resolve(Manager::class);

        return $manager->instantiate($adapter);
    }
}
