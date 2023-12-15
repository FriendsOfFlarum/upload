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

        if ($privateShared || $command->file->shared) {
            $command->actor->assertCan('fof-upload.upload-shared-files');
        } else {
            // We don't currently have a permission for this, so we'll just use admin.
            $command->actor->assertAdmin();
        }

        $success = false;

        // Delete the file from storage.
        if ($privateShared) {
            $success = $this->deleteSharedFile($command->file);
        } else {
            $success = $this->deleteFileViaAdaptor($command->file);
        }

        if ($success === false) {
            throw new ValidationException(['file' => 'Could not delete file.']);
        } else {
            // Delete the file record from the database.
            $command->file->delete();
        }
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
