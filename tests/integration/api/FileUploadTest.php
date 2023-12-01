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
use FoF\Upload\File;
use FoF\Upload\Tests\EnhancedTestCase;

class FileUploadTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

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

    protected function giveNormalUserUploadPermission()
    {
        $this->prepareDatabase(
            [
                'group_permission' => [
                    ['group_id' => 3, 'permission' => 'fof-upload.upload'],
                ],
            ]
        );
    }

    protected function addType(string $mime, string $adapter = 'local', string $template = 'just-url')
    {
        $this->setting('fof-upload.mimeTypes', json_encode([
            $mime => [
                'adapter' => $adapter,
                'template'  => $template,
            ],
        ]));
    }

    protected function setMaxUploadSize(int $max)
    {
        $this->setting('fof-upload.maxFileSize', $max);
    }

    protected function uploadFile(string $path)
    {
        if (!file_exists($path)) {
            throw new \InvalidArgumentException("File not found at path: $path");
        }

        return [
            'name'     => 'files',
            'contents' => $path,
            'filename' => basename($path),
        ];
    }

    protected function fixtures(string $file): string
    {
        return __DIR__.'/../../fixtures/'.$file;
    }

    /**
     * @test
     */
    public function user_with_permission_can_upload_a_file()
    {
        $this->giveNormalUserUploadPermission();

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('MilkyWay.jpg')),
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('data', $json);
        $this->assertCount(1, $json['data']);
        $this->assertArrayHasKey('attributes', $json['data'][0]);

        $this->assertEquals('milkyway.jpg', $json['data'][0]['attributes']['baseName']);
        $this->assertEquals('image/jpeg', $json['data'][0]['attributes']['type']);
        $this->assertEquals('image-preview', $json['data'][0]['attributes']['tag']);

        $file = File::where('uuid', $json['data'][0]['attributes']['uuid'])->first();

        $this->assertNotNull($file);

        $this->assertEquals('milkyway.jpg', $file->base_name);
        $this->assertEquals(2, $file->actor_id);
    }

    /**
     * @test
     */
    public function user_without_permission_cannot_upload_a_file()
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('MilkyWay.jpg')),
                ],
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function user_with_permission_cannot_upload_an_unconfigured_file_type()
    {
        $this->giveNormalUserUploadPermission();

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('Plain.txt')),
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('errors', $json);
        $this->assertEquals('validation_error', $json['errors'][0]['code']);
        $this->assertEquals('/data/attributes/upload', $json['errors'][0]['source']['pointer']);
    }

    /**
     * @test
     */
    public function user_with_permission_can_upload_a_configured_type()
    {
        $this->addType('text\/plain', 'local', 'text-preview');
        $this->giveNormalUserUploadPermission();

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('Plain.txt')),
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function user_with_permission_cannot_upload_a_file_that_is_too_large()
    {
        $this->setMaxUploadSize(10);
        $this->giveNormalUserUploadPermission();

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('MilkyWay.jpg')),
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('errors', $json);
        $this->assertEquals('validation_error', $json['errors'][0]['code']);
        $this->assertEquals('/data/attributes/max', $json['errors'][0]['source']['pointer']);
    }
}
