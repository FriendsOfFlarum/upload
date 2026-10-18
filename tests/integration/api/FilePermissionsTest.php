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
use Flarum\Group\Group;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Upload\File;
use FoF\Upload\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

/**
 * Who may delete or hide which file, and that every way of asking agrees:
 * the policy (which canDelete/canHide expose to the UI), the
 * /fof/upload/delete/{uuid} route the UI calls, and DELETE /api/files/{id}.
 *
 * - own files:      deleteOwnUploads (or deleteUserUploads); hiding is always allowed
 * - others' files:  deleteUserUploads, for both delete and hide — including files
 *                   whose uploader no longer exists
 * - shared files:   upload-shared-files only
 * - admins:         everything
 */
class FilePermissionsTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    private const OWN_GROUP = 5;
    private const LIBRARIAN_GROUP = 6;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        $file = fn (int $id, string $uuid, ?int $actorId, bool $shared = false) => [
            'id' => $id, 'base_name' => "$uuid.txt", 'uuid' => $uuid, 'path' => "perm-test/$uuid.txt",
            'url' => "http://localhost/assets/files/perm-test/$uuid.txt", 'type' => 'text/plain', 'size' => 1,
            'upload_method' => 'local', 'actor_id' => $actorId, 'shared' => $shared, 'hidden' => false,
            'created_at' => '2024-01-01 00:00:00',
        ];

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'owner', 'email' => 'owner@machine.local', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'moderator', 'email' => 'moderator@machine.local', 'is_email_confirmed' => true],
                ['id' => 5, 'username' => 'librarian', 'email' => 'librarian@machine.local', 'is_email_confirmed' => true],
            ],
            Group::class => [
                ['id' => self::OWN_GROUP, 'name_singular' => 'Owner', 'name_plural' => 'Owners'],
                ['id' => self::LIBRARIAN_GROUP, 'name_singular' => 'Librarian', 'name_plural' => 'Librarians'],
            ],
            'group_user' => [
                ['user_id' => 3, 'group_id' => self::OWN_GROUP],
                ['user_id' => 4, 'group_id' => Group::MODERATOR_ID],
                ['user_id' => 5, 'group_id' => self::LIBRARIAN_GROUP],
            ],
            'group_permission' => [
                ['permission' => 'fof-upload.deleteOwnUploads', 'group_id' => self::OWN_GROUP],
                ['permission' => 'fof-upload.deleteUserUploads', 'group_id' => Group::MODERATOR_ID],
                ['permission' => 'fof-upload.upload-shared-files', 'group_id' => self::LIBRARIAN_GROUP],
                // So a refused hide of a shared file can't be a refused download
                // inside the storage move: only the policy can say no.
                ['permission' => 'fof-upload.download', 'group_id' => Group::MEMBER_ID],
            ],
            'fof_upload_files' => [
                $file(1, 'of-normal', 2),
                $file(2, 'of-owner', 3),
                $file(3, 'of-moderator', 4),
                $file(4, 'uploader-gone', null),
                $file(5, 'shared', null, true),
            ],
        ]);
    }

    /**
     * @return array<string, array{int, string, bool}> actor id, file uuid, may delete
     */
    public static function deleteCases(): array
    {
        return [
            'no permission, own file'              => [2, 'of-normal', false],
            'deleteOwnUploads, own file'           => [3, 'of-owner', true],
            'deleteOwnUploads, someone else\'s'    => [3, 'of-normal', false],
            'deleteOwnUploads, shared file'        => [3, 'shared', false],
            'deleteUserUploads, someone else\'s'   => [4, 'of-normal', true],
            'deleteUserUploads, own file'          => [4, 'of-moderator', true],
            'deleteUserUploads, uploader gone'     => [4, 'uploader-gone', true],
            'deleteUserUploads, shared file'       => [4, 'shared', false],
            'upload-shared-files, shared file'     => [5, 'shared', true],
            'upload-shared-files, someone else\'s' => [5, 'of-normal', false],
            'admin, someone else\'s'               => [1, 'of-normal', true],
            'admin, uploader gone'                 => [1, 'uploader-gone', true],
            'admin, shared file'                   => [1, 'shared', true],
        ];
    }

    #[Test]
    #[DataProvider('deleteCases')]
    public function the_policy_decides_who_may_delete(int $actorId, string $uuid, bool $allowed): void
    {
        $this->app();

        $this->assertSame($allowed, User::find($actorId)->can('delete', File::byUuid($uuid)->firstOrFail()));
    }

    #[Test]
    #[DataProvider('deleteCases')]
    public function the_upload_delete_route_follows_the_policy(int $actorId, string $uuid, bool $allowed): void
    {
        $response = $this->send(
            $this->request('DELETE', "/api/fof/upload/delete/$uuid", ['authenticatedAs' => $actorId])
        );

        $this->assertSame($allowed ? 204 : 403, $response->getStatusCode(), (string) $response->getBody());
        $this->assertSame(!$allowed, File::byUuid($uuid)->exists(), 'The row survives exactly when the delete is refused');
    }

    #[Test]
    #[DataProvider('deleteCases')]
    public function the_files_api_delete_follows_the_policy(int $actorId, string $uuid, bool $allowed): void
    {
        $this->app();
        $id = File::byUuid($uuid)->value('id');

        $response = $this->send(
            $this->request('DELETE', "/api/files/$id", ['authenticatedAs' => $actorId])
        );

        $this->assertSame($allowed ? 204 : 403, $response->getStatusCode(), (string) $response->getBody());
        $this->assertSame(!$allowed, File::byUuid($uuid)->exists(), 'The row survives exactly when the delete is refused');
    }

    /**
     * Shared-file hides that are allowed move storage, so they're covered with
     * real uploads in HideFilesTest; here the refusals and the plain cases.
     *
     * @return array<string, array{int, string, bool}> actor id, file uuid, may hide
     */
    public static function hideCases(): array
    {
        return [
            'no permission, own file'              => [2, 'of-normal', true],
            'no permission, someone else\'s'       => [2, 'of-owner', false],
            'no permission, shared file'           => [2, 'shared', false],
            'deleteUserUploads, someone else\'s'   => [4, 'of-normal', true],
            'deleteUserUploads, uploader gone'     => [4, 'uploader-gone', true],
            'deleteUserUploads, shared file'       => [4, 'shared', false],
            'upload-shared-files, someone else\'s' => [5, 'of-normal', false],
        ];
    }

    #[Test]
    #[DataProvider('hideCases')]
    public function the_hide_route_follows_the_policy(int $actorId, string $uuid, bool $allowed): void
    {
        $this->app();
        $this->assertSame($allowed, User::find($actorId)->can('hide', File::byUuid($uuid)->firstOrFail()));

        $response = $this->send(
            $this->request('PATCH', '/api/fof/upload/hide', [
                'authenticatedAs' => $actorId,
                'json'            => ['uuid' => $uuid],
            ])
        );

        $this->assertSame($allowed ? 200 : 403, $response->getStatusCode(), (string) $response->getBody());
        $this->assertSame($allowed, (bool) File::byUuid($uuid)->value('hidden'));
    }

    #[Test]
    public function the_upload_shared_files_permission_can_hide_a_shared_file(): void
    {
        $this->app();

        $this->assertTrue(User::find(5)->can('hide', File::byUuid('shared')->firstOrFail()));
    }

    #[Test]
    public function a_guest_cannot_delete_through_the_files_api(): void
    {
        // Without the exemption CSRF answers 400 before the endpoint's own gate runs.
        $this->extend((new Extend\Csrf())->exemptRoute('files.delete'));

        $response = $this->send($this->request('DELETE', '/api/files/1'));

        $this->assertSame(401, $response->getStatusCode(), (string) $response->getBody());
        $this->assertTrue(File::byUuid('of-normal')->exists());
    }
}
