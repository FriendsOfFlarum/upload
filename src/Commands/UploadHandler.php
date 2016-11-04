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
use Flagrow\Upload\Events\File as Events;
use Flagrow\Upload\File;
use Flagrow\Upload\Validators\FileValidator;
use Flagrow\Upload\Validators\MimeValidator;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Exception\ValidationException;
use Flarum\Core\Support\DispatchEventsTrait;
use Flarum\Foundation\Application;
use Flarum\Util\Str;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Str as IllStr;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class UploadHandler
{
    use AssertPermissionTrait, DispatchEventsTrait;

    /**
     * @var Application
     */
    protected $app;

    /**
     * @var UploadAdapter
     */
    protected $upload;

    /**
     * @var FileValidator
     */
    protected $fileValidator;

    /**
     * @var MimeValidator
     */
    protected $mimeValidator;

    /**
     * @var Dispatcher
     */
    protected $events;

    public function __construct(
        Application $app,
        UploadAdapter $upload,
        FileValidator $fileValidator,
        MimeValidator $mimeValidator,
        Dispatcher $events
    ) {
        $this->app = $app;
        $this->upload = $upload;
        $this->fileValidator = $fileValidator;
        $this->mimeValidator = $mimeValidator;
        $this->events = $events;
    }

    public function handle(Upload $command)
    {
        $this->assertCan(
            $command->actor,
            'flagrow.upload'
        );

        // Move the file to a temporary location first.
        $tempFile = tempnam($this->app->storagePath() . '/tmp', 'flagrow.file');
        $command->file->moveTo($tempFile);

        $uploadedFile = new UploadedFile(
            $tempFile,
            $command->file->getClientFilename(),
            $command->file->getClientMediaType(),
            $command->file->getSize(),
            $command->file->getError(),
            true
        );

        unset($tempFile);

        $this->fileValidator->assertValid(['file' => $uploadedFile]);
        $this->mimeValidator->assertValid(['mime' => $uploadedFile->getMimeType()]);

        if (!$this->upload->forMime($uploadedFile->getMimeType())) {
            throw new ValidationException('Upload adapter does not support the provided mime type.');
        }

        $file = (new File())->forceFill([
            'base_name' => Str::slug($uploadedFile->getClientOriginalName()),
            'size'      => $uploadedFile->getSize(),
            'type'      => $uploadedFile->getMimeType(),
            'actor_id'  => $command->actor->id,
        ]);

        $this->processable($file, $uploadedFile);

        $this->events->fire(
            new Events\WillBeUploaded($command->actor, $file, $uploadedFile)
        );

        $tempFilesystem = $this->getTempFilesystem($uploadedFile);

        $response = $this->upload->upload(
            $file,
            $uploadedFile,
            $this->upload->supportsStreams() ?
                $tempFilesystem->readStream($uploadedFile->getBasename()) :
                $tempFilesystem->read($uploadedFile->getBasename())
        );

        $tempFilesystem->delete($uploadedFile->getBasename());

        if (!($response instanceof File)) {
            return false;
        }

        $file = $response;

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
    }

    protected function processable(File &$file, UploadedFile &$uploadedFile)
    {
        list($type, $subType) = explode('/', $file->type);

        //.. todo fire event?

        foreach ([$type, "{$type}_{$subType}", $subType] as $typePrefix) {
            $class = sprintf(
                'Flagrow\\Upload\\Processors\\%sProcessor',
                IllStr::studly($typePrefix)
            );

            if (class_exists($class)) {
                return app($class)->process($file, $uploadedFile);
            }
        }
    }

    /**
     * @param UploadedFile $uploadedFile
     * @return Filesystem
     */
    protected function getTempFilesystem(UploadedFile $uploadedFile)
    {
        return new Filesystem(new Local($uploadedFile->getPath()));
    }
}
