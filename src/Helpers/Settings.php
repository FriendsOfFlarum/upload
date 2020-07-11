<?php

namespace FoF\Upload\Helpers;

use Aws\S3\S3Client;
use FoF\Upload\Contracts\Template;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Qiniu\Http\Client as QiniuClient;

class Settings
{
    const DEFAULT_MAX_FILE_SIZE = 2048;
    const DEFAULT_MAX_IMAGE_WIDTH = 100;

    /**
     * The templates used to render files.
     *
     * @var array
     */
    protected $renderTemplates = [];

    protected $prefix = 'fof-upload.';

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __get($name)
    {
        return $this->settings->get($this->prefix . $name);
    }

    public function __set($name, $value)
    {
        $this->settings->set($this->prefix . $name, $value);
    }

    public function __isset($name)
    {
        return $this->settings->get($this->prefix . $name) !== null;
    }

    /**
     * @param $name
     * @param null $default
     *
     * @return null
     */
    public function get($name, $default = null)
    {
        return $this->{$name} ?: $default;
    }

    /**
     * @return Collection
     */
    public function getAvailableUploadMethods()
    {
        /** @var Collection $methods */
        $methods = [
            'local',
        ];

        if (class_exists(S3Client::class)) {
            $methods[] = 'aws-s3';
        }

        if (class_exists(QiniuClient::class)) {
            $methods[] = 'qiniu';
        }

        $methods[] = 'imgur';

        return collect($methods)
            ->keyBy(function ($item) {
                return $item;
            })
            ->map(function ($item) {
                return app('translator')->trans('fof-upload.admin.upload_methods.' . $item);
            });
    }

    /**
     * @param $field
     * @param null $default
     * @param null $attribute
     *
     * @return Collection|mixed|null
     */
    public function getJsonValue($field, $default = null, $attribute = null)
    {
        $json = $this->{$field};

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
        return $this->getJsonValue(
            'mimeTypes',
            collect(['^image\/.*' => ['adapter' => 'local', 'template' => 'image-preview']])
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
         * @var string
         * @var Template $template
         */
        foreach ($this->renderTemplates as $tag => $template) {
            $collect[$tag] = [
                'name' => $template->name(),
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
