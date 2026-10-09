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
use Flarum\User\User;
use FoF\Upload\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Listing files asks FilePolicy whether each can be hidden or deleted, which
 * reads the file's uploader: that must load once for the page.
 */
class ListFilesQueryCountTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;
    use UploadFileTrait;

    private const FILES = 8;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        $files = [];

        for ($i = 1; $i <= self::FILES; $i++) {
            $files[] = ['id' => $i, 'base_name' => "file$i.abc", 'uuid' => "uuid-$i", 'path' => "path/file$i.abc", 'url' => "http://localhost/file$i.abc", 'type' => 'test/file', 'size' => 123, 'upload_method' => 'local', 'actor_id' => 2, 'shared' => false, 'created_at' => '2024-01-01 00:00:00'];
        }

        $this->prepareDatabase([
            User::class        => [$this->normalUser()],
            'fof_upload_files' => $files,
        ]);
    }

    #[Test]
    public function the_uploader_loads_once_for_the_page()
    {
        $this->app();
        $db = $this->database();
        $db->enableQueryLog();
        $db->flushQueryLog();

        $response = $this->send(
            $this->request('GET', '/api/fof/uploads', ['authenticatedAs' => 2])
                ->withQueryParams(['filter' => ['user' => 2]])
        );

        $sql = array_map(fn ($q) => str_replace(['`', '"'], '', $q), array_column($db->getQueryLog(), 'query'));
        $db->flushQueryLog();

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody()->getContents(), true);
        $this->assertCount(self::FILES, $body['data']);

        foreach ($body['data'] as $file) {
            $this->assertTrue($file['attributes']['canHide'], 'The uploader can hide their own files');
        }

        // One for the viewer's own session, one for the page's uploaders.
        $userLoads = array_filter($sql, fn ($q) => str_contains($q, 'from users where users.id'));
        $this->assertLessThanOrEqual(2, count($userLoads), 'The uploaders load in one query, not one per file');
    }

    /**
     * Uploading several files at once answers with the same per-file checks;
     * the uploader is the actor, so none of them should fetch it again.
     */
    #[Test]
    public function uploading_several_files_does_not_load_the_uploader_per_file()
    {
        $this->giveNormalUserUploadPermission();

        $this->app();
        $db = $this->database();
        $db->enableQueryLog();
        $db->flushQueryLog();

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('MilkyWay.jpg')),
                    $this->uploadFile($this->fixtures('MilkyWay.jpg')),
                    $this->uploadFile($this->fixtures('MilkyWay.jpg')),
                ],
            ])
        );

        $sql = array_map(fn ($q) => str_replace(['`', '"'], '', $q), array_column($db->getQueryLog(), 'query'));
        $db->flushQueryLog();

        $body = $response->getBody()->getContents();
        $this->assertEquals(200, $response->getStatusCode(), $body);
        $json = json_decode($body, true);
        $this->assertCount(3, $json['data']);

        foreach ($json['data'] as $file) {
            $this->assertTrue($file['attributes']['canHide'], 'The uploader can hide their own files');
            $this->assertFalse($file['attributes']['canDelete'], 'Only users who may delete others\' uploads can delete');
            $this->assertSame('2', $file['relationships']['actor']['data']['id']);
        }

        // Only the viewer's own session reads the users table.
        $userLoads = array_filter($sql, fn ($q) => str_contains($q, 'from users where users.id'));
        $this->assertLessThanOrEqual(1, count($userLoads), 'The uploader is not fetched again for each file');
    }
}
