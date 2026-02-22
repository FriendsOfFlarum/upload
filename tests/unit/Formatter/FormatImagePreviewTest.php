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

namespace FoF\Upload\Tests\unit\Formatter;

use FoF\Upload\File;
use FoF\Upload\Formatter\ImagePreview\FormatImagePreview;
use FoF\Upload\Repositories\FileRepository;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use s9e\TextFormatter\Renderer;

class FormatImagePreviewTest extends TestCase
{
    private function makeFile(string $uuid, string $baseName, string $url): File
    {
        $file = new File();
        $file->uuid = $uuid;
        $file->base_name = $baseName;
        $file->url = $url;

        return $file;
    }

    private function makeRepository(File $file): FileRepository
    {
        $repo = $this->createMock(FileRepository::class);
        $repo->method('findByUuid')->willReturn($file);
        $repo->method('findByUrl')->willReturn($file);
        $repo->method('getUrlForFile')->willReturn($file->url);
        // Return the thumbnail URL derived from thumbnail_path, or null when absent —
        // mirroring FileRepository::getThumbnailUrlForFile() which uses thumbnail_path.
        $repo->method('getThumbnailUrlForFile')->willReturnCallback(
            fn (File $f) => $f->thumbnail_path
                ? 'https://example.com/'.ltrim(str_replace('.jpg', '-thumb.webp', $f->thumbnail_path), '/')
                : null
        );

        return $repo;
    }

    private function makeRenderer(): Renderer
    {
        return $this->createStub(Renderer::class);
    }

    /** Build a minimal XML string as TextFormatter would produce for an image-preview tag. */
    private function makeXml(string $uuid, string $url, ?string $alt = null): string
    {
        $altAttr = $alt !== null ? ' alt="'.htmlspecialchars($alt, ENT_QUOTES).'"' : '';

        return '<r><UPL-IMAGE-PREVIEW uuid="'.$uuid.'" url="'.$url.'"'.$altAttr.'></UPL-IMAGE-PREVIEW></r>';
    }

    private function invoke(FormatImagePreview $formatter, string $xml): string
    {
        return ($formatter)($this->makeRenderer(), null, $xml);
    }

    // ---------------------------------------------------------------------------

    #[Test]
    public function sets_alt_to_base_name_when_alt_is_absent(): void
    {
        $file = $this->makeFile('abc', 'photo.jpg', 'https://example.com/photo.jpg');
        $formatter = new FormatImagePreview($this->makeRepository($file));

        $result = $this->invoke($formatter, $this->makeXml('abc', 'https://example.com/photo.jpg'));

        $this->assertStringContainsString('alt="photo.jpg"', $result);
    }

    #[Test]
    public function sets_alt_to_base_name_when_alt_is_empty(): void
    {
        $file = $this->makeFile('abc', 'photo.jpg', 'https://example.com/photo.jpg');
        $formatter = new FormatImagePreview($this->makeRepository($file));

        $result = $this->invoke($formatter, $this->makeXml('abc', 'https://example.com/photo.jpg', ''));

        $this->assertStringContainsString('alt="photo.jpg"', $result);
    }

    #[Test]
    public function sets_alt_to_base_name_when_legacy_placeholder_stored(): void
    {
        // Legacy posts (saved before the fix) have the literal string {TEXT?} stored as the alt value.
        $file = $this->makeFile('abc', 'photo.jpg', 'https://example.com/photo.jpg');
        $formatter = new FormatImagePreview($this->makeRepository($file));

        $result = $this->invoke($formatter, $this->makeXml('abc', 'https://example.com/photo.jpg', '{TEXT?}'));

        $this->assertStringContainsString('alt="photo.jpg"', $result);
        $this->assertStringNotContainsString('{TEXT?}', $result);
    }

