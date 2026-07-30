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

use Flarum\Discussion\Discussion;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Upload\Access\TagScopedDownloadGate;
use FoF\Upload\Contracts\Downloader;
use FoF\Upload\Events\File\WasLoaded;
use FoF\Upload\Events\File\WillBeDownloaded;
use FoF\Upload\Exceptions\InvalidDownloadException;
use FoF\Upload\File;
use FoF\Upload\Repositories\FileRepository;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;

class DownloadHandler
{
    protected static array $downloader = [];

    public function __construct(
        protected FileRepository $files,
        protected Dispatcher $events,
        protected SettingsRepositoryInterface $settings,
        protected TagScopedDownloadGate $tagGate
    ) {
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
        $command->actor->assertCan('fof-upload.download');

        $file = $this->files->findByUuid($command->uuid);

        if (!$file) {
            throw new ModelNotFoundException();
        }

        $this->assertTagScopedDownloadAllowed($command, $file);

        $this->events->dispatch(
            new WasLoaded($file)
        );

        foreach (static::downloader() as $downloader) {
            if ($downloader->forFile($file)) {
                $response = $downloader->download($file, $command);

                if (!$response) {
                    continue;
                }

                $download = null;

                if ($this->settings->get('fof-upload.disableDownloadLogging') != 1) {
                    $download = $this->files->downloadedEntry($file, $command);
                }

                $this->events->dispatch(
                    new WillBeDownloaded($file, $response, $download)
                );

                return $response;
            }
        }

        throw new InvalidDownloadException();
    }

    /**
     * Enforce per-tag download permissions.
     *
     * When the download was initiated from a post we scope to that post's
     * discussion. The bare-UUID route carries no post context, so the gate
     * falls back to every discussion the file appears in — otherwise that
     * route could be used to sidestep tag scoping entirely, and the uuid is
     * readable straight out of the rendered post markup.
     *
     * @throws PermissionDeniedException
     */
    protected function assertTagScopedDownloadAllowed(Download $command, File $file): void
    {
        if (!$this->tagGate->enabled()) {
            return;
        }

        $discussion = $command->discussionId !== null
            ? Discussion::query()->with('tags')->find($command->discussionId)
            : null;

        if (!$this->tagGate->allows($command->actor, $file, $discussion)) {
            throw new PermissionDeniedException();
        }
    }

    public static function prependDownloader(Downloader $downloader): void
    {
        static::$downloader = Arr::prepend(static::$downloader, $downloader);
    }

    public static function addDownloader(Downloader $downloader): void
    {
        static::$downloader[] = $downloader;
    }

    public static function downloader(): array
    {
        return static::$downloader;
    }
}
