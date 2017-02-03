<?php

/*
 * This file is part of flagrow/upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */


namespace Flagrow\Upload\Commands;

use Flagrow\Upload\Contracts\UploadAdapter;
use Flagrow\Upload\Events\Adapter\Identified;
use Flagrow\Upload\Events\File as Events;
use Flagrow\Upload\File;
use Flagrow\Upload\Helpers\Settings;
use Flagrow\Upload\Validators\FileValidator;
use Flagrow\Upload\Validators\MimeValidator;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Exception\ValidationException;
use Flarum\Foundation\Application;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Str;
use Illuminate\Support\Str as IllStr;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use Psr\Http\Message\UploadedFileInterface;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\File\UploadedFile;

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
     * @var FileValidator
     */
    protected $fileValidator;

    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * @var UploadAdapter
     */
    protected $upload;

    public function __construct(
        Application $app,
        FileValidator $fileValidator,
        Dispatcher $events,
        Settings $settings
    ) {
        $this->app = $app;
        $this->settings = $settings;
        $this->fileValidator = $fileValidator;
        $this->events = $events;
    }

    /**
     * @param Upload $command
     * @return static
     */
    public function handle(Upload $command)
    {
        $this->assertCan(
            $command->actor,
            'flagrow.upload'
        );

        $savedFiles = $command->files->map(function (UploadedFileInterface $file) use ($command) {

            // Move the file to a temporary location first.
            $tempFile = tempnam($this->app->storagePath() . '/tmp', 'flagrow.upload.');
            $file->moveTo($tempFile);

            $uploadedFile = new UploadedFile(
                $tempFile,
                $file->getClientFilename(),
                $file->getClientMediaType(),
                $file->getSize(),
                $file->getError(),
                true
            );

            unset($tempFile);

            $this->fileValidator->assertValid(['file' => $uploadedFile]);

            $this->upload = $this->identifyUploadAdapterForMime($uploadedFile->getMimeType());

            $this->events->fire(
                new Identified($command->actor, $uploadedFile, $this->upload)
            );

            $tempFilesystem = $this->getTempFilesystem($uploadedFile);

            if (!$this->upload) {
                $tempFilesystem->delete($uploadedFile->getBasename());
                throw new ValidationException('Uploading files of this type is not allowed.');
            }

            if (!$this->upload->forMime($uploadedFile->getMimeType())) {
                $tempFilesystem->delete($uploadedFile->getBasename());
                throw new ValidationException('Upload adapter does not support the provided mime type.');
            }

            $file = (new File())->forceFill([
                'base_name' => $this->getBasename($uploadedFile),
                'size' => $uploadedFile->getSize(),
                'type' => $uploadedFile->getMimeType(),
                'actor_id' => $command->actor->id,
            ]);

            $this->events->fire(
                new Events\WillBeUploaded($command->actor, $file, $uploadedFile)
            );

            $response = $this->upload->upload(
                $file,
                $uploadedFile,
                $this->upload->supportsStreams() ?
                    $tempFilesystem->readStream($uploadedFile->getBasename()) :
                    $tempFilesystem->read($uploadedFile->getBasename())
            );

            $file->upload_method = IllStr::snake(last(explode('\\', get_class($this->upload))));

            $tempFilesystem->delete($uploadedFile->getBasename());

            if (!($response instanceof File)) {
                return false;
            }

            $file = $response;
            $file->markdown_string = $this->getDefaultMarkdownStringAttribute($file);

            $this->events->fire(
                new Events\WasUploaded($command->actor, $file, $uploadedFile)
            );

            $this->events->fire(
                new Events\WillBeSaved($command->actor, $file, $uploadedFile)
            );

            if ($file->isDirty() || !$file->exists) {
                $file->save();
            }

            $this->events->fire(
                new Events\WasSaved($command->actor, $file, $uploadedFile)
            );

            return $file;
        });

        return $savedFiles->filter();
    }

    /**
     * @param UploadedFile $uploadedFile
     * @return Filesystem
     */
    protected function getTempFilesystem(UploadedFile $uploadedFile)
    {
        return new Filesystem(new Local($uploadedFile->getPath()));
    }

    /**
     * @param File $file
     * @return string
     */
    public function getDefaultMarkdownStringAttribute(File $file)
    {
        $label = "[$file->base_name]";
        $url = "({$file->url})";

        return $label . $url;
    }

    /**
     * @param UploadedFile $uploadedFile
     * @return string
     */
    protected function getBasename(UploadedFile $uploadedFile)
    {
        $name = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);


        $slug = trim(Str::slug($name));

        // Fixes uploads of filenames with foreign characters.
        if (empty($slug)) {
            $slug = $uuid = Uuid::uuid1();
        }

        return sprintf("%s.%s",
            $slug,
            $uploadedFile->guessExtension() ?
                $uploadedFile->guessExtension() :
                $uploadedFile->getClientOriginalExtension()
        );
    }

    /**
     * @param $mime
     * @return UploadAdapter|null
     */
    protected function identifyUploadAdapterForMime($mime)
    {
        $adapter = $this->settings->getMimeTypesConfiguration()->first(function ($regex, $_) use ($mime) {
            return preg_match("/$regex/", $mime);
        });

        if (!$adapter) {
            return null;
        }

        return app("flagrow.upload-adapter.$adapter");
    }
}
