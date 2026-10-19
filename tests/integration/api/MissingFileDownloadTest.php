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

namespace FoF\Upload\Tests\integration\api;

use Flarum\Foundation\Paths;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use FoF\Upload\Commands\DownloadHandler;
use FoF\Upload\Downloader\DefaultDownloader;
use FoF\Upload\Tests\EnhancedTestCase;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Promise\Create;
use GuzzleHttp\Psr7\Response;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Psr\Http\Message\RequestInterface;

/**
 * A file whose record exists but whose stored object doesn't is a 404, and
 * storage that fails is a 502 — never a server error. Nothing is logged as
 * downloaded either way.
 */
class MissingFileDownloadTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        $file = fn (int $id, string $name, string $method, string $url, bool $privateShared = false) => [
            'id'            => $id, 'uuid' => "file-$id", 'base_name' => $name, 'path' => "missing/$name",
            'url'           => $url, 'type' => 'text/plain', 'size' => 10, 'upload_method' => $method,
            'actor_id'      => $privateShared ? null : 1, 'shared' => $privateShared, 'hidden' => $privateShared,
            'created_at'    => '2026-01-01 00:00:00',
        ];

        $this->prepareDatabase([
            'fof_upload_files' => [
                $file(1, 'here.txt', 'local', 'http://localhost/assets/files/missing/here.txt'),
                $file(2, 'gone.txt', 'local', 'http://localhost/assets/files/missing/gone.txt'),
                $file(3, 'gone-private.txt', 'private-shared', 'http://localhost/api/fof/download/file-3', true),
                $file(4, 'gone-404.txt', 'aws-s3', 'https://bucket.example.test/missing/gone-404.txt'),
                $file(5, 'gone-403.txt', 'aws-s3', 'https://bucket.example.test/missing/gone-403.txt'),
                $file(6, 'broken.txt', 'aws-s3', 'https://bucket.example.test/missing/broken.txt'),
                $file(7, 'unreachable.txt', 'aws-s3', 'https://bucket.example.test/missing/unreachable.txt'),
            ],
        ]);
    }

    protected function tearDown(): void
    {
        @unlink($this->publicPath('missing/here.txt'));

        parent::tearDown();
    }

    private function publicPath(string $path): string
    {
        return $this->app()->getContainer()->make(Paths::class)->public.'/assets/files/'.$path;
    }

    /**
     * Storage reached by URL answers per file, without the network.
     */
    private function fakeStorageUrls(): void
    {
        $handler = HandlerStack::create(new MockHandler(array_fill(0, 10, function (RequestInterface $request) {
            return match (basename($request->getUri()->getPath())) {
                'gone-404.txt'    => Create::promiseFor(new Response(404)),
                'gone-403.txt'    => Create::promiseFor(new Response(403)),
                'broken.txt'      => Create::promiseFor(new Response(500)),
                'unreachable.txt' => Create::rejectionFor(new ConnectException('Connection refused', $request)),
                default           => Create::promiseFor(new Response(200, [], 'content')),
            };
        })));

        // First in line, so it answers instead of the one built at boot.
        DownloadHandler::prependDownloader(new DefaultDownloader(new Client(['handler' => $handler])));
    }

    private function download(int $id): int
    {
        $this->app();
        $this->fakeStorageUrls();

        return $this->send($this->request('GET', "/api/fof/download/file-$id", ['authenticatedAs' => 1]))->getStatusCode();
    }

    #[Test]
    public function a_file_that_is_there_downloads(): void
    {
        $this->app();
        @mkdir(dirname($this->publicPath('missing/here.txt')), 0777, true);
        file_put_contents($this->publicPath('missing/here.txt'), 'here');

        $this->assertSame(200, $this->download(1));
    }

    public static function missingFiles(): array
    {
        return [
            'not on the local disk'        => [2],
            'not on the private disk'      => [3],
            'not in the bucket (404)'      => [4],
            'not readable in bucket (403)' => [5],
        ];
    }

    #[Test]
    #[DataProvider('missingFiles')]
    public function a_file_missing_from_storage_is_not_found(int $id): void
    {
        $this->assertSame(404, $this->download($id));
        $this->assertSame(0, $this->database()->table('fof_upload_downloads')->count(), 'Nothing is logged as downloaded');
    }

    public static function failingStorage(): array
    {
        return ['storage answers with an error' => [6], 'storage cannot be reached' => [7]];
    }

    #[Test]
    #[DataProvider('failingStorage')]
    public function storage_that_fails_is_a_bad_gateway(int $id): void
    {
        $this->assertSame(502, $this->download($id));
        $this->assertSame(0, $this->database()->table('fof_upload_downloads')->count());
    }
}
