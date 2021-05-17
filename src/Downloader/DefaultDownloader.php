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
use FoF\Upload\File;
use GuzzleHttp\Client;
use Laminas\Diactoros\Response\TextResponse;
use Psr\Http\Message\ResponseInterface;

class DefaultDownloader implements Downloader
{
    /**
     * @var Client
     */
    private $api;

    public function __construct(Client $api)
    {
        $this->api = $api;
    }

    /**
     * Whether the upload adapter works on a specific mime type.
     *
     * @param File $file
     *
     * @return bool
     */
    public function forFile(File $file)
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
    public function download(File $file, Download $command): ResponseInterface
    {
        if ($file->upload_method === 'local') {
            return $this->retrieveFromLocal($file);
        }

        return $this->retrieveFromExternal($file);
    }

    private function retrieveFromLocal(File $file): ResponseInterface
    {
        $file_contents = file_get_contents(resolve(Paths::class)->public.'/assets/files/'.$file->path);

        return $this->mutateHeaders(new TextResponse($file_contents), $file);
    }

    private function retrieveFromExternal(File $file): ResponseInterface
    {
        try {
            $response = $this->api->get($file->url);
        } catch (\Exception $e) {
            throw new InvalidDownloadException($e->getMessage());
        }

        if ($response->getStatusCode() == 200) {
            $response = $this->mutateHeaders($response, $file);

            return $response;
        }
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
            sprintf('attachment; filename="%s"', $file->base_name)
        );

        return $response;
    }
}
