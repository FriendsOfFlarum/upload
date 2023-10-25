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

namespace FoF\Upload\Data;

use Blomstra\Gdpr\Data\Type;
use FoF\Upload\Downloader\DefaultDownloader;
use FoF\Upload\File;
use PhpZip\ZipFile;

class Uploads extends Type
{
    public static function exportDescription(): string
    {
        return 'All files uploaded by the user.';
    }

    public function export(ZipFile $zip): void
    {
        /** @var DefaultDownloader $downloader */
        $downloader = resolve(DefaultDownloader::class);

        File::query()
            ->where('actor_id', $this->user->id)
            ->orderBy('id', 'asc')
            ->each(function (File $file) use ($zip, $downloader) {
                $fileContent = $downloader->download($file)->getBody()->getContents();
                $zip->addFromString(
                    "uploads/{$file->path}",
                    $fileContent
                );
            });
    }

    public static function anonymizeDescription(): string
    {
        return 'Removes the user reference from the uploaded files. The files themselves remain accessible to users that could view them pre-anonymization.';
    }

    public function anonymize(): void
    {
        File::query()
            ->where('actor_id', $this->user->id)
            ->update([
                'actor_id' => null,
            ]);
    }

    public static function deleteDescription(): string
    {
        return 'Currently, the file entry is removed from the database, but the file itself is not deleted. This will change to include removing the file from the disk before the stable release of GDPR.';
    }

    public function delete(): void
    {
        // TODO: this currently only removes the entry from the DB, we also need to remove the files from storage.

        File::query()
            ->where('actor_id', $this->user->id)
            ->delete();
    }
}
