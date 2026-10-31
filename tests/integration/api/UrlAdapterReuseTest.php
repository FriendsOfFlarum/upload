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

use Flarum\Discussion\Discussion;
use Flarum\Extend;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Upload\Events\Adapter\Instantiate;
use FoF\Upload\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Building a file's URL needs its storage adapter only for the hostname.
 * Building that adapter — an S3Client for S3 — for every image on a page is
 * wasted work, so one is kept per storage method.
 */
class UrlAdapterReuseTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    private const IMAGES = 6;

    /** @var array<string, int> adapters built, by storage method */
    private array $built = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');
        $this->setting('fof-upload.awsS3Region', 'eu-west-1');
        $this->setting('fof-upload.awsS3Bucket', 'bucket-a');

        // Returns null, so the Manager builds the adapter as it normally would.
        $this->extend((new Extend\Event())->listen(Instantiate::class, function (Instantiate $event) {
            $this->built[$event->adapter] = ($this->built[$event->adapter] ?? 0) + 1;

            return null;
        }));

        $files = [];
        $posts = [];

        for ($id = 1; $id <= self::IMAGES; $id++) {
            $uuid = "image-$id";
            $files[] = [
                'id'             => $id, 'uuid' => $uuid, 'base_name' => "$id.png", 'path' => "files/$id.png",
                'url'            => "https://old.example.com/$id.png", 'type' => 'image/png', 'size' => 10,
                'upload_method'  => 'aws-s3', 'actor_id' => 2, 'shared' => false,
                'thumbnail_path' => "files/$id-thumb.webp", 'created_at' => '2026-01-01 00:00:00',
            ];
            $posts[] = [
                'id'         => $id, 'discussion_id' => 1, 'number' => $id, 'user_id' => 2, 'type' => 'comment',
                'content'    => "<r><UPL-IMAGE-PREVIEW url=\"https://old.example.com/$id.png\" uuid=\"$uuid\">[upl-image-preview uuid=$uuid url=https://old.example.com/$id.png]</UPL-IMAGE-PREVIEW></r>",
                'created_at' => sprintf('2026-01-01 00:%02d:00', $id),
            ];
        }

        // One post mixing storage: S3 and local images, interleaved, and a local text file.
        $mixed = [101 => ['s3-a.png', 'aws-s3'], 102 => ['local-a.png', 'local'], 103 => ['notes.txt', 'local'], 104 => ['s3-b.png', 'aws-s3'], 105 => ['local-b.png', 'local']];
        $content = '';

        foreach ($mixed as $id => [$name, $method]) {
            $uuid = "mixed-$id";
            $files[] = [
                'id'            => $id, 'uuid' => $uuid, 'base_name' => $name, 'path' => "files/$name",
                'url'           => "https://old.example.com/$name", 'type' => str_ends_with($name, '.txt') ? 'text/plain' : 'image/png',
                'size'          => 10, 'upload_method' => $method, 'actor_id' => 2, 'shared' => false, 'created_at' => '2026-01-01 00:00:00',
            ] + (str_ends_with($name, '.txt')
                // Its snippet already kept, as after its first render: reading
                // one (#537) uses a fresh adapter, which isn't what's measured.
                // More to show, so its live URL is rendered for expanding it.
                ? ['text_snippet' => 'a note', 'text_snippet_has_more' => true]
                : []);
            $content .= str_ends_with($name, '.txt')
                ? "<UPL-TEXT-PREVIEW url=\"https://old.example.com/$name\" uuid=\"$uuid\"><s>[upl-text-preview uuid=$uuid url=https://old.example.com/$name]</s>$name<e>[/upl-text-preview]</e></UPL-TEXT-PREVIEW>"
                : "<UPL-IMAGE-PREVIEW url=\"https://old.example.com/$name\" uuid=\"$uuid\">[upl-image-preview uuid=$uuid url=https://old.example.com/$name]</UPL-IMAGE-PREVIEW>";
        }

        $posts[] = [
            'id'         => 100, 'discussion_id' => 2, 'number' => 1, 'user_id' => 2, 'type' => 'comment',
            'content'    => "<r>$content</r>", 'created_at' => '2026-01-02 00:00:00',
        ];

        $this->prepareDatabase([
            User::class       => [$this->normalUser()],
            Discussion::class => [
                ['id' => 1, 'title' => 'Images', 'user_id' => 2, 'first_post_id' => 1, 'last_post_id' => self::IMAGES, 'comment_count' => self::IMAGES, 'created_at' => '2026-01-01 00:00:00'],
                ['id' => 2, 'title' => 'Mixed storage', 'user_id' => 2, 'first_post_id' => 100, 'last_post_id' => 100, 'comment_count' => 1, 'created_at' => '2026-01-02 00:00:00'],
            ],
            Post::class        => $posts,
            'fof_upload_files' => $files,
        ]);
    }

    /**
     * The hosts the rendered posts link their images to.
     *
     * @return list<string>
     */
    private function imageHosts(int $discussionId = 1): array
    {
        $response = $this->send(
            $this->request('GET', '/api/posts', ['authenticatedAs' => 1])->withQueryParams(['filter' => ['discussion' => $discussionId]])
        );

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());

        $html = implode('', array_map(
            fn (array $post) => $post['attributes']['contentHtml'] ?? '',
            json_decode((string) $response->getBody(), true)['data']
        ));

        preg_match_all('#(?:src|href)="https://([^/"]+)/files/#', $html, $matches);

        return array_values(array_unique($matches[1]));
    }

    #[Test]
    public function a_page_of_s3_images_builds_the_s3_adapter_once(): void
    {
        $this->assertSame(['bucket-a.s3.eu-west-1.amazonaws.com'], $this->imageHosts(), 'Precondition: every image links to S3');
        $this->assertSame(1, $this->built['aws-s3'] ?? 0);
    }

    /**
     * Each file's URL comes from the storage it's on, however they're mixed.
     */
    #[Test]
    public function a_post_mixing_storage_links_each_file_to_its_own_storage(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/posts/100', ['authenticatedAs' => 1])
        );

        $html = json_decode((string) $response->getBody(), true)['data']['attributes']['contentHtml'] ?? '';
        preg_match_all('#(?:src|href|data-url)="(https?://[^"]+/files/([^"/]+))"#', $html, $matches, PREG_SET_ORDER);

        $hosts = [];
        foreach ($matches as [, $url, $name]) {
            $hosts[$name] = parse_url($url, PHP_URL_HOST);
        }

        $this->assertSame([
            's3-a.png'    => 'bucket-a.s3.eu-west-1.amazonaws.com',
            'local-a.png' => 'localhost',
            'notes.txt'   => 'localhost',
            's3-b.png'    => 'bucket-a.s3.eu-west-1.amazonaws.com',
            'local-b.png' => 'localhost',
        ], $hosts, $html);

        $this->assertSame(['aws-s3' => 1, 'local' => 1], array_intersect_key($this->built, ['aws-s3' => 0, 'local' => 0]), 'One adapter per storage');
    }
}
