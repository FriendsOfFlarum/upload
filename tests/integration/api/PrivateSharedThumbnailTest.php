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
use FoF\Upload\File;
use FoF\Upload\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

/**
 * Hiding a shared image moves it into private storage. Nothing of it may stay
 * publicly reachable — its thumbnail included — and making it public again
 * gives it a fresh thumbnail.
 */
class PrivateSharedThumbnailTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;
    use UploadFileTrait;
    use FakeS3Storage;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');
        $this->setting('fof-upload.generateThumbnails', '1');
        $this->setting('fof-upload.thumbnailMaxWidth', '100');
        $this->useFakeS3();
    }

    public static function disks(): array
    {
        return ['local disk' => ['local'], 'S3' => ['aws-s3']];
    }

    private function uploadSharedImage(string $adapter): File
    {
        $this->addType('^image\\/jpeg$', $adapter, 'image-preview');

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 1,
                'multipart'       => [$this->uploadFile($this->fixtures('MilkyWay.jpg'))],
                'json'            => ['options' => ['shared' => true]],
            ])
        );

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());

        $file = File::byUuid(json_decode((string) $response->getBody(), true)['data'][0]['attributes']['uuid'])->firstOrFail();

        $this->assertTrue((bool) $file->shared);
        $this->assertNotEmpty($file->thumbnail_path, 'Precondition: the shared upload has a thumbnail');

        return $file;
    }

    private function toggleHidden(File $file)
    {
        return $this->send(
            $this->request('PATCH', '/api/fof/upload/hide', [
                'authenticatedAs' => 1,
                'json'            => ['uuid' => $file->uuid],
            ])
        );
    }

    private function publicPath(string $path): string
    {
        return $this->app()->getContainer()->make(Paths::class)->public.'/assets/files/'.$path;
    }

    private function privatePath(string $path): string
    {
        return $this->app()->getContainer()->make(Paths::class)->storage.'/private-shared/files/'.$path;
    }

    #[Test]
    #[DataProvider('disks')]
    public function hiding_a_shared_image_removes_its_public_copy_and_thumbnail(string $adapter): void
    {
        $file = $this->uploadSharedImage($adapter);
        $this->s3Commands = [];

        $response = $this->toggleHidden($file);

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());

        $hidden = File::byUuid($file->uuid)->firstOrFail();
        $this->assertTrue((bool) $hidden->hidden);
        $this->assertSame('private-shared', $hidden->upload_method);
        $this->assertFileExists($this->privatePath($hidden->path), 'The private copy is written');

        if ($adapter === 'local') {
            $this->assertFileDoesNotExist($this->publicPath($file->path), 'The public file is removed');
            $this->assertFileDoesNotExist($this->publicPath($file->thumbnail_path), 'The public thumbnail is removed');
        } else {
            $this->assertEqualsCanonicalizing([$file->path, $file->thumbnail_path], $this->s3Keys('DeleteObject'));
        }

        $this->assertNull($hidden->thumbnail_path, 'A private file has no thumbnail');
        $this->assertNull($hidden->thumbnail_url);
        $this->assertNull($hidden->thumbnail_width);
        $this->assertNull($hidden->thumbnail_height);
    }

    public static function failingPublicObjects(): array
    {
        return ['public file delete fails' => ['file'], 'public thumbnail delete fails' => ['thumbnail']];
    }

    #[Test]
    #[DataProvider('failingPublicObjects')]
    public function a_hide_that_cannot_remove_the_public_copy_is_refused(string $object): void
    {
        $file = $this->uploadSharedImage('aws-s3');
        $failingKey = $object === 'file' ? $file->path : $file->thumbnail_path;
        $this->s3Fails = fn (string $command, ?string $key) => $command === 'DeleteObject' && $key === $failingKey;

        $response = $this->toggleHidden($file);

        $this->assertSame(422, $response->getStatusCode(), (string) $response->getBody());

        $after = File::byUuid($file->uuid)->firstOrFail();
        $this->assertFalse((bool) $after->hidden, 'It stays a public shared file');
        $this->assertSame('aws-s3', $after->upload_method);
        $this->assertArrayHasKey($file->path, $this->s3Objects, 'The public file is still there');
        $this->assertFileDoesNotExist($this->privatePath($file->path), 'The private copy is rolled back');

        if ($object === 'thumbnail') {
            $this->assertSame($file->thumbnail_path, $after->thumbnail_path, 'Its thumbnail is untouched');
        } else {
            // The thumbnail is removed first, so it went before the file failed:
            // the row must not keep pointing previews at it.
            $this->assertArrayNotHasKey($file->thumbnail_path, $this->s3Objects);
            $this->assertNull($after->thumbnail_path);
            $this->assertNull($after->thumbnail_url);
        }
    }

    #[Test]
    #[DataProvider('disks')]
    public function making_it_public_again_gives_it_a_fresh_thumbnail(string $adapter): void
    {
        $file = $this->uploadSharedImage($adapter);
        $this->assertSame(200, $this->toggleHidden($file)->getStatusCode());
        $this->s3Commands = [];

        $response = $this->toggleHidden($file);

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());

        $public = File::byUuid($file->uuid)->firstOrFail();
        $this->assertFalse((bool) $public->hidden);
        $this->assertSame($adapter, $public->upload_method);
        $this->assertNotEmpty($public->thumbnail_path, 'A thumbnail is generated again');
        $this->assertNotEmpty($public->thumbnail_url);
        $this->assertNotNull($public->thumbnail_width);
        $this->assertNotNull($public->thumbnail_height);
        $this->assertFileDoesNotExist($this->privatePath($file->path), 'The private copy is removed');

        if ($adapter === 'local') {
            $this->assertFileExists($this->publicPath($public->path));
            $this->assertFileExists($this->publicPath($public->thumbnail_path));
        } else {
            $this->assertEqualsCanonicalizing([$public->path, $public->thumbnail_path], $this->s3Keys('PutObject'));
        }
    }

    #[Test]
    public function with_thumbnails_off_it_is_made_public_without_one(): void
    {
        $file = $this->uploadSharedImage('local');
        $this->assertSame(200, $this->toggleHidden($file)->getStatusCode());

        $this->app()->getContainer()->make(\Flarum\Settings\SettingsRepositoryInterface::class)->set('fof-upload.generateThumbnails', '0');

        $response = $this->toggleHidden($file);

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());

        $public = File::byUuid($file->uuid)->firstOrFail();
        $this->assertFalse((bool) $public->hidden);
        $this->assertNull($public->thumbnail_path);
        $this->assertFileExists($this->publicPath($public->path));
    }
}
