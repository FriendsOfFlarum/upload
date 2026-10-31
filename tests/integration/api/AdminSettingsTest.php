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

use Flarum\Settings\Event\Deserializing;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Illuminate\Contracts\Events\Dispatcher;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

class AdminSettingsTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');
    }

    public static function fallbacks(): array
    {
        return [
            'max file size'       => ['fof-upload.maxFileSize', 2048],
            'composer buttons'    => ['fof-upload.composerButtonVisiblity', 'both'],
            'resize width'        => ['fof-upload.resizeMaxWidth', 100],
            'watermark position'  => ['fof-upload.watermarkPosition', 'bottom-right'],
            'watermark size'      => ['fof-upload.watermarkSizePercent', 25],
            'watermark opacity'   => ['fof-upload.watermarkOpacity', 100],
            'watermark padding'   => ['fof-upload.watermarkPadding', 10],
            'thumbnail width'     => ['fof-upload.thumbnailMaxWidth', 1000],
            'thumbnail quality'   => ['fof-upload.thumbnailQuality', 80],
            'thumbnails'          => ['fof-upload.generateThumbnails', true],
            'resize'              => ['fof-upload.mustResize', false],
            'hotlink protection'  => ['fof-upload.disableHotlinkProtection', false],
            'cdn url'             => ['fof-upload.cdnUrl', ''],
            'kept extensions'     => ['fof-upload.whitelistedClientExtensions', ''],
        ];
    }

    #[Test]
    #[DataProvider('fallbacks')]
    public function a_setting_never_saved_reads_as_it_did_before(string $key, mixed $expected): void
    {
        $this->assertSame($expected, $this->app()->getContainer()->make(SettingsRepositoryInterface::class)->get($key));
    }

    #[Test]
    public function a_cleared_number_goes_back_to_its_default(): void
    {
        $this->setting('fof-upload.maxFileSize', '4096');

        $response = $this->send($this->request('POST', '/api/settings', [
            'authenticatedAs' => 1,
            'json'            => ['fof-upload.maxFileSize' => ''],
        ]));

        $this->assertSame(204, $response->getStatusCode());
        $this->assertNull($this->database()->table('settings')->where('key', 'fof-upload.maxFileSize')->value('value'));
        $this->assertSame(2048, $this->app()->getContainer()->make(SettingsRepositoryInterface::class)->get('fof-upload.maxFileSize'));
    }

    public static function brokenPatterns(): array
    {
        return [
            'unbalanced group'  => ['^image\/(png|jpeg$'],
            'unescaped slash'   => ['^image/png$'],
            'empty pattern'     => [''],
        ];
    }

    #[Test]
    #[DataProvider('brokenPatterns')]
    public function a_file_type_rule_that_cannot_match_anything_is_refused(string $pattern): void
    {
        $response = $this->send($this->request('POST', '/api/settings', [
            'authenticatedAs' => 1,
            'json'            => ['fof-upload.mimeTypes' => json_encode([
                '^application\/pdf$' => ['adapter' => 'local', 'template' => 'file'],
                $pattern             => ['adapter' => 'local', 'template' => 'file'],
            ])],
        ]));

        $this->assertSame(422, $response->getStatusCode());
        $this->assertNull($this->database()->table('settings')->where('key', 'fof-upload.mimeTypes')->value('value'));
    }

    #[Test]
    public function valid_file_type_rules_are_saved(): void
    {
        $rules = json_encode(['^image\/(jpeg|png)$' => ['adapter' => 'local', 'template' => 'image-preview']]);

        $response = $this->send($this->request('POST', '/api/settings', [
            'authenticatedAs' => 1,
            'json'            => ['fof-upload.mimeTypes' => $rules],
        ]));

        $this->assertSame(204, $response->getStatusCode());
        $this->assertSame($rules, $this->database()->table('settings')->where('key', 'fof-upload.mimeTypes')->value('value'));
    }

    #[Test]
    public function the_admin_page_is_shown_the_rule_uploads_fall_back_to(): void
    {
        $settings = $this->app()->getContainer()->make(SettingsRepositoryInterface::class)->all();

        $this->app()->getContainer()->make(Dispatcher::class)->dispatch(new Deserializing($settings));

        $this->assertSame(
            ['^image\/(jpeg|png|apng|gif|webp|avif|bmp|tiff|svg\+xml)$' => ['adapter' => 'local', 'template' => 'image-preview']],
            json_decode($settings['fof-upload.mimeTypes'], true)
        );
    }

    #[Test]
    public function saved_rules_reach_the_admin_page_unchanged(): void
    {
        $rules = json_encode(['^text\/plain$' => ['adapter' => 'local', 'template' => 'text-preview']]);
        $this->setting('fof-upload.mimeTypes', $rules);

        $settings = $this->app()->getContainer()->make(SettingsRepositoryInterface::class)->all();

        $this->app()->getContainer()->make(Dispatcher::class)->dispatch(new Deserializing($settings));

        $this->assertSame($rules, $settings['fof-upload.mimeTypes']);
    }
}
