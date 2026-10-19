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

    private int $s3AdaptersBuilt = 0;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');
        $this->setting('fof-upload.awsS3Region', 'eu-west-1');
        $this->setting('fof-upload.awsS3Bucket', 'bucket-a');

        // Returns null, so the Manager builds the adapter as it normally would.
        $this->extend((new Extend\Event())->listen(Instantiate::class, function (Instantiate $event) {
            if ($event->adapter === 'aws-s3') {
                $this->s3AdaptersBuilt++;
            }

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

        $this->prepareDatabase([
            User::class       => [$this->normalUser()],
            Discussion::class => [
                ['id' => 1, 'title' => 'Images', 'user_id' => 2, 'first_post_id' => 1, 'last_post_id' => self::IMAGES, 'comment_count' => self::IMAGES, 'created_at' => '2026-01-01 00:00:00'],
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
    private function imageHosts(): array
    {
        $response = $this->send(
            $this->request('GET', '/api/posts', ['authenticatedAs' => 1])->withQueryParams(['filter' => ['discussion' => 1]])
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
        $this->assertSame(1, $this->s3AdaptersBuilt);
    }
}
