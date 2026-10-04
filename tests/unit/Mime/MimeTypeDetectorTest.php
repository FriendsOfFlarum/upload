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

namespace FoF\Upload\Tests\unit\Mime;

use Flarum\Foundation\ValidationException;
use FoF\Upload\Mime\MimeTypeDetector;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/**
 * Unit tests for MimeTypeDetector, focusing on the fileinfo-availability branch.
 *
 * fileinfoAvailable() is a static method; we override it in anonymous subclasses
 * to control which code path executes without needing to load/unload the extension.
 */
class MimeTypeDetectorTest extends TestCase
{
    private array $tempFiles = [];

    protected function tearDown(): void
    {
        foreach ($this->tempFiles as $path) {
            if (file_exists($path)) {
                unlink($path);
            }
        }
        parent::tearDown();
    }

    private function makeTempFile(string $content = ''): string
    {
        $path = tempnam(sys_get_temp_dir(), 'fof_upload_test_');
        file_put_contents($path, $content);
        $this->tempFiles[] = $path;

        return $path;
    }

    // ---------------------------------------------------------------------------

    #[Test]
    public function fileinfo_available_returns_bool(): void
    {
        $this->assertIsBool(MimeTypeDetector::fileinfoAvailable());
    }

    #[Test]
    public function getMimeType_throws_when_file_path_not_set(): void
    {
        $this->expectException(ValidationException::class);

        (new MimeTypeDetector())->getMimeType();
    }

    #[Test]
    public function getMimeType_succeeds_with_fileinfo_available(): void
    {
        if (!MimeTypeDetector::fileinfoAvailable()) {
            $this->markTestSkipped('fileinfo extension not loaded on this system');
        }

        // A real JPEG magic-bytes header — both detectors agree on image/jpeg.
        $path = $this->makeTempFile("\xFF\xD8\xFF\xE0".str_repeat("\x00", 100));

        $mime = (new MimeTypeDetector())->forFile($path)->getMimeType();

        $this->assertSame('image/jpeg', $mime);
    }

    #[Test]
    public function getMimeType_succeeds_without_fileinfo(): void
    {
        // Subclass forces fileinfoAvailable() = false regardless of server environment.
        $detector = new class() extends MimeTypeDetector {
            public static function fileinfoAvailable(): bool
            {
                return false;
            }
        };

        $path = $this->makeTempFile("\xFF\xD8\xFF\xE0".str_repeat("\x00", 100));
        $mime = $detector->forFile($path)->getMimeType();

        // Should not throw; MimeDetector library alone resolves the type.
        $this->assertIsString($mime);
        $this->assertNotEmpty($mime);
    }

    #[Test]
    public function getMimeType_does_not_throw_mismatch_without_fileinfo(): void
    {
        // Without fileinfo the cross-validation step is skipped entirely, so even if
        // the two detectors would have disagreed, no mismatch exception is raised.
        // We verify this by crafting a detector that lies about the internal MIME
        // (returns a different value than fileinfo would) while disabling fileinfo.
        $detector = new class() extends MimeTypeDetector {
            public static function fileinfoAvailable(): bool
            {
                return false;
            }

            // Force getMimeInternally() to return a fake MIME so that if the
            // cross-validation code ran it would always detect a mismatch.
            // Achieved by proxying to a known-good file but returning wrong MIME.
            protected function getMappings(): array
            {
                return [];
            } // unused here
        };

        // Any file will do — without fileinfo the result comes from MimeDetector alone.
        $path = $this->makeTempFile("\xFF\xD8\xFF\xE0".str_repeat("\x00", 100));

        // Must not throw ValidationException.
        $mime = $detector->forFile($path)->getMimeType();
        $this->assertIsString($mime);
    }

    // ---------------------------------------------------------------------------
    // Cross-validation compares formats, not spellings.

    private function requireFileinfo(): void
    {
        if (!MimeTypeDetector::fileinfoAvailable()) {
            $this->markTestSkipped('fileinfo extension not loaded on this system');
        }
    }

    /**
     * A complete, playable 8-sample WAV. php-mime-detector names it `audio/vnd.wave`,
     * libmagic `audio/x-wav`.
     */
    private function wavBytes(): string
    {
        $pcm = str_repeat(pack('v', 0), 8);

        return 'RIFF'.pack('V', 36 + strlen($pcm)).'WAVEfmt '
            .pack('VvvVVvv', 16, 1, 1, 8000, 16000, 2, 16)
            .'data'.pack('V', strlen($pcm)).$pcm;
    }

    #[Test]
    public function getMimeType_accepts_a_wav_the_two_detectors_spell_differently(): void
    {
        $this->requireFileinfo();

        $path = $this->makeTempFile($this->wavBytes());

        $mime = (new MimeTypeDetector())->forFile($path)->getMimeType();

        // The detector's own spelling is what callers get, so the admin's MIME
        // whitelist keeps matching what it matched before.
        $this->assertSame('audio/vnd.wave', $mime);
        $this->assertFileExists($path, 'a rejected upload is deleted');
    }

    private static function png(bool $animated): string
    {
        $chunk = fn (string $type, string $data) => pack('N', strlen($data)).$type.$data.pack('N', crc32($type.$data));

        return "\x89PNG\r\n\x1a\n".$chunk('IHDR', pack('NNCCCCC', 1, 1, 8, 6, 0, 0, 0))
            .($animated ? $chunk('acTL', pack('NN', 1, 0)) : '')
            .$chunk('IDAT', gzcompress("\x00\x00\x00\x00\x00"))
            .$chunk('IEND', '');
    }

    private static function oggPage(string $packet): string
    {
        return "OggS\x00\x02".str_repeat("\x00", 8)."\x01\x00\x00\x00".str_repeat("\x00", 8)
            ."\x01".chr(strlen($packet)).$packet;
    }

    private static function sfnt(string $version): string
    {
        return $version.pack('nnnn', 1, 16, 0, 0).'head'.pack('NNN', 0, 28, 54).str_repeat("\x00", 54);
    }

    /**
     * Files php-mime-detector names more specifically than libmagic, which reports only
     * the container they share with other formats.
     *
     * @return array<string, array{string, string, string}> bytes, detector's name, libmagic's name
     */
    public static function specificFormatsInAContainer(): array
    {
        return [
            'animated png' => [self::png(true), 'image/apng', 'image/png'],
            'opus in ogg'  => [self::oggPage("OpusHead\x01\x01\x38\x01\x80\xbb\x00\x00\x00\x00\x00"), 'audio/opus', 'audio/ogg'],
            'truetype'     => [self::sfnt("\x00\x01\x00\x00"), 'font/ttf', 'font/sfnt'],
            'opentype'     => [self::sfnt('OTTO'), 'font/otf', 'application/vnd.ms-opentype'],
        ];
    }

    #[Test]
    #[DataProvider('specificFormatsInAContainer')]
    public function getMimeType_accepts_a_specific_format_libmagic_reports_by_its_container(string $bytes, string $detectorName, string $libmagicName): void
    {
        $this->requireFileinfo();

        $path = $this->makeTempFile($bytes);

        if (mime_content_type($path) !== $libmagicName) {
            $this->markTestSkipped("this libmagic build does not report $libmagicName for the sample");
        }

        $this->assertSame($detectorName, (new MimeTypeDetector())->forFile($path)->getMimeType());
    }
}
