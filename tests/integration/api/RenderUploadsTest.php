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

use DOMDocument;
use DOMElement;
use DOMXPath;
use Flarum\Discussion\Discussion;
use Flarum\Foundation\Paths;
use Flarum\Post\CommentPost;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\Test;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Posts show their uploads as the files are now: where they are kept, their
 * names and their sizes, however the posts reach the page.
 *
 * The fixture is modelled on discuss.flarum.org. In discussion 1:
 * - post 1, like the Flarum 2.0 launch post (d/40027), has image previews of
 *   files on S3 among file embeds: with a thumbnail, with dimensions only, with
 *   neither, with an alt text chosen by the author and with the "{TEXT?}" one
 *   older versions stored. One image is shown twice, one has been deleted, and
 *   one is embedded as before #420 gave embeds a uuid, by its URL alone;
 * - posts 2 to 10 have one upload each, by different authors, as most posts
 *   with uploads do: images, and text previews of a short file, a long one and
 *   a deleted one; post 6 has none;
 * - post 11 embeds another file by its URL alone, and post 12 a deleted image.
 *
 * Discussions 2 and 3 have one post each.
 *
 * Every file's stored URL is out of date, as after a move to a CDN, so the
 * URLs rendered show they were worked out afresh.
 */
class RenderUploadsTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected const CDN = 'https://cdn.example.com';

    private DOMXPath $xpath;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        $this->setting('fof-upload.awsS3Region', 'eu-west-1');
        $this->setting('fof-upload.awsS3Bucket', 'bucket');
        $this->setting('fof-upload.cdnUrl', self::CDN);

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'viewer', 'email' => 'viewer@machine.local', 'is_email_confirmed' => 1],
            ],
            Discussion::class => [
                $this->discussion(1, 'Downloadable goodies', 1, 12, 12),
                $this->discussion(2, 'One image', 13, 13, 1),
                $this->discussion(3, 'Older embeds', 14, 14, 1),
            ],
            Post::class => [
                $this->post(1, 1, 1, 2, '<p>Downloadable goodies.</p>'.$this->image(1, 'a chosen description').$this->image(2).$this->image(3, '{TEXT?}')
                    .$this->file(4, 'archive-a.zip').$this->file(5, 'archive-b.zip').$this->image(1).$this->image(99).$this->legacyImage('legacy.png')),
                $this->post(2, 1, 2, 3, $this->image(7)),
                $this->post(3, 1, 3, 2, $this->text(11, 'short.txt')),
                $this->post(4, 1, 4, 2, $this->text(12, 'long.txt')),
                $this->post(5, 1, 5, 3, $this->text(98, 'gone.txt')),
                $this->post(6, 1, 6, 3, '<p>No uploads here.</p>'),
                $this->post(7, 1, 7, 2, $this->image(8)),
                $this->post(8, 1, 8, 3, $this->image(9)),
                $this->post(9, 1, 9, 2, $this->image(10)),
                $this->post(10, 1, 10, 3, $this->image(13)),
                $this->post(11, 1, 11, 2, $this->legacyImage('legacy-two.png')),
                $this->post(12, 1, 12, 3, $this->image(97)),
                $this->post(13, 2, 1, 3, $this->image(15)),
                $this->post(14, 3, 1, 2, $this->legacyImage('third.png').$this->image(96).$this->text(11, 'short.txt')),
            ],
            'fof_upload_files' => [
                $this->upload(1, 's3-thumb.png', 'aws-s3', [
                    'thumbnail_path'  => 'files/s3-thumb-thumb.webp', 'image_width' => 2400, 'image_height' => 800,
                    'thumbnail_width' => 800, 'thumbnail_height' => 267,
                ]),
                $this->upload(2, 's3-dims.png', 'aws-s3', ['image_width' => 1200, 'image_height' => 600]),
                $this->upload(3, 's3-bare.png', 'aws-s3'),
                $this->upload(4, 'archive-a.zip', 'aws-s3'),
                $this->upload(5, 'archive-b.zip', 'aws-s3'),
                $this->upload(6, 'legacy.png', 'local', ['image_width' => 10, 'image_height' => 20]),
                $this->upload(7, 'post-two.jpg', 'local', ['image_width' => 30, 'image_height' => 40]),
                $this->upload(8, 'post-seven.jpg', 'local'),
                $this->upload(9, 'post-eight.jpg', 'local', ['image_width' => 50, 'image_height' => 60]),
                // A thumbnail, but no dimensions recorded.
                $this->upload(10, 'post-nine.jpg', 'aws-s3', ['thumbnail_path' => 'files/post-nine-thumb.webp']),
                $this->upload(11, 'short.txt', 'local'),
                $this->upload(12, 'long.txt', 'local'),
                $this->upload(13, 'post-ten.png', 'aws-s3', ['image_width' => 640, 'image_height' => 480]),
                $this->upload(14, 'legacy-two.png', 'local'),
                $this->upload(15, 'second.png', 'aws-s3', [
                    'thumbnail_path'  => 'files/second-thumb.webp', 'image_width' => 1600, 'image_height' => 900,
                    'thumbnail_width' => 800, 'thumbnail_height' => 450,
                ]),
                $this->upload(16, 'third.png', 'local', ['image_width' => 70, 'image_height' => 80]),
            ],
            // As LinkFilesToPostOnSave records them. Embeds by URL alone are
            // left out, as on forums that never ran fof:upload:map after #420.
            'fof_upload_file_posts' => array_map(fn (array $link) => ['post_id' => $link[0], 'file_id' => $link[1]], [
                [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 7], [3, 11], [4, 12], [7, 8], [8, 9], [9, 10], [10, 13],
                [13, 15], [14, 11],
            ]),
        ]);

        // Text previews read their snippets from the files themselves.
        $directory = $this->localFiles();
        @mkdir($directory, 0777, true);
        file_put_contents("$directory/short.txt", "one\ntwo\n\nthree\n");
        file_put_contents("$directory/long.txt", "l1\nl2\nl3\nl4\nl5\nl6\nl7");
    }

    public function tearDown(): void
    {
        @unlink($this->localFiles().'/short.txt');
        @unlink($this->localFiles().'/long.txt');

        parent::tearDown();
    }

    #[Test]
    public function an_image_preview_shows_its_file_where_it_is_now_kept_with_its_name_and_size()
    {
        $posts = $this->renderedPosts();

        $this->assertEquals([
            // A thumbnail, sized as the thumbnail, keeping the author's alt text.
            $this->expectedImage(1, self::CDN.'/files/s3-thumb.png', self::CDN.'/files/s3-thumb-thumb.webp', 's3-thumb.png', 'a chosen description', '800', '267'),
            // No thumbnail: the image itself, at its own size.
            $this->expectedImage(2, self::CDN.'/files/s3-dims.png', self::CDN.'/files/s3-dims.png', 's3-dims.png', 's3-dims.png', '1200', '600'),
            // No size recorded, and the "{TEXT?}" alt older versions stored.
            $this->expectedImage(3, self::CDN.'/files/s3-bare.png', self::CDN.'/files/s3-bare.png', 's3-bare.png', 's3-bare.png', '', ''),
            // The same image again, without an alt text of its own.
            $this->expectedImage(1, self::CDN.'/files/s3-thumb.png', self::CDN.'/files/s3-thumb-thumb.webp', 's3-thumb.png', 's3-thumb.png', '800', '267'),
        ], array_slice($this->imagePreviews($posts[1]), 0, 4));

        $this->assertEquals([
            2  => [$this->expectedImage(7, 'http://localhost/assets/files/files/post-two.jpg', 'http://localhost/assets/files/files/post-two.jpg', 'post-two.jpg', 'post-two.jpg', '30', '40')],
            7  => [$this->expectedImage(8, 'http://localhost/assets/files/files/post-seven.jpg', 'http://localhost/assets/files/files/post-seven.jpg', 'post-seven.jpg', 'post-seven.jpg', '', '')],
            8  => [$this->expectedImage(9, 'http://localhost/assets/files/files/post-eight.jpg', 'http://localhost/assets/files/files/post-eight.jpg', 'post-eight.jpg', 'post-eight.jpg', '50', '60')],
            // A thumbnail, but no size recorded for it or the image.
            9  => [$this->expectedImage(10, self::CDN.'/files/post-nine.jpg', self::CDN.'/files/post-nine-thumb.webp', 'post-nine.jpg', 'post-nine.jpg', '', '')],
            10 => [$this->expectedImage(13, self::CDN.'/files/post-ten.png', self::CDN.'/files/post-ten.png', 'post-ten.png', 'post-ten.png', '640', '480')],
            13 => [$this->expectedImage(15, self::CDN.'/files/second.png', self::CDN.'/files/second-thumb.webp', 'second.png', 'second.png', '800', '450')],
        ], array_map($this->imagePreviews(...), array_intersect_key($posts, array_flip([2, 7, 8, 9, 10, 13]))));
    }

    #[Test]
    public function an_image_preview_of_a_deleted_file_is_shown_as_it_was_posted()
    {
        $posts = $this->renderedPosts();

        $this->assertEquals(
            $this->expectedImage(99, 'https://old.example.com/99', 'https://old.example.com/99-thumb', '', '', '', ''),
            $this->imagePreviews($posts[1])[4]
        );
        $this->assertEquals(
            [$this->expectedImage(97, 'https://old.example.com/97', 'https://old.example.com/97-thumb', '', '', '', '')],
            $this->imagePreviews($posts[12])
        );
        $this->assertEquals(
            $this->expectedImage(96, 'https://old.example.com/96', 'https://old.example.com/96-thumb', '', '', '', ''),
            $this->imagePreviews($posts[14])[1]
        );
    }

    #[Test]
    public function an_image_preview_from_before_uuids_is_found_by_its_url()
    {
        $posts = $this->renderedPosts();

        $this->assertEquals(
            $this->expectedImage(null, 'http://localhost/assets/files/files/legacy.png', 'http://localhost/assets/files/files/legacy.png', 'legacy.png', 'legacy.png', '10', '20'),
            $this->imagePreviews($posts[1])[5]
        );
        $this->assertEquals(
            [$this->expectedImage(null, 'http://localhost/assets/files/files/legacy-two.png', 'http://localhost/assets/files/files/legacy-two.png', 'legacy-two.png', 'legacy-two.png', '', '')],
            $this->imagePreviews($posts[11])
        );
        $this->assertEquals(
            $this->expectedImage(null, 'http://localhost/assets/files/files/third.png', 'http://localhost/assets/files/files/third.png', 'third.png', 'third.png', '70', '80'),
            $this->imagePreviews($posts[14])[0]
        );
    }

    #[Test]
    public function a_text_preview_shows_the_start_of_its_file()
    {
        $posts = $this->renderedPosts();

        $short = ['label' => 'short.txt', 'hasSnippet' => 'false', 'snippet' => "one\ntwo\nthree", 'download' => 'http://localhost/assets/files/files/short.txt'];

        $this->assertEquals([
            // Short enough to show whole, blank lines dropped.
            3  => [$short],
            // Too long to show whole: the first five lines.
            4  => [['label' => 'long.txt', 'hasSnippet' => 'true', 'snippet' => "l1\nl2\nl3\nl4\nl5", 'download' => 'http://localhost/assets/files/files/long.txt']],
            // A deleted file: as it was posted, with no snippet.
            5  => [['label' => 'gone.txt', 'hasSnippet' => 'true', 'snippet' => '', 'download' => 'https://old.example.com/98']],
            14 => [$short],
        ], array_map($this->textPreviews(...), array_intersect_key($posts, array_flip([3, 4, 5, 14]))));
    }

    #[Test]
    public function file_embeds_are_left_as_they_were_posted()
    {
        $this->assertEquals([
            ['uuid' => $this->uuid(4), 'label' => 'archive-a.zip', 'size' => '2MB'],
            ['uuid' => $this->uuid(5), 'label' => 'archive-b.zip', 'size' => '2MB'],
        ], $this->fileEmbeds($this->renderedPosts()[1]));
    }

    #[Test]
    public function every_way_of_loading_a_post_renders_it_the_same()
    {
        $posts = $this->renderedPosts();

        $this->assertCount(14, $posts);

        $this->assertSame(
            [1 => $posts[1]],
            $this->postsIn($this->request('GET', '/api/posts/1'))
        );
        // Its first and last posts.
        $this->assertSame(
            array_intersect_key($posts, array_flip([1, 12])),
            $this->postsIn($this->request('GET', '/api/discussions/1'))
        );
        $this->assertSame(
            array_intersect_key($posts, array_flip([1, 12, 13, 14])),
            $this->postsIn($this->request('GET', '/api/discussions')->withQueryParams(['include' => 'firstPost,lastPost']))
        );
        $this->assertSame(
            array_intersect_key($posts, array_flip(range(1, 12))),
            $this->postsOnForumPage('/d/1')
        );
    }

    #[Test]
    public function everyone_sees_a_post_rendered_the_same()
    {
        $asGuest = $this->renderedPosts();

        $this->assertCount(14, $asGuest);
        $this->assertSame($asGuest, $this->renderedPosts(3), 'Rendered differently for another member');
        $this->assertSame($asGuest, $this->renderedPosts(2), 'Rendered differently for the uploader');
        $this->assertSame($asGuest, $this->renderedPosts(1), 'Rendered differently for an admin');
    }

    /**
     * As notifications, edits and other extensions render posts: with no
     * files loaded beforehand.
     */
    #[Test]
    public function a_post_rendered_on_its_own_looks_its_uploads_up_together()
    {
        $expected = $this->renderedPosts();
        $database = $this->database();
        $rendered = [];
        $queries = [];

        foreach (CommentPost::query()->orderBy('id')->get() as $post) {
            $database->flushQueryLog();
            $database->enableQueryLog();
            $rendered[$post->id] = $post->formatContent();
            $queries[$post->id] = count(array_filter(
                array_column($database->getQueryLog(), 'query'),
                fn (string $sql) => str_contains($sql, '`fof_upload_')
            ));
            $database->disableQueryLog();
            $database->flushQueryLog();
        }

        $this->assertSame($expected, $rendered);

        // Post 1's eight previews in one; post 14's image and text previews
        // in one each; post 6 has none.
        $this->assertSame(1, $queries[1]);
        $this->assertSame(2, $queries[14]);
        $this->assertSame(0, $queries[6]);
    }

    #[Test]
    public function listing_posts_does_not_look_up_each_upload_on_its_own()
    {
        $this->assertLooksUpUploadsAtOnce(
            $this->request('GET', '/api/posts')->withQueryParams(['filter' => ['discussion' => 1], 'page' => ['limit' => 1]]),
            $this->request('GET', '/api/posts')->withQueryParams(['filter' => ['discussion' => 1]]),
        );
    }

    #[Test]
    public function showing_a_discussion_does_not_look_up_each_upload_on_its_own()
    {
        $this->assertLooksUpUploadsAtOnce(
            $this->request('GET', '/api/discussions/2'),
            $this->request('GET', '/api/discussions/1'),
        );
    }

    #[Test]
    public function listing_discussions_with_their_first_and_last_posts_does_not_look_up_each_upload_on_its_own()
    {
        $this->assertLooksUpUploadsAtOnce(
            $this->request('GET', '/api/discussions')->withQueryParams(['include' => 'firstPost,lastPost', 'sort' => '-lastPostedAt', 'page' => ['limit' => 1]]),
            $this->request('GET', '/api/discussions')->withQueryParams(['include' => 'firstPost,lastPost', 'sort' => '-lastPostedAt']),
        );
    }

    #[Test]
    public function opening_a_discussion_page_does_not_look_up_each_upload_on_its_own()
    {
        $this->assertLooksUpUploadsAtOnce(
            $this->request('GET', '/d/2'),
            $this->request('GET', '/d/1'),
        );
    }

    /**
     * A page with many posts and uploads, of every kind, takes no more queries
     * to render them than a page with few.
     */
    protected function assertLooksUpUploadsAtOnce(ServerRequestInterface $few, ServerRequestInterface $many): void
    {
        $forFew = $this->uploadQueries($few);
        $forMany = $this->uploadQueries($many);

        $this->assertSame(
            $forFew['files'],
            $forMany['files'],
            "Looking files up took {$forFew['files']} queries for a few uploads and {$forMany['files']} for many"
            ." (and loading their downloads {$forFew['downloads']} and {$forMany['downloads']})."
        );
        $this->assertSame(0, $forMany['downloads'], 'Rendering uploads loaded their downloads, which it does not use.');
    }

    /**
     * How many queries a request ran against the files and their downloads.
     *
     * @return array{files: int, downloads: int}
     */
    protected function uploadQueries(ServerRequestInterface $request): array
    {
        $database = $this->database();

        // send() keeps the log for us when it was already on.
        $database->enableQueryLog();

        try {
            $response = $this->send($request);
            $queries = array_column($database->getQueryLog(), 'query');
        } finally {
            $database->disableQueryLog();
            $database->flushQueryLog();
        }

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());

        return [
            'files'     => count(array_filter($queries, fn (string $sql) => str_contains($sql, '`fof_upload_files`'))),
            'downloads' => count(array_filter($queries, fn (string $sql) => str_contains($sql, '`fof_upload_downloads`'))),
        ];
    }

    /**
     * Every post's rendered HTML, by id, as an actor sees them.
     *
     * @return array<int, string>
     */
    protected function renderedPosts(?int $actorId = null): array
    {
        $posts = [];

        foreach ([1, 2, 3] as $discussionId) {
            $posts += $this->postsIn(
                $this->request('GET', '/api/posts', $actorId ? ['authenticatedAs' => $actorId] : [])
                    ->withQueryParams(['filter' => ['discussion' => $discussionId]])
            );
        }

        ksort($posts);

        return $posts;
    }

    /** @return array<int, string> */
    protected function postsIn(ServerRequestInterface $request): array
    {
        $response = $this->send($request);

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());

        return $this->postsInDocument(json_decode((string) $response->getBody(), true));
    }

    /** @return array<int, string> */
    protected function postsOnForumPage(string $path): array
    {
        $response = $this->send($this->request('GET', $path));
        $body = (string) $response->getBody();

        $this->assertSame(200, $response->getStatusCode(), $body);
        $this->assertSame(1, preg_match('#<script id="flarum-json-payload" type="application/json">(.*?)</script>#s', $body, $payload));

        return $this->postsInDocument(json_decode($payload[1], true)['apiDocument']);
    }

    /** @return array<int, string> */
    protected function postsInDocument(array $document): array
    {
        $resources = isset($document['data']['type']) ? [$document['data']] : $document['data'];
        $posts = [];

        foreach (array_merge($resources, $document['included'] ?? []) as $resource) {
            if ($resource['type'] === 'posts' && isset($resource['attributes']['contentHtml'])) {
                $posts[(int) $resource['id']] = $resource['attributes']['contentHtml'];
            }
        }

        ksort($posts);

        return $posts;
    }

    protected function expectedImage(?int $id, string $href, string $src, string $title, string $alt, string $width, string $height): array
    {
        return [
            'href'  => $href, 'src' => $src, 'title' => $title, 'alt' => $alt,
            'uuid'  => $id === null ? '' : $this->uuid($id), 'width' => $width, 'height' => $height,
        ];
    }

    /** What a post's image previews show. */
    protected function imagePreviews(string $html): array
    {
        return array_map(function (DOMElement $link) {
            $image = $link->getElementsByTagName('img')->item(0);

            return [
                'href'   => $link->getAttribute('href'),
                'src'    => $image->getAttribute('src'),
                'title'  => $image->getAttribute('title'),
                'alt'    => $image->getAttribute('alt'),
                'uuid'   => $image->getAttribute('data-id'),
                'width'  => $image->getAttribute('width'),
                'height' => $image->getAttribute('height'),
            ];
        }, $this->find($html, '//a[contains(@class, "FoFUpload--Upl-Image-Preview-Link")]'));
    }

    /** What a post's text previews show. */
    protected function textPreviews(string $html): array
    {
        return array_map(fn (DOMElement $figure) => [
            'label'      => $this->textOf($figure, './/*[contains(@class, "FofUpload-TextPreviewLabel")]'),
            'hasSnippet' => $figure->getAttribute('data-hassnippet'),
            'snippet'    => $this->textOf($figure, './/code'),
            'download'   => $this->attributeOf($figure, './/a[contains(@class, "FofUpload-TextPreviewDownload")]', 'href'),
        ], $this->find($html, '//figure[contains(@class, "FofUpload-TextPreview")]'));
    }

    /** What a post's file embeds show. */
    protected function fileEmbeds(string $html): array
    {
        return array_map(fn (DOMElement $group) => [
            'uuid'  => $group->getAttribute('data-fof-upload-download-uuid'),
            'label' => $this->textOf($group, './/*[contains(@class, "fof-upload-download-label")]'),
            'size'  => $this->textOf($group, './div[last()]'),
        ], $this->find($html, '//*[@data-fof-upload-download-uuid]'));
    }

    /** @return DOMElement[] */
    private function find(string $html, string $query): array
    {
        $document = new DOMDocument();
        $document->loadHTML('<?xml encoding="utf-8"?><body>'.$html.'</body>', LIBXML_NOERROR);
        $this->xpath = new DOMXPath($document);

        return iterator_to_array($this->xpath->query($query));
    }

    private function textOf(DOMElement $context, string $query): string
    {
        return trim($this->xpath->query($query, $context)->item(0)?->textContent ?? '');
    }

    private function attributeOf(DOMElement $context, string $query, string $attribute): string
    {
        $element = $this->xpath->query($query, $context)->item(0);

        return $element instanceof DOMElement ? $element->getAttribute($attribute) : '';
    }

    protected function discussion(int $id, string $title, int $firstPostId, int $lastPostId, int $comments): array
    {
        return [
            'id'             => $id, 'title' => $title, 'user_id' => 2, 'created_at' => '2026-01-01 00:00:00',
            'first_post_id'  => $firstPostId, 'last_post_id' => $lastPostId,
            'last_posted_at' => sprintf('2026-01-01 00:%02d:00', $lastPostId),
            'comment_count'  => $comments, 'last_post_number' => $comments,
        ];
    }

    protected function post(int $id, int $discussionId, int $number, int $userId, string $content): array
    {
        return [
            'id'         => $id, 'discussion_id' => $discussionId, 'number' => $number, 'user_id' => $userId,
            'type'       => 'comment', 'content' => "<r>$content</r>",
            'created_at' => sprintf('2026-01-01 00:%02d:00', $id),
        ];
    }

    protected function upload(int $id, string $name, string $method, array $extra = []): array
    {
        return $extra + [
            'id'            => $id, 'uuid' => $this->uuid($id),
            'base_name'     => $name, 'path' => "files/$name", 'url' => $this->storedUrl($name, $method),
            'type'          => [
                'png' => 'image/png', 'jpg' => 'image/jpeg', 'zip' => 'application/zip', 'txt' => 'text/plain',
            ][pathinfo($name, PATHINFO_EXTENSION)],
            'size'          => 1000, 'upload_method' => $method, 'actor_id' => 2,
            'shared'        => false, 'created_at' => '2026-01-01 00:00:00',
        ];
    }

    /** Where a file was when it was uploaded, before the forum moved it. */
    protected function storedUrl(string $name, string $method): string
    {
        return $method === 'local'
            ? "https://old-host.example.com/assets/files/files/$name"
            : "https://bucket.s3.eu-west-1.amazonaws.com/files/$name";
    }

    protected function uuid(int $id): string
    {
        return sprintf('00000000-0000-0000-0000-%012d', $id);
    }

    /** An image preview as stored, with the URLs it had when it was posted. */
    protected function image(int $id, ?string $alt = null): string
    {
        $uuid = $this->uuid($id);
        $altAttribute = $alt === null ? '' : ' alt="'.htmlspecialchars($alt).'"';
        $altBbcode = $alt === null ? '' : " alt=$alt";

        return "<UPL-IMAGE-PREVIEW$altAttribute thumbnail_url=\"https://old.example.com/$id-thumb\" url=\"https://old.example.com/$id\" uuid=\"$uuid\">"
            ."[upl-image-preview uuid=$uuid url=https://old.example.com/$id$altBbcode thumbnail_url=https://old.example.com/$id-thumb]</UPL-IMAGE-PREVIEW>";
    }

    /** An image preview as stored before #420 gave them a uuid. */
    protected function legacyImage(string $name): string
    {
        $url = $this->storedUrl($name, 'local');

        return "<UPL-IMAGE-PREVIEW url=\"$url\">[upl-image-preview url=$url]</UPL-IMAGE-PREVIEW>";
    }

    protected function file(int $id, string $label): string
    {
        $uuid = $this->uuid($id);

        return "<UPL-FILE size=\"2MB\" uuid=\"$uuid\"><s>[upl-file uuid=$uuid size=2MB]</s>$label<e>[/upl-file]</e></UPL-FILE>";
    }

    protected function text(int $id, string $label): string
    {
        $uuid = $this->uuid($id);

        return "<UPL-TEXT-PREVIEW url=\"https://old.example.com/$id\" uuid=\"$uuid\"><s>[upl-text-preview uuid=$uuid url=https://old.example.com/$id]</s>$label<e>[/upl-text-preview]</e></UPL-TEXT-PREVIEW>";
    }

    protected function localFiles(): string
    {
        return $this->app()->getContainer()->make(Paths::class)->public.'/assets/files/files';
    }
}
