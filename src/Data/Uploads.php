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

use Flarum\Gdpr\Data\Type;
use FoF\Upload\Adapters\Manager;
use FoF\Upload\Downloader\DefaultDownloader;
use FoF\Upload\File;
use Psr\Log\LoggerInterface;

class Uploads extends Type
{
    public function export(): ?array
    {
        /** @var DefaultDownloader $downloader */
        $downloader = resolve(DefaultDownloader::class);

        $dataExport = [];

        File::query()
            ->where('actor_id', $this->user->id)
            ->orderBy('id', 'asc')
            ->each(function (File $file) use ($downloader, &$dataExport) {
                $fileContent = $downloader->download($file)->getBody()->getContents();
                $dataExport[] = ["uploads/{$file->path}" => $fileContent];
            });

        return $dataExport;
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
        /** @var Manager $manager */
        $manager = resolve(Manager::class);

        /** @var LoggerInterface $logger */
        $logger = resolve(LoggerInterface::class);

        File::query()
            ->where('actor_id', $this->user->id)
            ->each(function (File $file) use ($manager, $logger) {
                $adaptor = $manager->instantiate($file->upload_method);

                if ($adaptor->delete($file)) {
                    $file->delete();
                } else {
                    $logger->error("[GDPR][FoF Upload] Could not delete file {$file->id} from disk.");
                }
            });
    }
}
