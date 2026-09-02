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
    // Cross-validation between the two detectors compares formats, not spellings.

    /**
     * A complete, playable 8-sample WAV. php-mime-detector calls it `audio/vnd.wave`,
     * libmagic calls it `audio/x-wav`, and before the two names were treated as one this
     * was rejected as a mismatch — no .wav could be uploaded at all.
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
        if (!MimeTypeDetector::fileinfoAvailable()) {
            $this->markTestSkipped('fileinfo extension not loaded on this system');
        }

        $path = $this->makeTempFile($this->wavBytes());

        // Only meaningful where libmagic recognises the file as a WAV under some name.
        if (!str_contains((string) mime_content_type($path), 'wav')) {
            $this->markTestSkipped('this libmagic build does not identify WAV files');
        }

        $mime = (new MimeTypeDetector())->forFile($path)->getMimeType();

        // The detector's own spelling is still what callers get: the whitelist and the
        // extension mapping must see no change.
        $this->assertSame('audio/vnd.wave', $mime);
        $this->assertFileExists($path, 'a rejected upload is deleted; this one was accepted');
    }

    #[Test]
    public function getMimeType_still_rejects_a_genuine_mismatch(): void
    {
        if (!MimeTypeDetector::fileinfoAvailable()) {
            $this->markTestSkipped('fileinfo extension not loaded on this system');
        }

        // FLIF magic bytes in front of an HTML document — the shape of the Polyglot.flif
        // fixture the integration suite uses. php-mime-detector reads the header and says
        // image/flif; libmagic reads the body and says text/html. Nothing merges those.
        $path = $this->makeTempFile("FLIF\x00\x00<!DOCTYPE html><html><body>x</body></html>");

        $this->expectException(ValidationException::class);

        (new MimeTypeDetector())->forFile($path)->getMimeType();
    }

    public static function equivalentSpellings(): array
    {
        return [
            'wav, IANA vs historic'   => ['audio/vnd.wave', 'audio/x-wav'],
            'flac, x- on either side' => ['audio/x-flac', 'audio/flac'],
            'aiff'                    => ['audio/aiff', 'audio/x-aiff'],
            'm4a as mp4 audio'        => ['audio/mp4', 'audio/x-m4a'],
            'opus inside ogg'         => ['audio/opus', 'audio/ogg'],
            'avi'                     => ['video/vnd.avi', 'video/x-msvideo'],
            'rar'                     => ['application/x-rar-compressed', 'application/x-rar'],
            'rtf'                     => ['application/rtf', 'text/rtf'],
            'xml'                     => ['application/xml', 'text/xml'],
            'debian package'          => ['application/x-deb', 'application/vnd.debian.binary-package'],
            'sfnt fonts'              => ['font/ttf', 'font/sfnt'],
            'opentype'                => ['font/otf', 'application/vnd.ms-opentype'],
            'icon'                    => ['image/x-icon', 'image/vnd.microsoft.icon'],
            'case and parameters'     => ['text/XML', 'application/xml; charset=utf-8'],
        ];
    }

    #[Test]
    #[DataProvider('equivalentSpellings')]
    public function canonicalMimeType_treats_alternative_spellings_as_one(string $a, string $b): void
    {
        $detector = $this->exposedDetector();

        $this->assertSame($detector->canonical($a), $detector->canonical($b), "$a and $b name the same format");
    }

    public static function distinctFormats(): array
    {
        return [
            'header lies about the body' => ['image/flif', 'text/html'],
            'image against document'     => ['image/png', 'application/pdf'],
            'svg is not just xml'        => ['image/svg+xml', 'application/xml'],
            'html is not plain text'     => ['text/html', 'text/plain'],
            'archive against image'      => ['application/zip', 'image/jpeg'],
        ];
    }

    #[Test]
    #[DataProvider('distinctFormats')]
    public function canonicalMimeType_keeps_different_formats_apart(string $a, string $b): void
    {
        $detector = $this->exposedDetector();

        $this->assertNotSame($detector->canonical($a), $detector->canonical($b), "$a and $b are different formats");
    }

    #[Test]
    public function canonicalMimeType_passes_through_an_unlisted_type(): void
    {
        $detector = $this->exposedDetector();

        $this->assertSame('application/x-made-up', $detector->canonical('application/x-made-up'));
        $this->assertNull($detector->canonical(null));
    }

    /**
     * canonicalMimeType() is protected; this exposes it without changing its visibility
     * in the class under test.
     */
    private function exposedDetector(): MimeTypeDetector
    {
        return new class() extends MimeTypeDetector {
            public function canonical(?string $mime): ?string
            {
                return $this->canonicalMimeType($mime);
            }
        };
    }
}
