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

namespace FoF\Upload\Tests\integration\console;

use Flarum\Foundation\Paths;
use Flarum\Testing\integration\ConsoleTestCase;
use FoF\Upload\File;
use FoF\Upload\Tests\integration\api\FakeS3Storage;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

/**
 * Shared images hidden before thumbnails were removed on hide kept their
 * thumbnail on the public disk. The command removes those leftovers.
 *
 * Hiding overwrote upload_method with "private-shared", so where the thumbnail
 * lives is inferred from the file's type: the command checks the object is
 * there before deleting, and reports what it can't find rather than guessing.
 */
class PurgePrivateThumbnailsCommandTest extends ConsoleTestCase
{
    use FakeS3Storage;

    private const THUMB = 'leak/1700000000-000000-secret-thumb.png';

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');
        $this->useFakeS3();

        $row = fn (int $id, string $uuid, bool $hidden, ?string $thumb) => [
            'id'              => $id, 'base_name' => "$uuid.png", 'uuid' => $uuid, 'path' => "leak/$uuid.png",
            'url'             => "http://localhost/api/fof/download/$uuid", 'type' => 'image/png', 'size' => 1,
            'upload_method'   => $hidden ? 'private-shared' : 'local', 'actor_id' => null, 'shared' => true, 'hidden' => $hidden,
            'thumbnail_path'  => $thumb, 'thumbnail_url' => $thumb ? "http://localhost/assets/files/$thumb" : null,
            'thumbnail_width' => $thumb ? 100 : null, 'thumbnail_height' => $thumb ? 75 : null,
            'created_at'      => '2024-01-01 00:00:00',
        ];

        $this->prepareDatabase([
            'fof_upload_files' => [
                $row(1, 'secret', true, self::THUMB),
                // Untouched: a public shared image keeps its thumbnail.
                $row(2, 'public', false, 'leak/1700000000-000000-public-thumb.png'),
                // Untouched: already private without a thumbnail.
                $row(3, 'clean', true, null),
            ],
        ]);
    }

    /**
     * The public disk isn't rolled back between tests, so a leak seeded by one
     * test would still be found by the next.
     */
    protected function tearDown(): void
    {
        foreach ([self::THUMB, 'leak/1700000000-000000-public-thumb.png'] as $path) {
            @unlink($this->publicPath($path));
        }

        parent::tearDown();
    }

    private function mapPngTo(string $adapter): void
    {
        $this->setting('fof-upload.mimeTypes', json_encode([
            '^image\\/png$' => ['adapter' => $adapter, 'template' => 'image-preview'],
        ]));
    }

    private function publicPath(string $path): string
    {
        return $this->app()->getContainer()->make(Paths::class)->public.'/assets/files/'.$path;
    }

    private function leak(string $adapter): void
    {
        if ($adapter === 'aws-s3') {
            $this->s3Objects[self::THUMB] = 'thumbnail';
            $this->s3Objects['leak/1700000000-000000-public-thumb.png'] = 'thumbnail';

            return;
        }

        $this->leakLocally();
    }

    private function leakLocally(): void
    {
        foreach ([self::THUMB, 'leak/1700000000-000000-public-thumb.png'] as $path) {
            @mkdir(dirname($this->publicPath($path)), 0777, true);
            file_put_contents($this->publicPath($path), 'thumbnail');
        }
    }

    private function purge(bool $dryRun = false): string
    {
        return $this->runCommand(['command' => 'fof:upload:purge-private-thumbnails'] + ($dryRun ? ['--dry-run' => true] : []));
    }

    private function assertOthersUntouched(): void
    {
        $this->assertSame('leak/1700000000-000000-public-thumb.png', File::find(2)->thumbnail_path);
        $this->assertNull(File::find(3)->thumbnail_path);
    }

    public static function disks(): array
    {
        return ['local disk' => ['local'], 'S3' => ['aws-s3']];
    }

    #[Test]
    #[DataProvider('disks')]
    public function it_deletes_a_private_files_leftover_public_thumbnail(string $adapter): void
    {
        $this->mapPngTo($adapter);
        $this->app();
        $this->leak($adapter);

        $output = $this->purge();

        $this->assertStringContainsString('secret.png', $output);

        if ($adapter === 'local') {
            $this->assertFileDoesNotExist($this->publicPath(self::THUMB));
            $this->assertFileExists($this->publicPath('leak/1700000000-000000-public-thumb.png'));
        } else {
            $this->assertSame([self::THUMB], $this->s3Keys('DeleteObject'));
        }

        $file = File::find(1);
        $this->assertNull($file->thumbnail_path);
        $this->assertNull($file->thumbnail_url);
        $this->assertNull($file->thumbnail_width);
        $this->assertNull($file->thumbnail_height);
        $this->assertOthersUntouched();
    }

    #[Test]
    #[DataProvider('disks')]
    public function a_dry_run_changes_nothing(string $adapter): void
    {
        $this->mapPngTo($adapter);
        $this->app();
        $this->leak($adapter);

        $output = $this->purge(dryRun: true);

        $this->assertStringContainsString('secret.png', $output);
        $this->assertSame(self::THUMB, File::find(1)->thumbnail_path);
        $this->assertSame([], $this->s3Keys('DeleteObject'));

        if ($adapter === 'local') {
            $this->assertFileExists($this->publicPath(self::THUMB));
        }
    }

    #[Test]
    #[DataProvider('disks')]
    public function a_thumbnail_that_is_not_where_its_type_maps_is_reported_and_kept(string $adapter): void
    {
        $this->mapPngTo($adapter);
        $this->app();

        $output = $this->purge();

        $this->assertStringContainsString('secret.png', $output);
        $this->assertStringContainsString('not found', $output);
        $this->assertSame(self::THUMB, File::find(1)->thumbnail_path, 'Left for the admin to look into');
        $this->assertSame([], $this->s3Keys('DeleteObject'));
    }

    #[Test]
    public function a_failed_delete_is_reported_and_the_row_kept(): void
    {
        $this->mapPngTo('aws-s3');
        $this->s3Fails = fn (string $command, ?string $key) => $command === 'DeleteObject';
        $this->app();
        $this->leak('aws-s3');

        $output = $this->purge();

        $this->assertStringContainsString('secret.png', $output);
        $this->assertStringContainsString('could not', strtolower($output));
        $this->assertSame(self::THUMB, File::find(1)->thumbnail_path);
    }
}
