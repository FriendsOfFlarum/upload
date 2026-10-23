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

class FileThumbnailAttributesTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        $file = fn (array $attributes) => $attributes + [
            'type' => 'image/png', 'size' => 1, 'actor_id' => 2, 'upload_method' => 'local',
            'shared' => false, 'hidden' => false, 'created_at' => '2024-01-01 00:00:00',
        ];

        $this->prepareDatabase([
            User::class        => [$this->normalUser()],
            'fof_upload_files' => [
                $file([
                    'id'              => 1, 'uuid' => 'local-image', 'base_name' => 'photo.png', 'path' => '2024-01-01/photo.png',
                    'url'             => 'http://localhost/assets/files/2024-01-01/photo.png',
                    'image_width'     => 2000, 'image_height' => 1500,
                    'thumbnail_path'  => '2024-01-01/photo-thumb.webp', 'thumbnail_url' => 'https://stale.example.com/photo-thumb.webp',
                    'thumbnail_width' => 1000, 'thumbnail_height' => 750,
                ]),
                $file([
                    'id'  => 2, 'uuid' => 'text-file', 'base_name' => 'notes.txt', 'path' => '2024-01-01/notes.txt',
                    'url' => 'http://localhost/assets/files/2024-01-01/notes.txt', 'type' => 'text/plain',
                ]),
                $file([
                    'id'              => 3, 'uuid' => 'qiniu-image', 'base_name' => 'cdn.png', 'path' => '2024-01-01/cdn.png',
                    'url'             => 'https://cdn.example.com/2024-01-01/cdn.png', 'upload_method' => 'qiniu',
                    'thumbnail_path'  => '2024-01-01/cdn-thumb.webp', 'thumbnail_url' => 'https://cdn.example.com/2024-01-01/cdn-thumb.webp',
                    'thumbnail_width' => 1000, 'thumbnail_height' => 500,
                ]),
                $file([
                    'id'              => 4, 'uuid' => 'hidden-shared', 'base_name' => 'secret.png', 'path' => '2024-01-01/secret.png',
                    'url'             => 'http://localhost/api/fof/download/hidden-shared', 'upload_method' => 'private-shared',
                    'shared'          => true, 'hidden' => true,
                    'thumbnail_path'  => '2024-01-01/secret-thumb.webp', 'thumbnail_url' => 'http://localhost/assets/files/2024-01-01/secret-thumb.webp',
                    'thumbnail_width' => 1000, 'thumbnail_height' => 750,
                ]),
            ],
        ]);
    }

    /**
     * @return array<string, array<string, mixed>> attributes by uuid
     */
    private function list(string $path, int $actorId, array $query = []): array
    {
        $response = $this->send(
            $this->request('GET', $path, ['authenticatedAs' => $actorId])->withQueryParams($query)
        );

        $body = (string) $response->getBody();
        $this->assertSame(200, $response->getStatusCode(), $body);

        $files = [];
        foreach (json_decode($body, true)['data'] as $file) {
            $files[$file['attributes']['uuid']] = $file['attributes'];
        }

        return $files;
    }

    #[Test]
    public function an_image_with_a_thumbnail_exposes_its_live_url_and_dimensions(): void
    {
        $file = $this->list('/api/fof/uploads', 2)['local-image'];

        $this->assertSame('http://localhost/assets/files/2024-01-01/photo-thumb.webp', $file['thumbnailUrl']);
        $this->assertSame(1000, $file['thumbnailWidth']);
        $this->assertSame(750, $file['thumbnailHeight']);
        $this->assertSame(2000, $file['imageWidth']);
        $this->assertSame(1500, $file['imageHeight']);
    }

    #[Test]
    public function a_file_without_a_thumbnail_exposes_nulls(): void
    {
        $file = $this->list('/api/fof/uploads', 2)['text-file'];

        $this->assertNull($file['thumbnailUrl']);
        $this->assertNull($file['thumbnailWidth']);
        $this->assertNull($file['thumbnailHeight']);
        $this->assertNull($file['imageWidth']);
        $this->assertNull($file['imageHeight']);
    }

    #[Test]
    public function an_adapter_without_live_urls_has_no_thumbnail_url_as_in_post_previews(): void
    {
        $file = $this->list('/api/fof/uploads', 2)['qiniu-image'];

        $this->assertNull($file['thumbnailUrl']);
    }

    #[Test]
    public function a_hidden_shared_image_never_exposes_a_leftover_public_thumbnail(): void
    {
        $file = $this->list('/api/fof/upload/shared-files', 1)['hidden-shared'];

        $this->assertNull($file['thumbnailUrl']);
    }
}
