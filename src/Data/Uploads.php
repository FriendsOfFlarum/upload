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
use FoF\Upload\Adapters\Flysystem;
use FoF\Upload\Adapters\Manager;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\Downloader\DefaultDownloader;
use FoF\Upload\File;
use GuzzleHttp\Client;
use League\Flysystem\FilesystemException;
use Psr\Log\LoggerInterface;

class Uploads extends Type
{
    /**
     * How long to wait for a file fetched from its URL: to connect, and to
     * receive it. A server that never answers would otherwise hold the export
     * up until the queue gives up on the job.
     */
    protected const URL_CONNECT_TIMEOUT = 10;
    protected const URL_TIMEOUT = 120;

    /**
     * @var array<string, UploadAdapter|false> adapters by upload method, built once per export
     */
    protected array $adapters = [];

    public function export(): ?array
    {
        $dataExport = [];
        $notIncluded = [];

        File::query()
            ->where('actor_id', $this->user->id)
            ->orderBy('id', 'asc')
            ->each(function (File $file) use (&$dataExport, &$notIncluded) {
                $contents = $this->contents($file);

                if ($contents === null) {
                    $notIncluded[] = ['name' => $file->base_name, 'url' => $file->url];

                    return;
                }

                $dataExport[] = ["uploads/{$file->path}" => $contents];
            });

        // Rather than leave a file out without a word, say which ones couldn't
        // be retrieved.
        if ($notIncluded) {
            $dataExport[] = ['uploads/not-included.json' => json_encode($notIncluded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)];
        }

        return $dataExport;
    }

    /**
     * A file's contents, or null when they can't be retrieved.
     *
     * Read from where the file is stored where possible: the forum's own disks,
     * or the storage its adapter wrote it to. The file's URL is the fallback,
     * for adapters that can't be read (and storage set up differently since the
     * file was uploaded).
     */
    protected function contents(File $file): ?string
    {
        if (in_array($file->upload_method, ['local', 'private-shared'], true)) {
            try {
                return resolve(DefaultDownloader::class)->download($file)->getBody()->getContents();
            } catch (\Exception) {
                return null;
            }
        }

        $adapter = $this->adapters[$file->upload_method] ??= $this->adapter($file->upload_method);

        if ($adapter instanceof Flysystem) {
            try {
                return $adapter->read($file);
            } catch (FilesystemException) {
                // Not where this adapter now looks; try the URL.
            }
        }

        try {
            return (string) resolve(Client::class)->get($file->url, [
                'connect_timeout' => self::URL_CONNECT_TIMEOUT,
                'timeout'         => self::URL_TIMEOUT,
            ])->getBody();
        } catch (\Exception) {
            return null;
        }
    }

    protected function adapter(string $method): UploadAdapter|false
    {
        try {
            return resolve(Manager::class)->instantiate($method);
        } catch (\Exception) {
            return false;
        }
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
