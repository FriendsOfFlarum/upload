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

use Flarum\Foundation\Paths;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use FoF\Upload\Tests\EnhancedTestCase;

class FileUploadSecurityTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;
    use UploadFileTrait;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
            ],
        ]);
    }

    /**
     * @test
     *
     * We allow SVG due to the built in santization. Here we test that <script> tags any any external content is removed.
     */
    public function user_with_permission_can_upload_svg_containing_malicious_content_and_is_sanitized()
    {
        $this->giveNormalUserUploadPermission();

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('Malicious.svg')),
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $pathToFile = $json['data'][0]['attributes']['path'];
        $this->assertNotEmpty($pathToFile);

        $file_contents = file_get_contents(resolve(Paths::class)->public.'/assets/files/'.$pathToFile);

        $this->assertNotEmpty($file_contents);

        // Check that JavaScript is removed
        $this->assertStringNotContainsString('<script', $file_contents, 'SVG still contains a <script> tag.');
        $this->assertStringNotContainsString('javascript:', $file_contents, 'SVG still contains JavaScript URLs.');
        $this->assertStringNotContainsString('onload=', $file_contents, 'SVG still contains an onload event.');
        $this->assertStringNotContainsString('onclick=', $file_contents, 'SVG still contains an onclick event.');

        // Check that external resources are removed
        $this->assertStringNotContainsString('xlink:href="http', $file_contents, 'SVG still contains an external xlink:href.');
        $this->assertStringNotContainsString('href="http', $file_contents, 'SVG still contains an external href.');

        // Check that data URIs are removed
        $this->assertStringNotContainsString('data:image', $file_contents, 'SVG still contains a data URI.');

        // Check that <foreignObject> is removed
        $this->assertStringNotContainsString('<foreignObject', $file_contents, 'SVG still contains a <foreignObject>.');

        // Check that inline CSS doesn't contain @import
        $this->assertStringNotContainsString('@import', $file_contents, 'SVG still contains @import in a <style> block.');
    }

    /**
     * @test
     */
    public function user_with_permission_can_upload_an_svg_if_safe()
    {
        $this->giveNormalUserUploadPermission();

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('Safe.svg')),
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function MaliciousFiles(): array
    {
        return [
            ['Polyglot.jpg'],
            ['Polyglot.flif'],
            ['SpoofedMime.png'],
            ['TextFileWithPngExtension.png'],
            ['Malicious.html'],
        ];
    }

    /**
     * @test
     *
     * @dataProvider MaliciousFiles
     */
    public function user_with_permission_cannot_upload_malicious_files(string $fixture, ?string $allowMime = null)
    {
        $this->giveNormalUserUploadPermission();

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures($fixture)),
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $this->assertArrayHasKey('errors', $json);
        $this->assertEquals('validation_error', $json['errors'][0]['code']);
    }
}
