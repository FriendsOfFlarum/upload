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

use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Adapters\Manager;
use FoF\Upload\Helpers\Util;
use FoF\Upload\Repositories\FileRepository;
use Illuminate\Contracts\Events\Dispatcher;

class DeleteFileHandler
{
    public function __construct(
        protected FileRepository $files,
        protected Dispatcher $events,
        protected SettingsRepositoryInterface $settings,
        protected Manager $manager,
        protected Util $util
    ) {
    }

    public function handle(DeleteFile $command): void
    {
        if ($command->file->shared && $command->file->actor === null) {
            $command->actor->assertCan('fof-upload.upload-shared-files');
        } else {
            // We don't currently have a permission for this, so we'll just use admin.
            $command->actor->assertAdmin();
        }

        $adapter = $this->util->getAdapterForFile($command->file);

        // Delete the file from storage.
        $result = $adapter->delete($command->file);

        if ($result === false) {
            // Deletion failed.
        } else {
            // Delete the file record from the database.
            $command->file->delete();
        }
    }
}
