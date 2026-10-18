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
        $command->actor->assertCan('delete', $command->file);

        $privateShared = $this->util->isPrivateShared($command->file);

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

    protected function deleteFileViaAdaptor(File $file): bool
    {
        // Resolved from where the file was actually stored, not from what its
        // mime type maps to today — those diverge as soon as an admin edits the
        // file-type list, and deleting against the wrong adapter silently leaves
        // the stored object behind.
        $adapter = $this->util->getStorageAdapterForFile($file);

        if ($adapter === null) {
            // No adapter could be resolved at all, so there is nothing that can
            // remove the object. Reported rather than allowed to fatal on a null
            // call, which previously left both the file and its database row.
            return false;
        }

        return $this->files->deleteFromStorage($file, $adapter);
    }
}
