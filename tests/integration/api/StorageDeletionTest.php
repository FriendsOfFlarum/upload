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

use Carbon\Carbon;
use Flarum\Foundation\Paths;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Upload\File;
use FoF\Upload\Repositories\FileRepository;
use FoF\Upload\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

/**
 * Deleting a file removes what it stored — the file and its thumbnail — on a
 * local disk and on a remote one, whichever way it's deleted. A storage failure
 * keeps the database row, so the objects aren't orphaned and a retry can finish.
 */
class StorageDeletionTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;
    use UploadFileTrait;
    use FakeS3Storage;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');
        $this->prepareDatabase([User::class => [$this->normalUser()]]);
        $this->setting('fof-upload.generateThumbnails', '1');
        $this->setting('fof-upload.thumbnailMaxWidth', '100');
        $this->useFakeS3();
    }

    public static function disks(): array
    {
        return ['local disk' => ['local'], 'S3' => ['aws-s3']];
    }

    public static function routesAndDisks(): array
    {
        $cases = [];
        foreach (['upload delete route', 'files API'] as $route) {
            foreach (self::disks() as $disk => [$adapter]) {
                $cases["$route, $disk"] = [$route, $adapter];
            }
        }

        return $cases;
    }

    private function uploadImage(string $adapter): File
    {
        $this->addType('^image\\/jpeg$', $adapter, 'image-preview');

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 1,
                'multipart'       => [$this->uploadFile($this->fixtures('MilkyWay.jpg'))],
            ])
        );

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());

        $file = File::byUuid(json_decode((string) $response->getBody(), true)['data'][0]['attributes']['uuid'])->firstOrFail();

        $this->assertSame($adapter, $file->upload_method);
        $this->assertNotEmpty($file->thumbnail_path, 'Precondition: the upload has a thumbnail');

        if ($adapter === 'local') {
            $this->assertFileExists($this->localPath($file->path));
            $this->assertFileExists($this->localPath($file->thumbnail_path));
        } else {
            $this->assertEqualsCanonicalizing([$file->path, $file->thumbnail_path], $this->s3Keys('PutObject'));
        }

        return $file;
    }

    private function localPath(string $path): string
    {
        return $this->app()->getContainer()->make(Paths::class)->public.'/assets/files/'.$path;
    }

    private function deleteThrough(string $route, File $file)
    {
        return $this->send(
            $route === 'files API'
                ? $this->request('DELETE', '/api/files/'.$file->id, ['authenticatedAs' => 1])
                : $this->request('DELETE', '/api/fof/upload/delete/'.$file->uuid, ['authenticatedAs' => 1])
        );
    }

    private function assertStorageEmptied(string $adapter, File $file): void
    {
        if ($adapter === 'local') {
            $this->assertFileDoesNotExist($this->localPath($file->path), 'The file is removed from disk');
            $this->assertFileDoesNotExist($this->localPath($file->thumbnail_path), 'The thumbnail is removed from disk');
        } else {
            $this->assertEqualsCanonicalizing(
                [$file->path, $file->thumbnail_path],
                $this->s3Keys('DeleteObject'),
                'The file and its thumbnail are deleted from the bucket'
            );
        }
    }

    #[Test]
    #[DataProvider('routesAndDisks')]
    public function deleting_removes_the_file_and_its_thumbnail_from_storage(string $route, string $adapter): void
    {
        $file = $this->uploadImage($adapter);

        $response = $this->deleteThrough($route, $file);

        $this->assertSame(204, $response->getStatusCode(), (string) $response->getBody());
        $this->assertFalse(File::byUuid($file->uuid)->exists(), 'The row is gone');
        $this->assertStorageEmptied($adapter, $file);
    }

    public static function failingObjects(): array
    {
        $cases = [];
        foreach (['upload delete route', 'files API'] as $route) {
            foreach (['file', 'thumbnail'] as $object) {
                $cases["$route, $object delete fails"] = [$route, $object];
            }
        }

        return $cases;
    }

    #[Test]
    #[DataProvider('failingObjects')]
    public function a_failed_remote_delete_keeps_the_row(string $route, string $object): void
    {
        $file = $this->uploadImage('aws-s3');
        $failingKey = $object === 'file' ? $file->path : $file->thumbnail_path;
        $this->s3Fails = fn (string $command, ?string $key) => $command === 'DeleteObject' && $key === $failingKey;

        $response = $this->deleteThrough($route, $file);

        $this->assertSame(422, $response->getStatusCode(), (string) $response->getBody());
        $this->assertTrue(File::byUuid($file->uuid)->exists(), 'The row survives, so the object is not orphaned');

        // Once storage recovers, the same delete finishes the job.
        $this->s3Fails = null;
        $this->s3Commands = [];

        $response = $this->deleteThrough($route, $file);

        $this->assertSame(204, $response->getStatusCode(), (string) $response->getBody());
        $this->assertFalse(File::byUuid($file->uuid)->exists());
        $this->assertStorageEmptied('aws-s3', $file);
    }

    #[Test]
    #[DataProvider('routesAndDisks')]
    public function a_refused_delete_leaves_storage_alone(string $route, string $adapter): void
    {
        $file = $this->uploadImage($adapter);

        $response = $this->send(
            $route === 'files API'
                ? $this->request('DELETE', '/api/files/'.$file->id, ['authenticatedAs' => 2])
                : $this->request('DELETE', '/api/fof/upload/delete/'.$file->uuid, ['authenticatedAs' => 2])
        );

        $this->assertSame(403, $response->getStatusCode(), (string) $response->getBody());
        $this->assertTrue(File::byUuid($file->uuid)->exists());

        if ($adapter === 'local') {
            $this->assertFileExists($this->localPath($file->path));
            $this->assertFileExists($this->localPath($file->thumbnail_path));
        } else {
            $this->assertSame([], $this->s3Keys('DeleteObject'));
        }
    }

    #[Test]
    #[DataProvider('disks')]
    public function the_cleanup_command_removes_the_thumbnail_too(string $adapter): void
    {
        $file = $this->uploadImage($adapter);

        $removed = $this->app()->getContainer()->make(FileRepository::class)->cleanUp(Carbon::now()->addDay());

        $this->assertSame(1, $removed);
        $this->assertFalse(File::byUuid($file->uuid)->exists());
        $this->assertStorageEmptied($adapter, $file);
    }
}
