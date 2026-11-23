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

namespace FoF\Upload\Tests\unit\Processors;

use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\File;
use FoF\Upload\Processors\ImageProcessor;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Contracts\Filesystem\Filesystem;
use Intervention\Image\ImageManager;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;
use RuntimeException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[CoversClass(ImageProcessor::class)]
class ImageProcessorWatermarkTest extends TestCase
{
    private const WATERMARK_PATH = 'fof-upload-watermark-abcdefgh-logo.png';

    private string $workDir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->workDir = sys_get_temp_dir().'/fof-upload-watermark-'.uniqid();
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

    private function png(int $width, int $height, int $red, int $green, int $blue): string
    {
        $im = imagecreatetruecolor($width, $height);
        imagefill($im, 0, 0, imagecolorallocate($im, $red, $green, $blue));

        ob_start();
        imagepng($im);
        imagedestroy($im);

        return ob_get_clean();
    }

    /**
     * Mimics a remote disk such as S3: get() returns the contents, while path()
     * returns the object key, which is not a file on the local filesystem.
     */
    private function disk(?string $contents = null, ?\Throwable $getThrows = null): Filesystem
    {
        $disk = $this->createStub(Filesystem::class);
        $disk->method('exists')->willReturn(true);
        $disk->method('path')->willReturnArgument(0);

        if ($getThrows) {
            $disk->method('get')->willThrowException($getThrows);
        } else {
            $disk->method('get')->willReturn($contents);
        }

        return $disk;
    }

    private function processWhitePng(Filesystem $disk, ?LoggerInterface $logger = null, int $size = 200): string
    {
        $settings = $this->createStub(SettingsRepositoryInterface::class);
        $settings->method('get')->willReturnCallback(fn (string $key, $default = null) => [
            'fof-upload.addsWatermarks'       => true,
            'fof-watermark_path'              => self::WATERMARK_PATH,
            'fof-upload.watermarkPosition'    => 'bottom-right',
            'fof-upload.watermarkOpacity'     => 100,
            'fof-upload.watermarkSizePercent' => 25,
            'fof-upload.watermarkPadding'     => 0,
        ][$key] ?? $default);

        $factory = $this->createStub(Factory::class);
        $factory->method('disk')->willReturn($disk);

        $uploadPath = $this->workDir.'/upload.png';
        file_put_contents($uploadPath, $this->png($size, $size, 255, 255, 255));

        $processor = new ImageProcessor($settings, ImageManager::gd(), $factory, $logger ?? new NullLogger());
        $processor->process(new File(), new UploadedFile($uploadPath, 'upload.png', 'image/png', null, true), 'image/png');

        return file_get_contents($uploadPath);
    }

    /** RGB of the bottom-right pixel, where the watermark is placed. */
    private function cornerColor(string $png): array
    {
        $im = imagecreatefromstring($png);
        $rgb = imagecolorat($im, imagesx($im) - 1, imagesy($im) - 1);
        imagedestroy($im);

        return [($rgb >> 16) & 255, ($rgb >> 8) & 255, $rgb & 255];
    }

    #[Test]
    public function watermark_is_read_through_the_disk_so_remote_disks_work(): void
    {
        $result = $this->processWhitePng($this->disk($this->png(40, 40, 255, 0, 0)));

        $this->assertSame([255, 0, 0], $this->cornerColor($result));
    }

    #[Test]
    public function an_image_too_small_for_the_size_percentage_still_gets_a_watermark_of_at_least_one_pixel(): void
    {
        // 25% of 1px rounds to 0.
        $result = $this->processWhitePng($this->disk($this->png(40, 40, 255, 0, 0)), size: 1);

        $this->assertSame([255, 0, 0], $this->cornerColor($result));
    }

    #[Test]
    public function an_undecodable_watermark_is_skipped_and_logged_instead_of_failing_the_upload(): void
    {
        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects($this->once())->method('warning');

        $result = $this->processWhitePng($this->disk('not an image'), $logger);

        $this->assertSame([255, 255, 255], $this->cornerColor($result));
    }

    #[Test]
    public function an_unreadable_watermark_is_skipped_and_logged_instead_of_failing_the_upload(): void
    {
        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects($this->once())->method('warning');

        $result = $this->processWhitePng($this->disk(getThrows: new RuntimeException('Unable to read file')), $logger);

        $this->assertSame([255, 255, 255], $this->cornerColor($result));
    }

    /** Laravel's get() returns null instead of throwing when the file is missing or unreadable. */
    #[Test]
    public function a_watermark_the_disk_returns_no_contents_for_is_skipped_and_logged(): void
    {
        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects($this->once())->method('warning');

        $result = $this->processWhitePng($this->disk(null), $logger);

        $this->assertSame([255, 255, 255], $this->cornerColor($result));
    }

    #[Test]
    public function watermark_contents_are_not_interpreted_as_a_local_file_path(): void
    {
        $localImage = $this->workDir.'/local.png';
        file_put_contents($localImage, $this->png(40, 40, 255, 0, 0));

        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects($this->once())->method('warning');

        $result = $this->processWhitePng($this->disk($localImage), $logger);

        $this->assertSame([255, 255, 255], $this->cornerColor($result));
    }
}
