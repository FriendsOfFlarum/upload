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
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use FoF\Upload\Adapters\Manager;
use FoF\Upload\Commands\Download;
use FoF\Upload\Contracts\Template;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\File;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Laminas\Diactoros\Response\TextResponse;
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
            '^image\/(jpeg|png|gif|webp|avif|bmp|tiff|svg\+xml)$' => [
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

    public function moveFileToPublic(File $file): File
    {
        $privatePath = $file->path;
        $contents = $this->getPrivateDir()->get($privatePath);

        $adapter = $this->getAdapterForMime($file->type);

        $movedFile = $adapter->upload($file, null, $contents);

        if ($movedFile !== false) {
            $this->getPrivateDir()->delete($privatePath);
        }

        $movedFile->upload_method = $this->setMethod($adapter);

        return $movedFile;
    }

    public function moveFileToPrivate(File $file, User $actor): File
    {
        /** @var TextResponse $downloadedFile */
        $downloadedFile = resolve(Dispatcher::class)->dispatch(new Download($file->uuid, $actor));

        $originalFile = clone $file;
        $adapter = $this->getAdapterForFile($originalFile);

        $success = $this->getPrivateDir()->put(
            $file->path,
            $downloadedFile->getBody()->getContents()
        );

        if ($success) {
            $adapter->delete($originalFile);
            $file->upload_method = $this->setMethod();
            $file->url = $this->getFilePrivateUrl($file);
        }

        return $file;
    }

    private function getPrivateDir(): Cloud
    {
        /** @var Factory $factory */
        $factory = resolve(Factory::class);

        return $factory->disk('private-shared');
    }

    private function getFilePrivateUrl(File $file): string
    {
        return resolve(UrlGenerator::class)->to('api')->route('fof-upload.download.uuid', [
            'uuid' => $file->uuid,
        ]);
    }

    public function setMethod(?UploadAdapter $adapter = null): string
    {
        return $adapter ? Str::lower(Str::afterLast($adapter::class, '\\')) : 'private-shared';
    }
}
