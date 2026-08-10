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
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Thumbnail generation quality.
 *
 * Two things are pinned here:
 *
 *  1. The encode quality is configurable rather than hardcoded, and the value
 *     comes from settings with no fallback in this class — the default lives in
 *     extend.php's Settings extender and nowhere else.
 *  2. The thumbnail is scaled from the decoded source rather than from the
 *     already-encoded full-size file. Re-reading the encoded file put the
 *     thumbnail through two lossy passes (q90 then q80), which measurably
 *     softens detailed images.
 */
#[CoversClass(ImageProcessor::class)]
class ImageProcessorThumbnailTest extends TestCase
{
    private string $workDir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->workDir = sys_get_temp_dir().'/fof-upload-thumb-'.uniqid();
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
     * A large image with fine, high-frequency detail — the case where repeated
     * lossy encoding is most visible.
     */
    private function makeSourceImage(int $width = 1600, int $height = 1200): string
    {
        $im = imagecreatetruecolor($width, $height);

        for ($y = 0; $y < $height; $y++) {
            for ($x = 0; $x < $width; $x++) {
                $r = (int) (127 + 120 * sin($x / 7.0) * cos($y / 11.0));
                $g = (int) (127 + 120 * sin(($x + $y) / 9.0));
                $b = (int) (127 + 120 * cos($x / 13.0));
                imagesetpixel($im, $x, $y, imagecolorallocate(
                    $im,
                    max(0, min(255, $r)),
                    max(0, min(255, $g)),
                    max(0, min(255, $b))
                ));
            }
        }

        $path = $this->workDir.'/source.jpg';
        imagejpeg($im, $path, 100);
        imagedestroy($im);

        return $path;
    }

    /**
     * @param array<string, mixed> $settings
     */
    private function makeProcessor(array $settings): ImageProcessor
    {
        $repo = $this->createStub(SettingsRepositoryInterface::class);
        $repo->method('get')->willReturnCallback(
            function (string $key, $default = null) use ($settings) {
                return array_key_exists($key, $settings) ? $settings[$key] : $default;
            }
        );

        $factory = $this->createStub(Factory::class);
        $factory->method('disk')->willReturn($this->createStub(Filesystem::class));

        return new ImageProcessor($repo, ImageManager::gd(), $factory);
    }

    private function process(array $settings, string $sourcePath): File
    {
        // The processor writes the encoded full-size image back over the upload,
        // so work on a copy to keep the pristine source for comparison.
        $uploadPath = $this->workDir.'/upload.jpg';
        copy($sourcePath, $uploadPath);

        $file = new File();
        $upload = new UploadedFile($uploadPath, 'source.jpg', 'image/jpeg', null, true);

        $this->makeProcessor($settings)->process($file, $upload, 'image/jpeg');

        return $file;
    }

    /** Mean squared error between two encoded images, sampled every other pixel. */
    private function meanSquaredError(string $aBytes, string $bBytes): float
    {
        $a = imagecreatefromstring($aBytes);
        $b = imagecreatefromstring($bBytes);

        $width = min(imagesx($a), imagesx($b));
        $height = min(imagesy($a), imagesy($b));

        $sum = 0.0;
        $count = 0;

        for ($y = 0; $y < $height; $y += 2) {
            for ($x = 0; $x < $width; $x += 2) {
                $ca = imagecolorat($a, $x, $y);
                $cb = imagecolorat($b, $x, $y);

                $dr = (($ca >> 16) & 255) - (($cb >> 16) & 255);
                $dg = (($ca >> 8) & 255) - (($cb >> 8) & 255);
                $db = ($ca & 255) - ($cb & 255);

                $sum += $dr * $dr + $dg * $dg + $db * $db;
                $count += 3;
            }
        }

        imagedestroy($a);
        imagedestroy($b);

        return $count > 0 ? $sum / $count : 0.0;
    }

    // -----------------------------------------------------------------------
    // Configurable quality
    // -----------------------------------------------------------------------

    #[Test]
    public function thumbnail_quality_is_read_from_settings(): void
    {
        $source = $this->makeSourceImage();

        $low = $this->process([
            'fof-upload.generateThumbnails' => true,
            'fof-upload.thumbnailWebp'      => true,
            'fof-upload.thumbnailMaxWidth'  => 800,
            'fof-upload.thumbnailQuality'   => 30,
        ], $source);

        $high = $this->process([
            'fof-upload.generateThumbnails' => true,
            'fof-upload.thumbnailWebp'      => true,
            'fof-upload.thumbnailMaxWidth'  => 800,
            'fof-upload.thumbnailQuality'   => 95,
        ], $source);

        $this->assertNotNull($low->thumbnailContent);
        $this->assertNotNull($high->thumbnailContent);

        $this->assertLessThan(
            strlen($high->thumbnailContent),
            strlen($low->thumbnailContent),
            'A lower configured quality must produce a smaller thumbnail'
        );
    }

    #[Test]
    public function thumbnail_quality_applies_to_jpeg_when_webp_is_disabled(): void
    {
        $source = $this->makeSourceImage();

        $low = $this->process([
            'fof-upload.generateThumbnails' => true,
            'fof-upload.thumbnailWebp'      => false,
            'fof-upload.thumbnailMaxWidth'  => 800,
            'fof-upload.thumbnailQuality'   => 30,
        ], $source);

        $high = $this->process([
            'fof-upload.generateThumbnails' => true,
            'fof-upload.thumbnailWebp'      => false,
            'fof-upload.thumbnailMaxWidth'  => 800,
            'fof-upload.thumbnailQuality'   => 95,
        ], $source);

        $this->assertSame('jpg', $low->thumbnailExtension);
        $this->assertLessThan(
            strlen($high->thumbnailContent),
            strlen($low->thumbnailContent),
            'The configured quality must apply to the JPEG path too'
        );
    }

