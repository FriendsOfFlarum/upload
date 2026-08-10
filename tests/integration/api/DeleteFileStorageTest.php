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
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Upload\File;
use FoF\Upload\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Deleting a file must remove the object from storage, not just the database row.
 *
 * The delete handler resolves the adapter with Util::getAdapterForFile(), which
 * maps the file's *mime type* through the current mime configuration. That is
 * not the same thing as the adapter the file was actually uploaded with —
 * File::upload_method records that, and is what cleanUp() and getUrlForFile()
 * both use.
 *
 * Whenever the two disagree — the mime mapping was changed after upload, the
 * file's mime type no longer matches any configured pattern, or the adapter was
 * uninstalled — the delete is issued against the wrong filesystem. The object is
 * left behind while the database row disappears, so nothing surfaces the
 * orphan.
 */
class DeleteFileStorageTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;
    use UploadFileTrait;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
            ],
        ]);
    }

    private function localPath(File $file): string
    {
        return $this->app()->getContainer()->make(Paths::class)->public.'/assets/files/'.$file->path;
    }

    /**
     * Change a setting after the app has booted.
     *
     * TestCase::setting() only seeds the value used when the container is
     * built, so it has no effect once a request has been made — which is
     * exactly the scenario these tests need: upload first, reconfigure after.
     */
    private function changeSetting(string $key, string $value): void
    {
        $this->app()->getContainer()->make(SettingsRepositoryInterface::class)->set($key, $value);
    }

    private function uploadImage(): File
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 1,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('MilkyWay.jpg')),
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $file = File::byUuid($json['data'][0]['attributes']['uuid'])->first();

        $this->assertNotNull($file);

        return $file;
    }

    #[Test]
    public function deleting_a_file_removes_it_from_local_storage(): void
    {
        $this->addType('^image\\/jpeg$', 'local', 'image-preview');

        $file = $this->uploadImage();
        $path = $this->localPath($file);

        $this->assertFileExists($path, 'Upload should have written the file to disk');

        $response = $this->send(
            $this->request('DELETE', '/api/fof/upload/delete/'.$file->uuid, [
                'authenticatedAs' => 1,
            ])
        );

        $this->assertEquals(204, $response->getStatusCode());
        $this->assertNull(File::byUuid($file->uuid)->first(), 'Database row should be gone');
        $this->assertFileDoesNotExist($path, 'File should have been removed from storage');
    }

    /**
     * The mime configuration is not a reliable way to find a file's adapter: an
     * admin can change the mapping at any time, and existing files keep pointing
     * at wherever they were originally stored.
     */
    #[Test]
    public function deleting_a_file_removes_it_from_storage_after_the_mime_mapping_changed(): void
    {
        $this->addType('^image\\/jpeg$', 'local', 'image-preview');

        $file = $this->uploadImage();
        $path = $this->localPath($file);

        $this->assertFileExists($path);
        $this->assertEquals('local', $file->upload_method);

        // The admin remaps jpegs to a different adapter after the file was
        // uploaded. The stored object has not moved.
        //
        // Written through the live repository rather than $this->setting(),
        // which only seeds values at app boot and would be ignored here.
        $this->changeSetting('fof-upload.mimeTypes', json_encode([
            '^image\\/jpeg$' => [
                'adapter'  => 'imgur',
                'template' => 'image-preview',
            ],
        ]));

        $response = $this->send(
            $this->request('DELETE', '/api/fof/upload/delete/'.$file->uuid, [
                'authenticatedAs' => 1,
            ])
        );

        $this->assertEquals(204, $response->getStatusCode());
        $this->assertFileDoesNotExist(
            $path,
            'The file must be deleted from the adapter it was uploaded with, not the one its mime type currently maps to'
        );
    }

    /**
     * A mime type with no matching pattern has no adapter to resolve, so the
     * delete has nowhere to send the request.
     */
    #[Test]
    public function deleting_a_file_removes_it_from_storage_when_no_mime_rule_matches(): void
    {
        $this->addType('^image\\/jpeg$', 'local', 'image-preview');

        $file = $this->uploadImage();
        $path = $this->localPath($file);

        $this->assertFileExists($path);

        // The rule that covered this file is removed — a plausible outcome of
        // tidying up the file-type list.
        $this->changeSetting('fof-upload.mimeTypes', json_encode([
            '^application\\/pdf$' => [
                'adapter'  => 'local',
                'template' => 'file',
            ],
        ]));

        $response = $this->send(
            $this->request('DELETE', '/api/fof/upload/delete/'.$file->uuid, [
                'authenticatedAs' => 1,
            ])
        );

        $this->assertFileDoesNotExist(
            $path,
            'The file must still be deleted from storage when its mime type no longer matches a configured rule'
        );
    }

    /**
     * A file whose adapter cannot be resolved at all must fail cleanly.
     *
     * Previously this called delete() on null, producing a 500 and leaving both
     * the stored object and its database row behind — the worst outcome, since
     * nothing indicated the file still existed.
     */
    #[Test]
    public function deleting_a_file_with_an_unresolvable_adapter_fails_without_a_server_error(): void
    {
        $this->addType('^image\\/jpeg$', 'local', 'image-preview');

        $file = $this->uploadImage();

        // Neither the recorded upload method nor the mime mapping can resolve.
        $file->upload_method = 'no-such-adapter';
        $file->save();

        $this->changeSetting('fof-upload.mimeTypes', json_encode([
            '^application\\/pdf$' => [
                'adapter'  => 'local',
                'template' => 'file',
            ],
        ]));

        $response = $this->send(
            $this->request('DELETE', '/api/fof/upload/delete/'.$file->uuid, [
                'authenticatedAs' => 1,
            ])
        );

        $this->assertNotEquals(500, $response->getStatusCode(), 'Must not fatal when no adapter can be resolved');

        // The row is deliberately kept: the object is still in storage, so
        // dropping the record would orphan it with nothing left pointing at it.
        $this->assertNotNull(File::byUuid($file->uuid)->first(), 'The record must survive a failed storage delete');
    }
}
