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

use Flarum\Foundation\ValidationException;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Upload\Adapters\Manager;
use FoF\Upload\File;
use FoF\Upload\Helpers\Util;
use FoF\Upload\Repositories\FileRepository;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;

class DeleteFileHandler
{
    /**
     * @var Cloud
     */
    protected $sharedPrivateDir;

    public function __construct(
        protected FileRepository $files,
        protected Dispatcher $events,
        protected SettingsRepositoryInterface $settings,
        protected Manager $manager,
        protected Util $util,
        Factory $factory
    ) {
        $this->sharedPrivateDir = $factory->disk('private-shared');
    }

    public function handle(DeleteFile $command): void
    {
        $privateShared = $this->util->isPrivateShared($command->file);
        $fileIsShared = $privateShared || $command->file->shared;

        $hasPermission = false;

        if ($fileIsShared) {
            $hasPermission = $command->actor->can('fof-upload.deleteSharedUploads');
        } else {
            if ($command->actor->id === $command->file->actor_id) {
                $hasPermission = $command->actor->can('fof-upload.deleteUserUploads');
            } else {
                $hasPermission = $command->actor->can('fof-upload.deleteOtherUsersUploads');
            }
        }

        /**
         * If none of the above conditions are met, a `PermissionDeniedException`
         * is thrown as a precaution.
         */
        if (!$hasPermission && !$command->actor->isAdmin()) {
            throw new PermissionDeniedException();
        }

        $success = $privateShared
            ? $this->deleteSharedFile($command->file)
            : $this->deleteFileViaAdaptor($command->file);

        if ($success === false) {
            throw new ValidationException(['file' => 'Could not delete file.']);
        }

        $command->file->delete();
    }

    protected function deleteSharedFile(File $file): bool
    {
        return $this->sharedPrivateDir->delete($file->path);
    }

    protected function deleteFileViaAdaptor(File $file): File|bool
    {
        $adapter = $this->util->getAdapterForFile($file);

        return $adapter->delete($file);
    }
}