    /**
     * The default belongs in extend.php's Settings extender and nowhere else.
     * This class must not silently substitute its own value when the setting is
     * absent, because that would let the two drift apart unnoticed.
     */
    #[Test]
    public function thumbnail_quality_has_no_fallback_default_in_the_processor(): void
    {
        $source = $this->makeSourceImage();

        $processorSource = file_get_contents(__DIR__.'/../../../src/Processors/ImageProcessor.php');

        $this->assertMatchesRegularExpression(
            "/get\('fof-upload\.thumbnailQuality'\)/",
            $processorSource,
            'thumbnailQuality must be read without a fallback default argument'
        );

        // And the value must actually be used, not just fetched.
        $file = $this->process([
            'fof-upload.generateThumbnails' => true,
            'fof-upload.thumbnailWebp'      => true,
            'fof-upload.thumbnailMaxWidth'  => 800,
            'fof-upload.thumbnailQuality'   => 40,
        ], $source);

        $this->assertNotNull($file->thumbnailContent);
    }

    // -----------------------------------------------------------------------
    // No double encode
    // -----------------------------------------------------------------------

    /**
     * The thumbnail must be closer to a single-pass encode of the original than
     * to one taken from the already-encoded full-size image.
     *
     * Generating from the encoded file stacks q90 then q80 on the same pixels;
     * on detailed images that measurably softens the result.
     */
    #[Test]
    public function thumbnail_is_not_generated_from_the_re_encoded_full_image(): void
    {
        $source = $this->makeSourceImage();

        $settings = [
            'fof-upload.generateThumbnails' => true,
            'fof-upload.thumbnailWebp'      => true,
            'fof-upload.thumbnailMaxWidth'  => 800,
            'fof-upload.thumbnailQuality'   => 80,
        ];

        $file = $this->process($settings, $source);
        $this->assertNotNull($file->thumbnailContent);

        $manager = ImageManager::gd();

        // Reference A: one lossy pass, straight from the decoded original.
        $single = $manager->read($source);
        $single->scaleDown(width: 800);
        $singleBytes = $single->toWebp(quality: 80)->toString();

        // Reference B: the old behaviour — encode the full image first, re-read
        // it, then scale and encode again.
        $fullEncoded = $manager->read($source)->toJpeg(quality: 90)->toString();
        $double = $manager->read($fullEncoded);
        $double->scaleDown(width: 800);
        $doubleBytes = $double->toWebp(quality: 80)->toString();

        $toSingle = $this->meanSquaredError($file->thumbnailContent, $singleBytes);
        $toDouble = $this->meanSquaredError($file->thumbnailContent, $doubleBytes);

        $this->assertLessThan(
            $toDouble,
            $toSingle,
            sprintf(
                'Thumbnail should match a single-pass encode (MSE %.3f) more closely '
                .'than a double-encoded one (MSE %.3f) — it appears to be generated '
                .'from the re-encoded full-size image',
                $toSingle,
                $toDouble
            )
        );
    }

    /**
     * The full-size image still gets its own encode, watermark and resize —
     * fixing the thumbnail path must not disturb that.
     */
    #[Test]
    public function full_size_image_is_still_written_back_to_the_upload(): void
    {
        $source = $this->makeSourceImage(900, 600);

        $uploadPath = $this->workDir.'/upload.jpg';
        copy($source, $uploadPath);

        $before = file_get_contents($uploadPath);

        $file = new File();
        $upload = new UploadedFile($uploadPath, 'source.jpg', 'image/jpeg', null, true);

        $this->makeProcessor([
            'fof-upload.generateThumbnails' => true,
            'fof-upload.thumbnailWebp'      => true,
            'fof-upload.thumbnailMaxWidth'  => 400,
            'fof-upload.thumbnailQuality'   => 80,
        ])->process($file, $upload, 'image/jpeg');

        $after = file_get_contents($uploadPath);

        $this->assertNotSame($before, $after, 'The processed full-size image must be written back');
        $this->assertSame(900, $file->image_width);
        $this->assertSame(600, $file->image_height);
    }

    #[Test]
    public function thumbnail_dimensions_are_recorded(): void
    {
        $file = $this->process([
            'fof-upload.generateThumbnails' => true,
            'fof-upload.thumbnailWebp'      => true,
            'fof-upload.thumbnailMaxWidth'  => 400,
            'fof-upload.thumbnailQuality'   => 80,
        ], $this->makeSourceImage(1600, 1200));

        $this->assertSame(400, $file->thumbnail_width);
        $this->assertSame(300, $file->thumbnail_height);
        $this->assertSame('webp', $file->thumbnailExtension);
    }

    #[Test]
    public function no_thumbnail_is_generated_when_disabled(): void
    {
        $file = $this->process([
            'fof-upload.generateThumbnails' => false,
            'fof-upload.thumbnailQuality'   => 80,
        ], $this->makeSourceImage(600, 400));

        $this->assertNull($file->thumbnailContent);
    }
}
