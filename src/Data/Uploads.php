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

    public function anonymize(): void
    {
        File::query()
            ->where('actor_id', $this->user->id)
            ->update([
                'actor_id' => null,
            ]);
    }

    public function delete(): void
    {
        // TODO: this currently only removes the entry from the DB, we also need to remove the files from storage.

        File::query()
            ->where('actor_id', $this->user->id)
            ->delete();
    }
}
