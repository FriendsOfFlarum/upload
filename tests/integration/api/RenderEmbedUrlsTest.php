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
use DOMXPath;
use Flarum\Discussion\Discussion;
use Flarum\Foundation\Paths;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\Test;

/**
 * The URLs a post's uploads render come from the files they name, never from
 * the URL typed into the post, so a post cannot make readers' browsers load
 * another site.
 */
class RenderEmbedUrlsTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected const ELSEWHERE = 'https://elsewhere.example.com/pixel.png';
    protected const STORED = 'https://old-host.example.com/assets/files/files';
    protected const LOCAL = 'http://localhost/assets/files/files';

    /** @var array<int, string> */
    protected array $posts = [];

    /** @var array<int, array> */
    protected array $files = [];

    /** @var array<string, string> */
    protected array $onDisk = [];

    protected bool $seeded = false;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');
    }

    public function tearDown(): void
    {
        foreach (array_keys($this->onDisk) as $name) {
            @unlink($this->localFiles()."/$name");
        }

        parent::tearDown();
    }

    #[Test]
    public function an_image_preview_of_no_known_file_does_not_show_the_url_it_was_posted_with()
    {
        $this->givenPost(1, $this->imagePreview(self::ELSEWHERE, 404));

        $this->assertSame([], $this->urlsIn(1));
    }

    #[Test]
    public function an_image_preview_from_before_uuids_whose_file_is_gone_keeps_a_url_on_the_forums_own_storage()
    {
        $this->setting('fof-upload.awsS3Region', 'eu-west-1');
        $this->setting('fof-upload.awsS3Bucket', 'bucket');
        $this->setting('fof-upload.cdnUrl', 'https://cdn.example.com');

        $this->givenPost(1, $this->imagePreview(self::LOCAL.'/gone.png', null));
        $this->givenPost(2, $this->imagePreview('https://cdn.example.com/files/gone.png', null));
        $this->givenPost(3, $this->imagePreview(self::ELSEWHERE, null));

        // The link and the image itself.
        $this->assertSame([self::LOCAL.'/gone.png', self::LOCAL.'/gone.png'], $this->urlsIn(1, unique: false));
        $this->assertSame(['https://cdn.example.com/files/gone.png'], $this->urlsIn(2));
        $this->assertSame([], $this->urlsIn(3));
    }

    #[Test]
    public function an_image_preview_of_a_file_on_an_adapter_without_urls_shows_the_files_own_url()
    {
        $this->setting('fof-upload.imgurClientId', 'client-id');
        $this->givenFile(5, 'kept-by-imgur.png', 'imgur');
        $this->givenPost(1, $this->imagePreview(self::ELSEWHERE, 5));

        $this->assertSame([self::STORED.'/kept-by-imgur.png'], $this->urlsIn(1));
    }

    #[Test]
    public function a_text_previews_link_comes_from_its_file()
    {
        $this->setting('fof-upload.imgurClientId', 'client-id');
        $this->givenFile(7, 'notes.txt');
        $this->givenFile(9, 'imgur-notes.txt', 'imgur');
        $this->onDisk['notes.txt'] = "one\ntwo\n";
        $this->givenPost(1, $this->textPreview(self::ELSEWHERE, 7));
        $this->givenPost(2, $this->textPreview(self::ELSEWHERE, 404));
        $this->givenPost(3, $this->textPreview(self::ELSEWHERE, 9));

        $this->assertSame([self::LOCAL.'/notes.txt'], $this->urlsIn(1));
        $this->assertSame([], $this->urlsIn(2));
        $this->assertSame([self::STORED.'/imgur-notes.txt'], $this->urlsIn(3));
    }

    #[Test]
    public function an_image_cards_background_comes_from_its_file()
    {
        $this->givenFile(8, 'holiday.png');
        $this->givenPost(1, $this->imageCard(self::ELSEWHERE, 8));
        $this->givenPost(2, $this->imageCard(self::ELSEWHERE, 404));

        $this->assertSame([self::LOCAL.'/holiday.png'], $this->urlsIn(1));
        $this->assertSame([], $this->urlsIn(2));
    }

    #[Test]
    public function an_image_card_of_a_file_on_s3_still_renders_after_s3_is_unconfigured()
    {
        $this->givenFile(10, 'on-s3.png', 'aws-s3');
        $this->givenPost(1, $this->imageCard(self::ELSEWHERE, 10));

        $this->assertSame([self::STORED.'/on-s3.png'], $this->urlsIn(1));
    }

    protected function givenPost(int $id, string $content): void
    {
        $this->posts[$id] = $content;
    }

    protected function givenFile(int $id, string $name, string $method = 'local'): void
    {
        $this->files[$id] = [
            'id'            => $id, 'uuid' => $this->uuid($id), 'base_name' => $name, 'path' => "files/$name",
            'url'           => self::STORED."/$name", 'type' => 'image/png', 'size' => 1000,
            'upload_method' => $method, 'actor_id' => 2, 'shared' => false, 'created_at' => '2026-01-01 00:00:00',
        ];
    }

    /**
     * Every URL the rendered post would load or link to.
     *
     * @return string[]
     */
    protected function urlsIn(int $postId, bool $unique = true): array
    {
        if (!$this->seeded) {
            $this->seed();
            $this->seeded = true;

            @mkdir($this->localFiles(), 0777, true);

            foreach ($this->onDisk as $name => $contents) {
                file_put_contents($this->localFiles()."/$name", $contents);
            }
        }

        $response = $this->send($this->request('GET', "/api/posts/$postId"));
        $body = (string) $response->getBody();
        $this->assertSame(200, $response->getStatusCode(), $body);
        $html = json_decode($body, true)['data']['attributes']['contentHtml'];

        $document = new DOMDocument();
        $document->loadHTML('<?xml encoding="utf-8"?><body>'.$html.'</body>', LIBXML_NOERROR);
        $urls = [];

        foreach ((new DOMXPath($document))->query('//@src | //@href | //@style') as $attribute) {
            $value = $attribute->nodeName === 'style'
                ? (preg_match('/url\(([^)]*)\)/', $attribute->nodeValue, $m) ? trim($m[1], '\'" ') : '')
                : $attribute->nodeValue;

            if ($value !== '') {
                $urls[] = $value;
            }
        }

        return $unique ? array_values(array_unique($urls)) : $urls;
    }

    protected function seed(): void
    {
        $this->prepareDatabase([
            User::class       => [$this->normalUser()],
            Discussion::class => [
                ['id' => 1, 'title' => 'Uploads', 'user_id' => 2, 'created_at' => '2026-01-01 00:00:00', 'first_post_id' => 1, 'comment_count' => count($this->posts), 'last_post_number' => count($this->posts)],
            ],
            Post::class => array_map(fn (int $id) => [
                'id'      => $id, 'discussion_id' => 1, 'number' => $id, 'user_id' => 2, 'type' => 'comment',
                'content' => '<r>'.$this->posts[$id].'</r>', 'created_at' => '2026-01-01 00:00:00',
            ], array_keys($this->posts)),
            'fof_upload_files' => array_values($this->files),
        ]);
    }

    protected function localFiles(): string
    {
        return $this->app()->getContainer()->make(Paths::class)->public.'/assets/files/files';
    }

    protected function uuid(int $id): string
    {
        return sprintf('00000000-0000-0000-0000-%012d', $id);
    }

    protected function imagePreview(string $url, ?int $fileId): string
    {
        if ($fileId === null) {
            return "<UPL-IMAGE-PREVIEW url=\"$url\">[upl-image-preview url=$url]</UPL-IMAGE-PREVIEW>";
        }

        $uuid = $this->uuid($fileId);

        return "<UPL-IMAGE-PREVIEW thumbnail_url=\"$url\" url=\"$url\" uuid=\"$uuid\">[upl-image-preview uuid=$uuid url=$url thumbnail_url=$url]</UPL-IMAGE-PREVIEW>";
    }

    protected function textPreview(string $url, int $fileId): string
    {
        $uuid = $this->uuid($fileId);

        return "<UPL-TEXT-PREVIEW url=\"$url\" uuid=\"$uuid\"><s>[upl-text-preview uuid=$uuid url=$url]</s>notes.txt<e>[/upl-text-preview]</e></UPL-TEXT-PREVIEW>";
    }

    protected function imageCard(string $url, int $fileId): string
    {
        $uuid = $this->uuid($fileId);

        return "<UPL-IMAGE size=\"1kB\" url=\"$url\" uuid=\"$uuid\"><s>[upl-image uuid=$uuid size=1kB url=$url]</s>holiday.png<e>[/upl-image]</e></UPL-IMAGE>";
    }
}
