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
use Flarum\Testing\integration\TestCase;

class UserAttributes extends TestCase
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
            'fof_upload_files' => [
                ['id' => 1, 'base_name' => 'test_file.abc', 'path' => 'path/test_file.abc', 'url' => 'http://localhost/test_file.abc', 'type' => 'test/file', 'size' => 123, 'upload_method' => 'local', 'actor_id' => 2, 'shared' => false],
            ],
        ]);
    }

    /**
     * @test
     */
    public function upload_counts_are_included_when_logged_in()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/2',
                [
                    'authenticatedAs' => 2,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertEquals(1, $json['data']['attributes']['fof-upload-uploadCountCurrent']);
        $this->assertEquals(1, $json['data']['attributes']['fof-upload-uploadCountAll']);
    }

    /**
     * @test
     */
    public function upload_counts_are_included_when_logged_out()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/2'
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertEquals(1, $json['data']['attributes']['fof-upload-uploadCountCurrent']);
        $this->assertEquals(1, $json['data']['attributes']['fof-upload-uploadCountAll']);
    }

    /**
     * @test
     */
    public function user_with_permissions_have_extra_attributes()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/1',
                [
                    'authenticatedAs' => 1,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('fof-upload-viewOthersMediaLibrary', $json['data']['attributes']);
        $this->assertArrayHasKey('fof-upload-deleteOthersMediaLibrary', $json['data']['attributes']);
    }

    /**
     * @test
     */
    public function user_without_permissions_dont_have_extra_attributes()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/2',
                [
                    'authenticatedAs' => 2,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayNotHasKey('fof-upload-viewOthersMediaLibrary', $json['data']['attributes']);
        $this->assertArrayNotHasKey('fof-upload-deleteOthersMediaLibrary', $json['data']['attributes']);
    }

    /**
     * @test
     */
    public function current_user_does_not_have_upload_shared_file_permission_attribute_when_no_permission()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/2',
                [
                    'authenticatedAs' => 2,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayNotHasKey('fof-upload-uploadSharedFiles', $json['data']['attributes']);
    }

    /**
     * @test
     */
    public function current_user_has_upload_shared_file_permission_attribute_when_has_permission()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/1',
                [
                    'authenticatedAs' => 1,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertTrue($json['data']['attributes']['fof-upload-uploadSharedFiles']);
    }
}
