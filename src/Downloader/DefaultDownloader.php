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

namespace FoF\Upload\Downloader;

use Flarum\Foundation\Paths;
use FoF\Upload\Commands\Download;
use FoF\Upload\Contracts\Downloader;
use FoF\Upload\Exceptions\InvalidDownloadException;
use FoF\Upload\Exceptions\MissingFileException;
use FoF\Upload\File;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Contracts\Filesystem\Factory;
use Laminas\Diactoros\Response\TextResponse;
use League\Flysystem\FilesystemException;
use Psr\Http\Message\ResponseInterface;

class DefaultDownloader implements Downloader
{
    public function __construct(
        private Client $api,
    ) {
    }

    public function forFile(File $file): bool
    {
        return true;
    }

    /**
     * @param File     $file
     * @param Download $command
     *
     * @throws InvalidDownloadException
     *
     * @return ResponseInterface
     */
    public function download(File $file, ?Download $command = null): ResponseInterface
    {
        switch($file->upload_method) {
            case 'local':
                return $this->retrieveFromLocal($file);
            case 'private-shared':
                return $this->retrieveFromPrivateShared($file);
            default:
                return $this->retrieveFromExternal($file);
        }
    }

    private function retrieveFromLocal(File $file): ResponseInterface
    {
        $file_contents = @file_get_contents(resolve(Paths::class)->public.'/assets/files/'.$file->path);

        if ($file_contents === false) {
            throw new MissingFileException("Local file not found on disk: {$file->path}");
        }

        return $this->mutateHeaders(new TextResponse($file_contents), $file);
    }

    private function retrieveFromExternal(File $file): ResponseInterface
    {
        try {
            $response = $this->api->get($file->url);
        } catch (ClientException $e) {
            // Storage that won't list a bucket answers a missing key with 403.
            if (in_array($e->getResponse()->getStatusCode(), [403, 404, 410], true)) {
                throw new MissingFileException($e->getMessage());
            }

            throw new InvalidDownloadException($e->getMessage());
        } catch (\Exception $e) {
            throw new InvalidDownloadException($e->getMessage());
        }

        if ($response->getStatusCode() === 200) {
            $response = $this->mutateHeaders($response, $file);
        }

        return $response;
    }

    private function retrieveFromPrivateShared(File $file): ResponseInterface
    {
        $privateSharedDir = resolve(Factory::class)->disk('private-shared');

        try {
            $file_contents = $privateSharedDir->get($file->path);
        } catch (FilesystemException) {
            $file_contents = null;
        }

        if ($file_contents === null) {
            throw new MissingFileException("Private file not found on disk: {$file->path}");
        }

        return $this->mutateHeaders(new TextResponse($file_contents), $file);
    }

    /**
     * @param ResponseInterface $response
     * @param File              $file
     *
     * @return ResponseInterface
     */
    protected function mutateHeaders(ResponseInterface $response, File $file)
    {
        $response = $response->withHeader('Content-Type', 'application/force-download');
        $response = $response->withAddedHeader('Content-Type', 'application/octet-stream');
        $response = $response->withAddedHeader('Content-Type', 'application/download');

        $response = $response->withHeader('Content-Transfer-Encoding', 'binary');

        $response = $response->withHeader(
            'Content-Disposition',
            sprintf('attachment; filename="%s"; filename*=utf-8\'\'%s', $file->base_name, urlencode($file->base_name))
        );

        return $response;
    }
}
