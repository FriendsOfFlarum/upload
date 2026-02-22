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

namespace FoF\Upload\Tests\unit\Repositories;

use Flarum\Foundation\Paths;
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Adapters\AwsS3;
use FoF\Upload\Adapters\Local;
use FoF\Upload\Adapters\Manager;
use FoF\Upload\File;
use FoF\Upload\Repositories\FileRepository;
use League\Flysystem\FilesystemAdapter;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/**
 * Unit tests for FileRepository::getThumbnailUrlForFile().
 *
 * getThumbnailUrlForFile() derives the thumbnail URL from thumbnail_path +
 * the live storage hostname at call time — same pattern as getUrlForFile() —
 * so that CDN domain changes are reflected automatically without any DB update.
 *
 * Because getHostnameForFile() calls into the Flarum UrlGenerator (Local) or
 * the adapter's hostName() method (AwsS3), and both are hard to fully wire in a
 * unit test, we use a partial mock of FileRepository to stub both
 * getHostnameForFile() and the adapter returned by Manager::instantiate().
 *
 * The supported-adapter check inside getThumbnailUrlForFile() uses get_class(),
 * not instanceof, so we instantiate real adapter objects (with mocked constructor
 * arguments) so the class name matches exactly.
 */
class FileRepositoryTest extends TestCase
{
    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------

    private function makeFile(string $uploadMethod, ?string $thumbnailPath = null): File
    {
        $file = new File();
        $file->upload_method = $uploadMethod;
        $file->thumbnail_path = $thumbnailPath;

        return $file;
    }

    /** Create a real Local adapter instance (constructor args mocked). */
    private function realLocalAdapter(): Local
    {
        return new Local(
            $this->createStub(FilesystemAdapter::class),
            $this->createStub(SettingsRepositoryInterface::class),
            $this->createStub(UrlGenerator::class)
        );
    }

    /** Create a real AwsS3 adapter instance (constructor args mocked). */
    private function realAwsS3Adapter(): AwsS3
    {
        return new AwsS3(
            $this->createStub(FilesystemAdapter::class),
            $this->createStub(SettingsRepositoryInterface::class),
            $this->createStub(UrlGenerator::class)
        );
    }

    /**
     * Build a partially-mocked FileRepository where:
     *  - Manager::instantiate() returns $adapter
     *  - getHostnameForFile() returns $hostname
     */
    private function makeRepo(object $adapter, ?string $hostname): FileRepository
    {
        $manager = $this->createMock(Manager::class);
        $manager->method('instantiate')->willReturn($adapter);

        $tmp = sys_get_temp_dir();
        $paths = new Paths(['base' => $tmp, 'public' => $tmp, 'storage' => $tmp]);

        $repo = $this->getMockBuilder(FileRepository::class)
            ->setConstructorArgs([
                $paths,
                $this->createStub(\FoF\Upload\Validators\UploadValidator::class),
                $this->createStub(SettingsRepositoryInterface::class),
                $this->createStub(\Illuminate\Events\Dispatcher::class),
                $this->createStub(\enshrined\svgSanitize\Sanitizer::class),
                $this->createStub(\Symfony\Contracts\Translation\TranslatorInterface::class),
                $manager,
                $this->createStub(UrlGenerator::class),
                $this->createStub(\FoF\Upload\Mime\MimeTypeDetector::class),
            ])
            ->onlyMethods(['getHostnameForFile'])
            ->getMock();

        $repo->method('getHostnameForFile')->willReturn($hostname);

        return $repo;
    }

    // ---------------------------------------------------------------------------
    // Tests
    // ---------------------------------------------------------------------------

    #[Test]
    public function returns_null_when_thumbnail_path_is_null(): void
    {
        $file = $this->makeFile('local', null);
        $repo = $this->makeRepo($this->realLocalAdapter(), 'https://example.com/assets/files');

        $this->assertNull($repo->getThumbnailUrlForFile($file));
    }

    #[Test]
    public function returns_null_when_thumbnail_path_is_empty_string(): void
    {
        $file = $this->makeFile('local', '');
        $repo = $this->makeRepo($this->realLocalAdapter(), 'https://example.com/assets/files');

        $this->assertNull($repo->getThumbnailUrlForFile($file));
    }

    #[Test]
    public function returns_null_for_unsupported_adapter(): void
    {
        // Imgur adapter is not Local or AwsS3, so getThumbnailUrlForFile() returns null.
        $file = $this->makeFile('imgur', '2026-02-22/1234-photo-thumb.webp');

        $imgurAdapter = $this->createStub(\FoF\Upload\Adapters\Imgur::class);
        $repo = $this->makeRepo($imgurAdapter, null);

        $this->assertNull($repo->getThumbnailUrlForFile($file));
    }

    #[Test]
    public function builds_url_from_local_hostname_and_thumbnail_path(): void
    {
        $thumbPath = '2026-02-22/1234-photo-thumb.webp';
        $file = $this->makeFile('local', $thumbPath);
        $repo = $this->makeRepo($this->realLocalAdapter(), 'https://example.com/assets/files');

        $url = $repo->getThumbnailUrlForFile($file);

        $this->assertSame('https://example.com/assets/files/'.$thumbPath, $url);
    }

    #[Test]
    public function builds_url_from_s3_hostname_and_thumbnail_path(): void
    {
        $thumbPath = '2026-02-22/1234-photo-thumb.webp';
        $file = $this->makeFile('aws-s3', $thumbPath);
        $repo = $this->makeRepo($this->realAwsS3Adapter(), 'https://my-bucket.s3.us-east-1.amazonaws.com');

        $url = $repo->getThumbnailUrlForFile($file);

        $this->assertSame('https://my-bucket.s3.us-east-1.amazonaws.com/'.$thumbPath, $url);
    }

    #[Test]
    public function reflects_updated_hostname(): void
    {
        // Simulate CDN domain change: same thumbnail_path, different hostname at render time.
        // getThumbnailUrlForFile() derives the URL from the live hostname each call —
        // so switching CDN domains does not require re-processing uploads.
        $thumbPath = '2026-02-22/1234-photo-thumb.webp';
        $file = $this->makeFile('aws-s3', $thumbPath);

        $repoOld = $this->makeRepo($this->realAwsS3Adapter(), 'https://old-cdn.example.com');
        $repoNew = $this->makeRepo($this->realAwsS3Adapter(), 'https://new-cdn.example.com');

        $this->assertSame('https://old-cdn.example.com/'.$thumbPath, $repoOld->getThumbnailUrlForFile($file));
        $this->assertSame('https://new-cdn.example.com/'.$thumbPath, $repoNew->getThumbnailUrlForFile($file));
    }
}