    #[Test]
    public function preserves_user_supplied_alt_text(): void
    {
        $file = $this->makeFile('abc', 'photo.jpg', 'https://example.com/photo.jpg');
        $formatter = new FormatImagePreview($this->makeRepository($file));

        $result = $this->invoke($formatter, $this->makeXml('abc', 'https://example.com/photo.jpg', 'My cat on the windowsill'));

        $this->assertStringContainsString('alt="My cat on the windowsill"', $result);
        $this->assertStringNotContainsString('alt="photo.jpg"', $result);
    }

    #[Test]
    public function sets_title_to_base_name(): void
    {
        $file = $this->makeFile('abc', 'photo.jpg', 'https://example.com/photo.jpg');
        $formatter = new FormatImagePreview($this->makeRepository($file));

        $result = $this->invoke($formatter, $this->makeXml('abc', 'https://example.com/photo.jpg'));

        $this->assertStringContainsString('title="photo.jpg"', $result);
    }

    #[Test]
    public function updates_url_from_repository(): void
    {
        $file = $this->makeFile('abc', 'photo.jpg', 'https://cdn.example.com/photo.jpg');

        $repo = $this->createMock(FileRepository::class);
        $repo->method('findByUuid')->willReturn($file);
        $repo->method('getUrlForFile')->willReturn('https://cdn.example.com/photo.jpg');

        $formatter = new FormatImagePreview($repo);

        $result = $this->invoke($formatter, $this->makeXml('abc', 'https://origin.example.com/photo.jpg'));

        $this->assertStringContainsString('https://cdn.example.com/photo.jpg', $result);
    }

    #[Test]
    public function injects_width_and_height_when_file_has_dimensions(): void
    {
        $file = $this->makeFile('abc', 'photo.jpg', 'https://example.com/photo.jpg');
        $file->image_width = 1920;
        $file->image_height = 1080;
        $formatter = new FormatImagePreview($this->makeRepository($file));

        $result = $this->invoke($formatter, $this->makeXml('abc', 'https://example.com/photo.jpg'));

        $this->assertStringContainsString('width="1920"', $result);
        $this->assertStringContainsString('height="1080"', $result);
    }

    #[Test]
    public function does_not_inject_dimensions_when_file_has_none(): void
    {
        $file = $this->makeFile('abc', 'photo.jpg', 'https://example.com/photo.jpg');
        // image_width / image_height are not set (null)
        $formatter = new FormatImagePreview($this->makeRepository($file));

        $result = $this->invoke($formatter, $this->makeXml('abc', 'https://example.com/photo.jpg'));

        $this->assertStringNotContainsString('width="1', $result);
        $this->assertStringNotContainsString('height="1', $result);
    }

    #[Test]
    public function injects_thumbnail_url_derived_from_thumbnail_path(): void
    {
        $file = $this->makeFile('abc', 'photo.jpg', 'https://example.com/photo.jpg');
        // thumbnail_path is the persistent field; getThumbnailUrlForFile() derives the URL from it.
        $file->thumbnail_path = '2026-02-22/1234-photo-thumb.webp';
        $formatter = new FormatImagePreview($this->makeRepository($file));

        $result = $this->invoke($formatter, $this->makeXml('abc', 'https://example.com/photo.jpg'));

        $this->assertStringContainsString('thumbnail_url="', $result);
        $this->assertStringNotContainsString('thumbnail_url="https://example.com/photo.jpg"', $result);
    }

    #[Test]
    public function falls_back_to_main_url_as_thumbnail_url_when_no_thumbnail(): void
    {
        $file = $this->makeFile('abc', 'photo.jpg', 'https://example.com/photo.jpg');
        // thumbnail_path is null — getThumbnailUrlForFile() returns null → formatter falls back to url.
        $formatter = new FormatImagePreview($this->makeRepository($file));

        $result = $this->invoke($formatter, $this->makeXml('abc', 'https://example.com/photo.jpg'));

        // thumbnail_url should be set to the main URL as fallback
        $this->assertStringContainsString('thumbnail_url="https://example.com/photo.jpg"', $result);
    }
}
