<?php

namespace Flagrow\Upload\Repositories;

use Flagrow\Upload\Contracts\UploadAdapter;
use Flagrow\Upload\File;
use Flagrow\Upload\Validators\UploadValidator;
use Flarum\Core\User;
use Flarum\Foundation\Application;
use Illuminate\Support\Str;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use Psr\Http\Message\UploadedFileInterface;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\File\UploadedFile as Upload;

class FileRepository
{
    /**
     * @var File
     */
    protected $file;
    /**
     * @var string
     */
    protected $path;
    /**
     * @var FileValidator
     */
    private $validator;

    function __construct(File $file, Application $app, UploadValidator $validator)
    {
        $this->file = $file;
        $this->path = $app->storagePath();
        $this->validator = $validator;
    }

    /**
     * @param $uuid
     * @return \Illuminate\Database\Eloquent\Model|null|static
     */
    public function findByUuid($uuid)
    {
        return $this->file->newQuery()
            ->where('uuid', $uuid)
            ->first();
    }

    /**
     * @param Upload $file
     * @param User $actor
     * @return File
     */
    public function createFileFromUpload(Upload $file, User $actor)
    {
        // Generate a guaranteed unique Uuid.
        while($uuid = Uuid::uuid4()->toString()) {
            if (! $this->findByUuid($uuid)) {
                break;
            }
        }

        return ($this->file->newInstance())->forceFill([
            'uuid' => $uuid,
            'base_name' => $this->getBasename($file, $uuid),
            'size' => $file->getSize(),
            'type' => $file->getMimeType(),
            'actor_id' => $actor->id,
        ]);
    }

    /**
     * @param UploadedFileInterface $upload
     * @return Upload
     */
    public function moveUploadedFileToTemp(UploadedFileInterface $upload)
    {
        // Move the file to a temporary location first.
        $tempFile = tempnam($this->path . '/tmp', 'flagrow.upload.');
        $upload->moveTo($tempFile);

        $file = new Upload(
            $tempFile,
            $upload->getClientFilename(),
            $upload->getClientMediaType(),
            $upload->getSize(),
            $upload->getError(),
            true
        );

        $this->validator->assertValid(compact('file'));

        return $file;
    }

    /**
     * Deletes a file from the temporary file location.
     *
     * @param Upload $file
     * @return bool
     */
    public function removeFromTemp(Upload $file)
    {
        return $this->getTempFilesystem($file->getPath())->delete($file->getBasename());
    }

    /**
     * Retrieves a filesystem manager for the temporary file location.
     *
     * @param string $path
     * @return Filesystem
     */
    protected function getTempFilesystem($path)
    {
        return new Filesystem(new Local($path));
    }

    /**
     * @param Upload $upload
     * @param string $uuid
     * @return string
     */
    protected function getBasename(Upload $upload, $uuid)
    {
        $name = pathinfo($upload->getClientOriginalName(), PATHINFO_FILENAME);

        $slug = trim(Str::slug($name));

        return sprintf("%s.%s",
            empty($slug) ? $uuid : $slug,
            $upload->guessExtension() ? $upload->guessExtension() : $upload->getClientOriginalExtension()
        );
    }

    /**
     * @param Upload $upload
     * @param UploadAdapter $adapter
     * @return bool|false|resource|string
     */
    public function readUpload(Upload $upload, UploadAdapter $adapter)
    {
        $filesystem = $this->getTempFilesystem($upload->getPath());

        return $adapter->supportsStreams()
            ? $filesystem->readStream($upload->getBasename())
            : $filesystem->read($upload->getBasename());
    }
}
