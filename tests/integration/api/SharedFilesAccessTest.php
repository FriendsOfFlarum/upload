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

use Flarum\Group\Group;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Upload\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

/**
 * The shared library is gated by fof-upload.access-shared-files in the UI only;
 * the list endpoints must enforce it too.
 */
class SharedFilesAccessTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    private const VIEWER_GROUP = 5;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'viewer', 'email' => 'viewer@machine.local', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'librarian', 'email' => 'librarian@machine.local', 'is_email_confirmed' => true],
            ],
            Group::class => [
                ['id' => self::VIEWER_GROUP, 'name_singular' => 'Viewer', 'name_plural' => 'Viewers'],
            ],
            'group_user' => [
                ['user_id' => 3, 'group_id' => self::VIEWER_GROUP],
                ['user_id' => 4, 'group_id' => Group::MODERATOR_ID],
            ],
            'group_permission' => [
                ['permission' => 'fof-upload.access-shared-files', 'group_id' => self::VIEWER_GROUP],
                ['permission' => 'fof-upload.upload-shared-files', 'group_id' => Group::MODERATOR_ID],
            ],
            'fof_upload_files' => [
                ['id' => 1, 'base_name' => 'public.png', 'uuid' => 'shared-public', 'path' => 'p/public.png', 'url' => 'http://localhost/public.png', 'type' => 'image/png', 'size' => 1, 'upload_method' => 'local', 'shared' => true, 'hidden' => false, 'created_at' => '2024-01-01 00:00:00'],
                ['id' => 2, 'base_name' => 'private.png', 'uuid' => 'shared-private', 'path' => 'p/private.png', 'url' => 'http://localhost/private.png', 'type' => 'image/png', 'size' => 1, 'upload_method' => 'private-shared', 'shared' => true, 'hidden' => true, 'created_at' => '2024-01-01 00:00:00'],
            ],
        ]);
    }

    public static function sharedListRoutes(): array
    {
        return [
            'shared-files route' => ['/api/fof/upload/shared-files', []],
            'uploads filter'     => ['/api/fof/uploads', ['filter' => ['shared' => '1']]],
        ];
    }

    private function list(string $path, array $query, int $actorId): array
    {
        $response = $this->send(
            $this->request('GET', $path, ['authenticatedAs' => $actorId])->withQueryParams($query)
        );

        $body = (string) $response->getBody();
        $uuids = array_map(fn ($f) => $f['attributes']['uuid'], json_decode($body, true)['data'] ?? []);
        sort($uuids);

        return [$response->getStatusCode(), $uuids, $body];
    }

    #[Test]
    #[DataProvider('sharedListRoutes')]
    public function a_member_without_access_cannot_list_shared_files(string $path, array $query): void
    {
        [$status, , $body] = $this->list($path, $query, 2);

        $this->assertSame(403, $status, $body);
    }

    #[Test]
    #[DataProvider('sharedListRoutes')]
    public function access_shared_files_lists_only_the_visible_shared_files(string $path, array $query): void
    {
        [$status, $uuids, $body] = $this->list($path, $query, 3);

        $this->assertSame(200, $status, $body);
        $this->assertSame(['shared-public'], $uuids);
    }

    #[Test]
    #[DataProvider('sharedListRoutes')]
    public function upload_shared_files_also_lists_the_hidden_shared_files(string $path, array $query): void
    {
        [$status, $uuids, $body] = $this->list($path, $query, 4);

        $this->assertSame(200, $status, $body);
        $this->assertSame(['shared-private', 'shared-public'], $uuids);
    }

    #[Test]
    #[DataProvider('sharedListRoutes')]
    public function an_admin_lists_every_shared_file(string $path, array $query): void
    {
        [$status, $uuids, $body] = $this->list($path, $query, 1);

        $this->assertSame(200, $status, $body);
        $this->assertSame(['shared-private', 'shared-public'], $uuids);
    }

    #[Test]
    public function a_member_without_access_can_still_list_their_own_files(): void
    {
        [$status, , $body] = $this->list('/api/fof/uploads', [], 2);

        $this->assertSame(200, $status, $body);
    }
}
