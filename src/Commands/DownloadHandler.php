<?php

namespace Flagrow\Upload\Commands;

use Flagrow\Upload\Events\File\WasLoaded;
use Flagrow\Upload\Events\File\WillBeDownloaded;
use Flagrow\Upload\Exceptions\InvalidDownloadException;
use Flagrow\Upload\File;
use Flagrow\Upload\Repositories\FileRepository;
use Flagrow\Upload\Validators\DownloadValidator;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Repository\DiscussionRepository;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Psr\Http\Message\ResponseInterface;
use Illuminate\Contracts\Events\Dispatcher;

class DownloadHandler
{
    use AssertPermissionTrait;

    /**
     * @var FileRepository
     */
    private $files;
    /**
     * @var DownloadValidator
     */
    private $validator;
    /**
     * @var DiscussionRepository
     */
    private $discussions;
    /**
     * @var Client
     */
    private $api;
    /**
     * @var Dispatcher
     */
    private $events;

    public function __construct(FileRepository $files, DownloadValidator $validator, DiscussionRepository $discussions, Client $api, Dispatcher $events)
    {

        $this->files = $files;
        $this->validator = $validator;
        $this->discussions = $discussions;
        $this->api = $api;
        $this->events = $events;
    }

    /**
     * @param Download $command
     * @return \Psr\Http\Message\ResponseInterface
     * @throws InvalidDownloadException
     */
    public function handle(Download $command)
    {
        $discussion = $this->discussions->query()->find($command->discussionId);

        $this->assertCan(
            $command->actor,
            'flagrow.upload.download',
            $discussion ?: []
        );

        $file = $this->files->findByUuid($command->uuid);

        if (!$file) {
            throw new ModelNotFoundException();
        }

        $this->validator->assertValid(compact('file'));

        $this->events->fire(
            new WasLoaded($file)
        );

        try {
            $response = $this->api->get($file->url);
        } catch (\Exception $e) {
            throw new InvalidDownloadException($e->getMessage());
        }

        if ($response->getStatusCode() == 200) {
            $download = $this->files->downloadedEntry($file, $command);

            $response = $this->mutateHeaders($response, $file);

            $this->events->fire(
                new WillBeDownloaded($file, $response, $download)
            );

            return $response;
        }

        throw new InvalidDownloadException();
    }

    /**
     * @param ResponseInterface $response
     * @param File $file
     * @return ResponseInterface
     */
    protected function mutateHeaders(ResponseInterface $response, File $file)
    {
        $response = $response->withHeader('Content-Type', 'application/force-download');
        $response = $response->withAddedHeader('Content-Type', 'application/octet-stream');
        $response = $response->withAddedHeader('Content-Type', 'application/download');

        $response = $response->withHeader('Content-Transfer-Encoding', 'binary');

        $response = $response->withHeader(
            sprintf('Content-Disposition', 'attachment; filename="%s"', $file->base_name)
        );

        return $response;
    }
}
