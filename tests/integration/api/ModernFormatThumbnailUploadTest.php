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

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Upload\File;
use FoF\Upload\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

/**
 * WebP and AVIF uploads get a thumbnail and recorded dimensions through the
 * upload endpoint, not only when the processor is called directly (#549).
 */
class ModernFormatThumbnailUploadTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;
    use UploadFileTrait;

    private string $workDir;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');
        $this->prepareDatabase([User::class => [$this->normalUser()]]);
        $this->setting('fof-upload.generateThumbnails', '1');
        $this->setting('fof-upload.thumbnailMaxWidth', '100');

        $this->workDir = sys_get_temp_dir().'/fof-upload-modern-'.uniqid();
        mkdir($this->workDir);
    }

    protected function tearDown(): void
    {
        foreach (glob($this->workDir.'/*') ?: [] as $file) {
            @unlink($file);
        }
        @rmdir($this->workDir);

        parent::tearDown();
    }

    /**
     * @return array<string, array{string, string}>
     */
    public static function formats(): array
    {
        return [
            'webp' => ['webp', 'image/webp'],
            'avif' => ['avif', 'image/avif'],
        ];
    }

    #[Test]
    #[DataProvider('formats')]
    public function an_upload_gets_a_thumbnail_and_dimensions(string $format, string $mimeType): void
    {
        $support = ['webp' => 'WebP Support', 'avif' => 'AVIF Support'][$format];
        if (!(gd_info()[$support] ?? false)) {
            $this->markTestSkipped("GD has no $format support");
        }

        $image = imagecreatetruecolor(400, 200);
        $path = $this->workDir.'/photo.'.$format;
        $format === 'webp' ? imagewebp($image, $path) : imageavif($image, $path);
        imagedestroy($image);

        $this->addType('^'.preg_quote($mimeType, '/').'$', 'local', 'image-preview');

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 1,
                'multipart'       => [$this->uploadFile($path)],
            ])
        );

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());

        $file = File::byUuid(json_decode((string) $response->getBody(), true)['data'][0]['attributes']['uuid'])->firstOrFail();

        $this->assertSame($mimeType, $file->type);
        $this->assertNotEmpty($file->thumbnail_path);
        $this->assertSame(100, $file->thumbnail_width);
        $this->assertSame(50, $file->thumbnail_height);
        $this->assertSame(400, $file->image_width);
        $this->assertSame(200, $file->image_height);
    }
}
