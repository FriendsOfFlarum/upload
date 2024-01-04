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

use Flarum\Extend;
use Flarum\Foundation\Paths;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use FoF\Upload\File;
use FoF\Upload\Tests\EnhancedTestCase;

class HideFilesTest extends EnhancedTestCase
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
                ['id' => 3, 'username' => 'normal2', 'email' => 'normal2@machine.local'],
                ['id' => 4, 'username' => 'moderator', 'email' => 'moderator@machine.local'],
            ],
            'fof_upload_files' => [
                ['id' => 1, 'base_name' => 'test_file.abc', 'uuid' => 'abc-123', 'path' => 'path/test_file.abc', 'url' => 'http://localhost/test_file.abc', 'type' => 'test/file', 'size' => 123, 'upload_method' => 'local', 'actor_id' => 2, 'shared' => false],
                ['id' => 2, 'base_name' => 'test_file2.abc', 'uuid' => 'def-456', 'path' => 'path/test_file2.abc', 'url' => 'http://localhost/test_file2.abc', 'type' => 'test/file', 'size' => 123, 'upload_method' => 'local', 'shared' => true],
            ],
            'group_user' => [
                ['user_id' => 4, 'group_id' => 4],
            ],
            'group_permission' => [
                ['group_id' => 4, 'permission' => 'fof-upload.deleteUserUploads'],
                ['group_id' => 4, 'permission' => 'fof-upload.viewUserUploads'],
            ],
        ]);
    }

    public function uploadSharedFileAndGetUuid(): string
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
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        return $json['data'][0]['attributes']['uuid'];
    }

    /**
     * @test
     */
    public function guest_cannot_set_file_as_hidden()
    {
        $this->extend(
            (new Extend\Csrf())
                ->exemptRoute('fof-upload.hide')
        );

        $uuid = 'abc-123';

        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/fof/upload/hide',
                [
                    'json' => [
                        'uuid' => $uuid,
                    ],
                ]
            )
        );

        $this->assertEquals(401, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function user_cannot_hide_with_no_data()
    {
        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/fof/upload/hide',
                [
                    'authenticatedAs' => 2,
                    'json'            => [],
                ]
            )
        );

        $this->assertEquals(422, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('errors', $json);

        $this->assertEquals('/data/attributes/uuid', $json['errors'][0]['source']['pointer']);
        $this->assertEquals('UUID cannot be empty.', $json['errors'][0]['detail']);
    }

    /**
     * @test
     */
    public function user_can_hide_own_file()
    {
        $uuid = 'abc-123';

        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/fof/upload/hide',
                [
                    'authenticatedAs' => 2,
                    'json'            => [
                        'uuid' => $uuid,
                    ],
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertTrue($json['data']['attributes']['hidden']);

        $file = File::byUuid($uuid)->first();

        $this->assertNotNull($file);
        $this->assertTrue($file->hidden);
    }

    /**
     * @test
     */
    public function user_cannot_hide_other_users_file()
    {
        $uuid = 'abc-123';

        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/fof/upload/hide',
                [
                    'authenticatedAs' => 3,
                    'json'            => [
                        'uuid' => $uuid,
                    ],
                ]
            )
        );

        $this->assertEquals(403, $response->getStatusCode());

        $file = File::byUuid($uuid)->first();

        $this->assertNotNull($file);
        $this->assertFalse($file->hidden);
    }

    /**
     * @test
     */
    public function user_cannot_hide_shared_files()
    {
        $uuid = 'def-456';

        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/fof/upload/hide',
                [
                    'authenticatedAs' => 2,
                    'json'            => [
                        'uuid' => $uuid,
                    ],
                ]
            )
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function admin_can_hide_shared_files()
    {
        $uuid = $this->uploadSharedFileAndGetUuid();

        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/fof/upload/hide',
                [
                    'authenticatedAs' => 1,
                    'json'            => [
                        'uuid' => $uuid,
                    ],
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $file = File::byUuid($uuid)->first();

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertTrue($json['data']['attributes']['hidden']);

        $this->assertNotNull($file);
        $this->assertTrue($file->hidden);

        $paths = resolve(Paths::class);

        $this->assertFileExists($paths->storage.'/private-shared/files/'.$file->path);
        $this->assertFileDoesNotExist($paths->public.'/assets/files/'.$file->path);
    }

    /**
     * @test
     */
    public function moderator_cannot_hide_shared_files()
    {
        $uuid = 'def-456';

        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/fof/upload/hide',
                [
                    'authenticatedAs' => 4,
                    'json'            => [
                        'uuid' => $uuid,
                    ],
                ]
            )
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    /**
     * @test
     */
    // public function user_with_permission_can_hide_files_of_others()
    // {
    //     $uuid = $this->uploadSharedFileAndGetUuid();

    //     $response = $this->send(
    //         $this->request(
    //             'PATCH',
    //             '/api/fof/upload/hide',
    //             [
    //                 'authenticatedAs' => 4,
    //                 'json' => [
    //                     'uuid' => $uuid,
    //                 ],
    //             ]
    //         )
    //     );

    //     $this->assertEquals(202, $response->getStatusCode());

    //     $file = File::byUuid($uuid)->first();

    //     $this->assertNotNull($file);
    //     $this->assertTrue($file->hidden);
    // }
}
