<?php

namespace FoF\Upload\Commands;

use Exception;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\Events;
use FoF\Upload\File;
use FoF\Upload\Helpers\Settings;
use FoF\Upload\Repositories\FileRepository;
use Flarum\Foundation\Application;
use Flarum\Foundation\ValidationException;
use Flarum\User\AssertPermissionTrait;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\UploadedFileInterface;
use SoftCreatR\MimeDetector\MimeDetector;
use SoftCreatR\MimeDetector\MimeDetectorException;

class UploadHandler
{
    use AssertPermissionTrait;

    /**
     * @var Application
     */
    protected $app;

    /**
     * @var Settings
     */
    protected $settings;

    /**
     * @var Dispatcher
     */
    protected $events;
    /**
     * @var FileRepository
     */
    protected $files;

    /**
     * @var MimeDetector
     */
    protected $mimeDetector;

    public function __construct(
        Application $app,
        Dispatcher $events,
        Settings $settings,
        FileRepository $files,
        MimeDetector $mimeDetector
    ) {
        $this->app = $app;
        $this->settings = $settings;
        $this->events = $events;
        $this->files = $files;
        $this->mimeDetector = $mimeDetector;
    }

    /**
     * @param Upload $command
     *
     * @return \Illuminate\Support\Collection
     * @throws \Flarum\User\Exception\PermissionDeniedException
     */
    public function handle(Upload $command)
    {
        $this->assertCan(
            $command->actor,
            'fof-upload.upload'
        );

        $savedFiles = $command->files->map(function (UploadedFileInterface $file) use ($command) {
            try {
                $upload = $this->files->moveUploadedFileToTemp($file);

                try {
                    $this->mimeDetector->setFile($upload->getPathname());
                } catch (MimeDetectorException $e) {
                    throw new ValidationException(['upload' => app('translator')->trans('fof-upload.api.upload_errors.could_not_detect_mime')]);
                }

                $uploadFileData = $this->mimeDetector->getFileType();

                if ($uploadFileData['mime'] === null) {
                    try {
                        $uploadFileData['mime'] = mime_content_type($upload->getPathname());
                    } catch (Exception $e) {
                        throw new ValidationException(['upload' => app('translator')->trans('fof-upload.api.upload_errors.could_not_detect_mime')]);
                    }
                }

                $mimeConfiguration = $this->getMimeConfiguration($uploadFileData['mime']);
                $adapter = $this->getAdapter(Arr::get($mimeConfiguration, 'adapter'));
                $template = $this->getTemplate(Arr::get($mimeConfiguration, 'template', 'file'));

                $this->events->fire(
                    new Events\Adapter\Identified($command->actor, $upload, $adapter)
                );

                if (!$adapter) {
                    throw new ValidationException(['upload' => app('translator')->trans('fof-upload.api.upload_errors.forbidden_type')]);
                }

                if (!$adapter->forMime($uploadFileData['mime'])) {
                    throw new ValidationException(['upload' => app('translator')->trans('fof-upload.api.upload_errors.unsupported_type', ['mime' => $uploadFileData['mime']])]);
                }

                $file = $this->files->createFileFromUpload($upload, $command->actor, $uploadFileData['mime']);

                $this->events->fire(
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

                $file->upload_method = $adapter;
                $file->tag = $template;
                $file->actor_id = $command->actor->id;

                $this->events->fire(
                    new Events\File\WillBeSaved($command->actor, $file, $upload, $uploadFileData['mime'])
                );

                if ($file->isDirty() || !$file->exists) {
                    $file->save();
                }

                $this->events->fire(
                    new Events\File\WasSaved($command->actor, $file, $upload, $uploadFileData['mime'])
                );
            } catch (Exception $e) {
                if (isset($upload)) {
                    $this->files->removeFromTemp($upload);
                }

                throw $e;
            }

            return $template->preview($file);
        });

        return $savedFiles->filter();
    }

    /**
     * @param $adapter
     *
     * @return UploadAdapter|null
     */
    protected function getAdapter($adapter)
    {
        if (!$adapter) {
            return;
        }

        return app("fof.upload-adapter.$adapter");
    }

    /**
     * @param $template
     *
     * @return \Flagrow\Upload\Templates\AbstractTemplate|null
     */
    protected function getTemplate($template)
    {
        return $this->settings->getTemplate($template);
    }

    /**
     * @param $mime
     *
     * @return mixed
     */
    protected function getMimeConfiguration($mime)
    {
        return $this->settings->getMimeTypesConfiguration()->first(function ($_, $regex) use ($mime) {
            return preg_match("/$regex/", $mime);
        });
    }
}
