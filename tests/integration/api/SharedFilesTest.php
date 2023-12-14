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

class SharedFilesTest extends EnhancedTestCase
{
    use UploadFileTrait;
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'moderator', 'email' => 'moderator@machine.local', 'is_email_confirmed' => true],
            ],
            'group_user' => [
                ['user_id' => 3, 'group_id' => 4],
            ],
            'group_permission' => [
                ['permission' => 'fof-upload.upload-shared-files', 'group_id' => 4],
            ],
        ]);
    }

    /**
     * @test
     */
    public function list_shared_files()
    {
        $response = $this->send(
            $this->request('GET', '/api/fof/upload/shared-files')
        );

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function userIdWithPermissionsProvider()
    {
        return [
            [1],
            [3],
        ];
    }

    /**
     * @dataProvider userIdWithPermissionsProvider
     *
     * @test
     */
    public function user_with_permission_can_upload_a_shared_file_and_is_not_hidden_by_default(int $userId)
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => $userId,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('MilkyWay.jpg')),
                ],
                'json' => [
                    'options' => [
                        'shared' => true,
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertCount(1, $json['data']);

        $fileInfo = $json['data'][0];
        $this->assertArrayHasKey('attributes', $fileInfo);

        $this->assertEquals('milkyway.jpg', $fileInfo['attributes']['baseName']);
        $this->assertEquals('image/jpeg', $fileInfo['attributes']['type']);
        $this->assertEquals('image-preview', $fileInfo['attributes']['tag']);
        $this->assertTrue($fileInfo['attributes']['shared'], 'File should be marked as shared');
        $this->assertFalse($fileInfo['attributes']['hidden']);

        $file = File::byUuid($json['data'][0]['attributes']['uuid'])->first();

        $this->assertNotNull($file);

        $this->assertEquals('milkyway.jpg', $file->base_name);
        $this->assertNull($file->actor_id, 'Actor should be null for shared files');
        $this->assertEquals('local', $file->upload_method);
        $this->assertTrue($file->shared);
        $this->assertFalse($file->hidden);
    }

    /**
     * @dataProvider userIdWithPermissionsProvider
     *
     * @test
     */
    public function user_with_permission_can_upload_a_shared_file_and_is_hidden_if_requested(int $userId)
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => $userId,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('MilkyWay.jpg')),
                ],
                'json' => [
                    'options' => [
                        'shared' => true,
                        'hidden' => true,
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertCount(1, $json['data']);

        $fileInfo = $json['data'][0];
        $this->assertArrayHasKey('attributes', $fileInfo);

        $this->assertEquals('milkyway.jpg', $fileInfo['attributes']['baseName']);
        $this->assertEquals('image/jpeg', $fileInfo['attributes']['type']);
        $this->assertEquals('image-preview', $fileInfo['attributes']['tag']);
        $this->assertTrue($fileInfo['attributes']['shared'], 'File should be marked as shared');
        $this->assertTrue($fileInfo['attributes']['hidden']);

        $file = File::byUuid($json['data'][0]['attributes']['uuid'])->first();

        $this->assertNotNull($file);

        $this->assertEquals('milkyway.jpg', $file->base_name);
        $this->assertNull($file->actor_id, 'Actor should be null for shared files');
        $this->assertEquals('private-shared', $file->upload_method);
        $this->assertTrue($file->shared);
        $this->assertTrue($file->hidden);
    }

    /**
     * @test
     */
    public function shared_hidden_files_are_proxied_via_our_controller()
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 1,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('MilkyWay.jpg')),
                ],
                'json' => [
                    'options' => [
                        'shared' => true,
                        'hidden' => true,
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $downloadUrl = $json['data'][0]['attributes']['url'];

        $this->assertStringContainsString('/api/fof/download/', $downloadUrl);

        $file = File::byUuid($json['data'][0]['attributes']['uuid'])->first();

        $this->assertNotNull($file);

        $response = $this->send(
            $this->request('GET', '/api/fof/download/'.$file->uuid, [
                'authenticatedAs' => 1,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());
    }

    /**
     * @dataProvider userIdWithPermissionsProvider
     *
     * @test
     */
    public function users_with_permission_can_upload_a_shared_file_and_then_delete_it(int $userId)
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => $userId,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('MilkyWay.jpg')),
                ],
                'json' => [
                    'options' => [
                        'shared' => true,
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $file = File::byUuid($json['data'][0]['attributes']['uuid'])->first();

        $this->assertNotNull($file);

        $response = $this->send(
            $this->request('DELETE', '/api/fof/upload/delete/'.$file->uuid, [
                'authenticatedAs' => $userId,
            ])
        );

        $this->assertEquals(204, $response->getStatusCode());

        $file = File::byUuid($json['data'][0]['attributes']['uuid'])->first();

        $this->assertNull($file);
    }
}
