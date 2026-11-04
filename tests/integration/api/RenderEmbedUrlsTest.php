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
use Flarum\Foundation\Paths;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;

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
    protected $posts = [];

    /** @var array<int, array> */
    protected $files = [];

    /** @var array<string, string> */
    protected $onDisk = [];

    /** @var bool */
    protected $seeded = false;

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

    /** @test */
    public function an_image_preview_of_no_known_file_does_not_show_the_url_it_was_posted_with()
    {
        $this->givenPost(1, $this->imagePreview(self::ELSEWHERE, 404));

        $this->assertSame([], $this->urlsIn(1));
    }

    /** @test */
    public function an_image_preview_from_before_uuids_whose_file_is_gone_keeps_a_url_on_the_forums_own_storage()
    {
        $this->setting('fof-upload.awsS3Region', 'eu-west-1');
        $this->setting('fof-upload.awsS3Bucket', 'bucket');
        $this->setting('fof-upload.cdnUrl', 'https://cdn.example.com');

        $this->givenPost(1, $this->imagePreview(self::LOCAL.'/gone.png', null));
        $this->givenPost(2, $this->imagePreview('https://cdn.example.com/files/gone.png', null));
        $this->givenPost(3, $this->imagePreview(self::ELSEWHERE, null));

        $this->assertSame([self::LOCAL.'/gone.png'], $this->urlsIn(1));
        $this->assertSame(['https://cdn.example.com/files/gone.png'], $this->urlsIn(2));
        $this->assertSame([], $this->urlsIn(3));
    }

    /** @test */
    public function an_image_preview_of_a_file_on_an_adapter_without_urls_shows_the_files_own_url()
    {
        $this->setting('fof-upload.imgurClientId', 'client-id');
        $this->givenFile(5, 'kept-by-imgur.png', 'imgur');
        $this->givenPost(1, $this->imagePreview(self::ELSEWHERE, 5));

        $this->assertSame([self::STORED.'/kept-by-imgur.png'], $this->urlsIn(1));
    }

    /** @test */
    public function an_image_preview_of_a_file_whose_adapter_is_not_set_up_still_renders()
    {
        $this->givenFile(6, 'imgur-no-longer-set-up.png', 'imgur');
        $this->givenPost(1, $this->imagePreview(self::ELSEWHERE, 6));

        $this->assertSame([self::STORED.'/imgur-no-longer-set-up.png'], $this->urlsIn(1));
    }

    /** @test */
    public function a_text_previews_link_comes_from_its_file()
    {
        $this->givenFile(7, 'notes.txt');
        $this->onDisk['notes.txt'] = "one\ntwo\n";
        $this->givenPost(1, $this->textPreview(self::ELSEWHERE, 7));
        $this->givenPost(2, $this->textPreview(self::ELSEWHERE, 404));

        $this->assertSame([self::LOCAL.'/notes.txt'], $this->urlsIn(1));
        $this->assertSame([], $this->urlsIn(2));
    }

    /** @test */
    public function an_image_cards_background_comes_from_its_file()
    {
        $this->givenFile(8, 'holiday.png');
        $this->givenPost(1, $this->imageCard(self::ELSEWHERE, 8));
        $this->givenPost(2, $this->imageCard(self::ELSEWHERE, 404));

        $this->assertSame([self::LOCAL.'/holiday.png'], $this->urlsIn(1));
        $this->assertSame([], $this->urlsIn(2));
    }

    /** @test */
    public function an_image_card_of_a_file_on_s3_still_renders_after_s3_is_unconfigured()
    {
        $this->givenFile(10, 'on-s3.png', 'aws-s3');
        $this->givenPost(1, $this->imageCard(self::ELSEWHERE, 10));

        $this->assertSame([self::STORED.'/on-s3.png'], $this->urlsIn(1));
    }

    /** @test */
    public function an_image_card_on_s3_behind_a_custom_url_ending_in_a_slash_has_no_double_slash()
    {
        $this->setting('fof-upload.awsS3Region', 'eu-west-1');
        $this->setting('fof-upload.awsS3Bucket', 'bucket');
        $this->setting('fof-upload.awsS3CustomUrl', 'https://cdn.example.com/');
        $this->givenFile(11, 'on-s3.png', 'aws-s3');
        $this->givenPost(1, $this->imageCard(self::ELSEWHERE, 11));

        $this->assertSame(['https://cdn.example.com/files/on-s3.png'], $this->urlsIn(1));
    }

    /** @test */
    public function an_image_card_of_a_file_on_s3_shows_its_stored_url_once_the_bucket_is_removed()
    {
        $this->setting('fof-upload.awsS3Region', 'eu-west-1');
        $this->givenFile(20, 'on-s3.png', 'aws-s3');
        $this->givenPost(1, $this->imageCard(self::ELSEWHERE, 20));

        $this->assertSame([self::STORED.'/on-s3.png'], $this->urlsIn(1));
    }

    /** @test */
    public function an_image_card_of_a_file_on_s3_shows_its_stored_url_once_the_bucket_is_cleared()
    {
        $this->setting('fof-upload.awsS3Region', 'eu-west-1');
        $this->setting('fof-upload.awsS3Bucket', '');
        $this->givenFile(21, 'on-s3.png', 'aws-s3');
        $this->givenPost(1, $this->imageCard(self::ELSEWHERE, 21));

        $this->assertSame([self::STORED.'/on-s3.png'], $this->urlsIn(1));
    }

    /** @test */
    public function urls_built_from_the_file_record_are_encoded_like_posted_ones()
    {
        $this->setting('fof-upload.awsS3Region', 'eu-west-1');
        $this->setting('fof-upload.awsS3Bucket', 'bucket');
        $this->setting('fof-upload.awsS3CustomUrl', "https://cdn.example.com/team's(media)");
        $this->givenFile(22, 'on-s3.png', 'aws-s3');
        $this->givenPost(1, $this->imageCard(self::ELSEWHERE, 22));
        $this->givenPost(2, $this->imagePreview(self::ELSEWHERE, 22));

        $url = 'https://cdn.example.com/team%27s%28media%29/files/on-s3.png';
        $this->assertSame([$url], $this->urlsIn(1));
        $this->assertSame([$url], $this->urlsIn(2));
    }

    /** @test */
    public function urls_built_from_the_file_record_keep_an_ipv6_host()
    {
        $this->setting('fof-upload.awsS3Region', 'eu-west-1');
        $this->setting('fof-upload.awsS3Bucket', 'bucket');
        $this->setting('fof-upload.awsS3CustomUrl', 'http://[::1]:9000/media');
        $this->givenFile(23, 'on-s3.png', 'aws-s3');
        $this->givenPost(1, $this->imageCard(self::ELSEWHERE, 23));

        $this->assertSame(['http://[::1]:9000/media/files/on-s3.png'], $this->urlsIn(1));
    }

    /** @test */
    public function an_image_preview_from_before_uuids_is_matched_to_storage_whose_url_the_parser_encoded()
    {
        $this->setting('fof-upload.awsS3Region', 'eu-west-1');
        $this->setting('fof-upload.awsS3Bucket', 'bucket');
        $this->setting('fof-upload.awsS3CustomUrl', "https://cdn.example.com/team's(media)");
        $posted = 'https://cdn.example.com/team%27s%28media%29/files/gone.png';
        $this->givenPost(1, $this->imagePreview($posted, null));

        $this->assertSame([$posted], $this->urlsIn(1));
    }

    /** @test */
    public function an_image_preview_from_before_uuids_whose_file_is_found_by_url_shows_the_files_url()
    {
        $this->givenFile(24, 'by-url.png');
        $this->givenPost(1, $this->imagePreview(self::STORED.'/by-url.png', null));

        $this->assertSame([self::LOCAL.'/by-url.png'], $this->urlsIn(1));
    }

    /** @test */
    public function an_image_card_finds_its_file_whatever_the_case_of_its_uuid()
    {
        $uuid = 'abcdef00-0000-0000-0000-000000000025';
        $this->givenFile(25, 'holiday.png');
        $this->files[25]['uuid'] = $uuid;
        $this->givenPost(1, str_replace($this->uuid(25), strtoupper($uuid), $this->imageCard(self::ELSEWHERE, 25)));

        $this->assertSame([self::LOCAL.'/holiday.png'], $this->urlsIn(1));
    }

    /** @test */
    public function an_image_card_of_a_file_with_no_recorded_upload_method_shows_its_stored_url()
    {
        $this->givenFile(12, 'no-method.png', null);
        $this->givenPost(1, $this->imageCard(self::ELSEWHERE, 12));

        $this->assertSame([self::STORED.'/no-method.png'], $this->urlsIn(1));
    }

    /** @test */
    public function an_image_preview_from_before_uuids_on_the_local_cdn_is_kept_without_s3()
    {
        $this->setting('fof-upload.cdnUrl', 'https://cdn.example.com');
        $this->givenPost(1, $this->imagePreview('https://cdn.example.com/assets/files/gone.png', null));

        $this->assertSame(['https://cdn.example.com/assets/files/gone.png'], $this->urlsIn(1));
    }

    /** @test */
    public function an_image_preview_naming_a_missing_file_by_uuid_drops_even_a_url_on_the_forums_storage()
    {
        $this->givenPost(1, $this->imagePreview(self::LOCAL.'/someone-elses.png', 404));

        $this->assertSame([], $this->urlsIn(1));
    }

    /** @test */
    public function an_image_preview_from_before_uuids_on_a_lookalike_host_is_dropped()
    {
        $this->setting('fof-upload.cdnUrl', 'https://cdn.example.com');
        $this->givenPost(1, $this->imagePreview('https://cdn.example.com.elsewhere.example/assets/files/x.png', null));
        $this->givenPost(2, $this->imagePreview('https://cdn.example.com/assets/filesystem/x.png', null));

        $this->assertSame([], $this->urlsIn(1));
        $this->assertSame([], $this->urlsIn(2));
    }

    /** @test */
    public function a_text_preview_of_a_missing_file_offers_no_snippet_to_expand()
    {
        $this->givenPost(1, $this->textPreview(self::ELSEWHERE, 404));

        $this->assertStringContainsString('data-hassnippet="false"', $this->renderedHtml(1));
    }

    /** @test */
    public function local_files_behind_the_local_cdn_are_shown_from_the_cdn()
    {
        $this->setting('fof-upload.cdnUrl', 'https://cdn.example.com/');
        $this->givenFile(26, 'holiday.png');
        $this->givenFile(27, 'notes.txt');
        $this->onDisk['notes.txt'] = "one\ntwo\n";
        $this->givenPost(1, $this->imageCard(self::ELSEWHERE, 26));
        $this->givenPost(2, $this->imagePreview(self::ELSEWHERE, 26));
        $this->givenPost(3, $this->textPreview(self::ELSEWHERE, 27));

        $this->assertSame(['https://cdn.example.com/assets/files/files/holiday.png'], $this->urlsIn(1));
        $this->assertSame(['https://cdn.example.com/assets/files/files/holiday.png'], $this->urlsIn(2));
        $this->assertSame(['https://cdn.example.com/assets/files/files/notes.txt'], $this->urlsIn(3));
    }

    /** @test */
    public function a_text_preview_of_a_file_gone_from_disk_still_renders_without_a_snippet()
    {
        $this->givenFile(28, 'gone.txt');
        $this->givenPost(1, $this->textPreview(self::ELSEWHERE, 28));

        $html = $this->renderedHtml(1);
        $this->assertStringContainsString('data-hassnippet="false"', $html);
        $this->assertSame([self::LOCAL.'/gone.txt'], $this->urlsIn(1));
    }

    /** @test */
    public function a_post_with_several_image_cards_looks_their_files_up_together()
    {
        $this->givenFile(13, 'one.png');
        $this->givenFile(14, 'two.png');
        $this->givenFile(15, 'three.png');
        $this->givenPost(1, $this->imageCard(self::ELSEWHERE, 13).$this->imageCard(self::ELSEWHERE, 14).$this->imageCard(self::ELSEWHERE, 15));
        $this->renderedHtml(1);

        $database = $this->database();
        $database->flushQueryLog();
        $database->enableQueryLog();
        $this->renderedHtml(1);
        $queries = array_column($database->getQueryLog(), 'query');
        $database->disableQueryLog();

        $selects = array_filter($queries, fn (string $sql) => stripos(ltrim($sql), 'select') === 0);
        $this->assertCount(1, array_filter($selects, fn (string $sql) => str_contains($sql, 'fof_upload_files')), implode("\n", $selects));
        $this->assertCount(0, array_filter($selects, fn (string $sql) => str_contains($sql, 'fof_upload_downloads')), implode("\n", $selects));
    }

    protected function givenPost(int $id, string $content): void
    {
        $this->posts[$id] = $content;
    }

    protected function givenFile(int $id, string $name, ?string $method = 'local'): void
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
    protected function urlsIn(int $postId): array
    {
        $document = new DOMDocument();
        $document->loadHTML('<?xml encoding="utf-8"?><body>'.$this->renderedHtml($postId).'</body>', LIBXML_NOERROR);
        $urls = [];

        foreach ((new DOMXPath($document))->query('//@src | //@href | //@style') as $attribute) {
            $value = $attribute->nodeName === 'style'
                ? (preg_match('/url\(([^)]*)\)/', $attribute->nodeValue, $m) ? trim($m[1], '\'" ') : '')
                : $attribute->nodeValue;

            if ($value !== '') {
                $urls[] = $value;
            }
        }

        // Text previews hand their URL to an inline script.
        foreach ((new DOMXPath($document))->query('//script') as $script) {
            if (preg_match("/new URL\\('([^']*)'\\)/", $script->textContent, $m) && $m[1] !== '') {
                $urls[] = $m[1];
            }
        }

        return array_values(array_unique($urls));
    }

    protected function renderedHtml(int $postId): string
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

        return json_decode($body, true)['data']['attributes']['contentHtml'];
    }

    protected function seed(): void
    {
        $this->prepareDatabase([
            'users'       => [$this->normalUser()],
            'discussions' => [
                ['id' => 1, 'title' => 'Uploads', 'user_id' => 2, 'created_at' => '2026-01-01 00:00:00', 'first_post_id' => 1, 'comment_count' => count($this->posts), 'last_post_number' => count($this->posts)],
            ],
            'posts' => array_map(fn (int $id) => [
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

        return "<UPL-IMAGE-PREVIEW url=\"$url\" uuid=\"$uuid\">[upl-image-preview uuid=$uuid url=$url]</UPL-IMAGE-PREVIEW>";
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
