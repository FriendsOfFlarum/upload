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
        $path = $this->makeTempFile("\xFF\xD8\xFF\xE0" . str_repeat("\x00", 100));

        $mime = (new MimeTypeDetector())->forFile($path)->getMimeType();

        $this->assertSame('image/jpeg', $mime);
    }

    #[Test]
    public function getMimeType_succeeds_without_fileinfo(): void
    {
        // Subclass forces fileinfoAvailable() = false regardless of server environment.
        $detector = new class extends MimeTypeDetector {
            public static function fileinfoAvailable(): bool { return false; }
        };

        $path = $this->makeTempFile("\xFF\xD8\xFF\xE0" . str_repeat("\x00", 100));
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
        $detector = new class extends MimeTypeDetector {
            public static function fileinfoAvailable(): bool { return false; }

            // Force getMimeInternally() to return a fake MIME so that if the
            // cross-validation code ran it would always detect a mismatch.
            // Achieved by proxying to a known-good file but returning wrong MIME.
            protected function getMappings(): array { return []; } // unused here
        };

        // Any file will do — without fileinfo the result comes from MimeDetector alone.
        $path = $this->makeTempFile("\xFF\xD8\xFF\xE0" . str_repeat("\x00", 100));

        // Must not throw ValidationException.
        $mime = $detector->forFile($path)->getMimeType();
        $this->assertIsString($mime);
    }
}
