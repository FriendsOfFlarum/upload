<?php

namespace FoF\Upload\Commands;

use FoF\Upload\Contracts\Downloader;
use FoF\Upload\Events\File\WasLoaded;
use FoF\Upload\Events\File\WillBeDownloaded;
use FoF\Upload\Exceptions\InvalidDownloadException;
use FoF\Upload\Helpers\Settings;
use FoF\Upload\Repositories\FileRepository;
use Flarum\Discussion\DiscussionRepository;
use Flarum\User\AssertPermissionTrait;
use GuzzleHttp\Client;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;

class DownloadHandler
{
    use AssertPermissionTrait;

    protected static $downloader = [];

    /**
     * @var FileRepository
     */
    private $files;
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
    /**
     * @var Settings
     */
    private $settings;

    public function __construct(FileRepository $files, DiscussionRepository $discussions, Client $api, Dispatcher $events, Settings $settings)
    {
        $this->files = $files;
        $this->discussions = $discussions;
        $this->api = $api;
        $this->events = $events;
        $this->settings = $settings;
    }

    /**
     * @param Download $command
     *
     * @throws InvalidDownloadException
     * @throws \Flarum\User\Exception\PermissionDeniedException
     * @throws InvalidDownloadException
     *
     * @return mixed
     */
    public function handle(Download $command)
    {
        $this->assertCan(
            $command->actor,
            'fof-upload.download'
        );

        $file = $this->files->findByUuid($command->uuid);

        if (!$file) {
            throw new ModelNotFoundException();
        }

        $this->events->fire(
            new WasLoaded($file)
        );

        foreach (static::downloader() as $downloader) {
            if ($downloader->forFile($file)) {
                $response = $downloader->download($file, $command);

                if (!$response) {
                    continue;
                }

                $download = null;

                if ($this->settings->get('disableDownloadLogging') != 1) {
                    $download = $this->files->downloadedEntry($file, $command);
                }

                $this->events->fire(
                    new WillBeDownloaded($file, $response, $download)
                );

                return $response;
            }
        }

        throw new InvalidDownloadException();
    }

    public static function prependDownloader(Downloader $downloader)
    {
        static::$downloader = Arr::prepend(static::$downloader, $downloader);
    }

    public static function addDownloader(Downloader $downloader)
    {
        static::$downloader[] = $downloader;
    }

    public static function downloader()
    {
        return static::$downloader;
    }
}
