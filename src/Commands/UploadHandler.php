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

namespace FoF\Upload\Commands;

use enshrined\svgSanitize\Sanitizer;
use Flarum\Foundation\Application;
use Flarum\Foundation\ValidationException;
use FoF\Upload\Adapters\Manager;
use FoF\Upload\Contracts\Template;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\Events;
use FoF\Upload\File;
use FoF\Upload\Helpers\Util;
use FoF\Upload\Repositories\FileRepository;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Psr\Http\Message\UploadedFileInterface;
use SoftCreatR\MimeDetector\MimeDetector;
use SoftCreatR\MimeDetector\MimeDetectorException;
use Symfony\Contracts\Translation\TranslatorInterface;

class UploadHandler
{
    public function __construct(
        protected Application $app,
        protected Dispatcher $events,
        protected Util $util,
        protected FileRepository $files,
        protected MimeDetector $mimeDetector,
        protected TranslatorInterface $translator,
        protected Sanitizer $sanitizer
    ) {
    }

    /**
     * @param Upload $command
     *
     * @throws \Flarum\User\Exception\PermissionDeniedException
     *
     * @return \Illuminate\Support\Collection
     */
    public function handle(Upload $command)
    {
        $command->actor->assertCan('fof-upload.upload');

        $savedFiles = $command->files->map(function (UploadedFileInterface $file) use ($command) {
            try {
                $upload = $this->files->moveUploadedFileToTemp($file);

                try {
                    $this->mimeDetector->setFile($upload->getPathname());
                } catch (MimeDetectorException $e) {
                    throw new ValidationException(['upload' => $this->translator->trans('fof-upload.api.upload_errors.could_not_detect_mime')]);
                }

                $uploadFileData = $this->mimeDetector->getFileType();

                if (!Arr::has($uploadFileData, 'mime')) {
                    try {
                        $uploadFileData['mime'] = mime_content_type($upload->getPathname());
                    } catch (\Exception $e) {
                        throw new ValidationException(['upload' => $this->translator->trans('fof-upload.api.upload_errors.could_not_detect_mime')]);
                    }
                }

                // If an SVG has been uploaded, remove any unwanted tags & attrs, if possible, else throw a validation error
                if (Str::startsWith($uploadFileData['mime'], 'image/svg')) {
                    // Will return false if sanitization fails, else will return the clean SVG contents.
                    $cleanSvg = $this->sanitizer->sanitize(file_get_contents($upload->getPathname()));

                    if (!$cleanSvg) {
                        //TODO maybe expose the error list via ValidationException?
                        //$issues = $this->sanitizer->getXmlIssues();
                        throw new ValidationException(['upload' => $this->translator->trans('fof-upload.api.upload_errors.svg_failure')]);
                    }

                    file_put_contents($upload->getPathname(), $cleanSvg, LOCK_EX);
                }

                $mimeConfiguration = $this->getMimeConfiguration($uploadFileData['mime']);
                $adapter = $this->getAdapter(Arr::get($mimeConfiguration, 'adapter'));
                $template = $this->getTemplate(Arr::get($mimeConfiguration, 'template', 'file'));

                $this->events->dispatch(
                    new Events\Adapter\Identified($command->actor, $upload, $adapter)
                );

                if (!$adapter) {
                    throw new ValidationException(['upload' => $this->translator->trans('fof-upload.api.upload_errors.forbidden_type')]);
                }

                if (!$adapter->forMime($uploadFileData['mime'])) {
                    throw new ValidationException(['upload' => resolve('translator')->trans('fof-upload.api.upload_errors.unsupported_type', ['mime' => $uploadFileData['mime']])]);
                }

                $file = $this->files->createFileFromUpload($upload, $command->actor, $uploadFileData['mime']);

                $this->events->dispatch(
                    new Events\File\WillBeUploaded($command->actor, $file, $upload, $uploadFileData['mime'])
                );

                $response = $adapter->upload(
                    $file,
                    $upload,
                    $this->files->readUpload($upload, $adapter)
                );

                $this->files->removeFromTemp($upload);

                if (!($response instanceof File)) {
                    return false;
                }

                $file = $response;

                $file->upload_method = Str::lower(Str::afterLast($adapter::class, '\\'));
                $file->tag = $template;
                $file->actor_id = $command->actor->id;

                $this->events->dispatch(
                    new Events\File\WillBeSaved($command->actor, $file, $upload, $uploadFileData['mime'])
                );

                if ($file->isDirty() || !$file->exists) {
                    $file->save();
                }

                $this->events->dispatch(
                    new Events\File\WasSaved($command->actor, $file, $upload, $uploadFileData['mime'])
                );
            } catch (\Exception $e) {
                if (isset($upload)) {
                    $this->files->removeFromTemp($upload);
                }

                throw $e;
            }

            return $file;
        });

        return $savedFiles->filter();
    }

    /**
     * @param ?string $adapter
     *
     * @return UploadAdapter|null
     */
    protected function getAdapter(?string $adapter)
    {
        if (!$adapter) {
            return null;
        }

        /** @var Manager $manager */
        $manager = resolve(Manager::class);

        return $manager->instantiate($adapter);
    }

    protected function getTemplate($template): ?Template
    {
        return $this->util->getTemplate($template);
    }

    /**
     * @param $mime
     *
     * @return mixed
     */
    protected function getMimeConfiguration(?string $mime)
    {
        return $this->util->getMimeTypesConfiguration()->first(function ($_, $regex) use ($mime) {
            return preg_match("/$regex/", $mime);
        });
    }
}
