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
use Flarum\User\User;
use FoF\Upload\File;
use FoF\Upload\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

/**
 * A text preview shows the first lines of its file. They're worked out once —
 * at upload, or on the first render for files from before — and kept on the
 * file, so rendering a post never reads storage again. A file that can't be
 * read renders without a snippet rather than failing the page.
 */
class TextPreviewSnippetTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;
    use UploadFileTrait;
    use FakeS3Storage;

    private string $lastBody = '';

    private const SEVEN_LINES = "l1\nl2\n\nl3\nl4\nl5\nl6\nl7\n";

    /** @var array<int, array{string, string}> post/file id => [name, upload method] */
    private const FILES = [
        1 => ['stored.txt', 'local'],
        2 => ['stored-s3.txt', 'aws-s3'],
        3 => ['legacy.txt', 'local'],
        4 => ['legacy-s3.txt', 'aws-s3'],
        5 => ['missing.txt', 'local'],
        6 => ['missing-s3.txt', 'aws-s3'],
        7 => ['huge.txt', 'local'],
        8 => ['private.txt', 'private-shared'],
    ];

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');
        $this->useFakeS3();

        $files = [];
        $posts = [];

        foreach (self::FILES as $id => [$name, $method]) {
            $uuid = "text-$id";
            $files[] = [
                'id'            => $id, 'uuid' => $uuid, 'base_name' => $name, 'path' => "text/$name",
                'url'           => "https://old.example.com/$name", 'type' => 'text/plain', 'size' => 10,
                'upload_method' => $method, 'actor_id' => $method === 'private-shared' ? null : 2,
                'shared'        => $method === 'private-shared', 'hidden' => $method === 'private-shared',
                'created_at'    => '2026-01-01 00:00:00',
            ] + ($id <= 2 ? ['text_snippet' => "kept\nsnippet", 'text_snippet_has_more' => true] : []);

            $posts[] = [
                'id'         => $id, 'discussion_id' => 1, 'number' => $id, 'user_id' => 2, 'type' => 'comment',
                'content'    => "<r><UPL-TEXT-PREVIEW url=\"https://old.example.com/$name\" uuid=\"$uuid\"><s>[upl-text-preview uuid=$uuid url=https://old.example.com/$name]</s>$name<e>[/upl-text-preview]</e></UPL-TEXT-PREVIEW></r>",
                'created_at' => sprintf('2026-01-01 00:%02d:00', $id),
            ];
        }

        $this->prepareDatabase([
            User::class       => [$this->normalUser()],
            Discussion::class => [
                ['id' => 1, 'title' => 'Text', 'user_id' => 2, 'first_post_id' => 1, 'last_post_id' => 8, 'comment_count' => 8, 'created_at' => '2026-01-01 00:00:00'],
            ],
            Post::class        => $posts,
            'fof_upload_files' => $files,
        ]);
    }

    protected function tearDown(): void
    {
        foreach (self::FILES as [$name]) {
            @unlink($this->publicPath("text/$name"));
            @unlink($this->privatePath("text/$name"));
        }

        parent::tearDown();
    }

    private function publicPath(string $path): string
    {
        return $this->app()->getContainer()->make(Paths::class)->public.'/assets/files/'.$path;
    }

    private function privatePath(string $path): string
    {
        return $this->app()->getContainer()->make(Paths::class)->storage.'/private-shared/files/'.$path;
    }

    private function put(string $path, string $contents): void
    {
        @mkdir(dirname($path), 0777, true);
        file_put_contents($path, $contents);
    }

    /**
     * @return array{status: int, hasSnippet: ?string, snippet: ?string}
     */
    private function render(int $postId): array
    {
        $response = $this->send($this->request('GET', "/api/posts/$postId", ['authenticatedAs' => 1]));
        $body = (string) $response->getBody();
        $this->lastBody = $body;
        $html = json_decode($body, true)['data']['attributes']['contentHtml'] ?? '';

        $dom = new DOMDocument();
        @$dom->loadHTML('<?xml encoding="utf-8"?><body>'.$html.'</body>');
        $figure = (new DOMXPath($dom))->query('//figure[contains(@class, "FofUpload-TextPreview")]')->item(0);

        return [
            'status'     => $response->getStatusCode(),
            'hasSnippet' => $figure?->getAttribute('data-hassnippet'),
            'snippet'    => $figure ? (new DOMXPath($dom))->query('.//code', $figure)->item(0)?->textContent : null,
        ];
    }

    private function storageReads(): int
    {
        return count($this->s3Keys('GetObject'));
    }

    #[Test]
    public function a_stored_snippet_is_shown_without_reading_local_storage(): void
    {
        // No file on disk at all: only the stored snippet can produce this.
        $this->assertSame(['status' => 200, 'hasSnippet' => 'true', 'snippet' => "kept\nsnippet"], $this->render(1), $this->lastBody);
    }

    #[Test]
    public function a_stored_snippet_is_shown_without_reading_the_bucket(): void
    {
        $this->assertSame(['status' => 200, 'hasSnippet' => 'true', 'snippet' => "kept\nsnippet"], $this->render(2), $this->lastBody);
        $this->assertSame([], $this->s3Commands, 'Nothing is sent to S3');
    }

    public static function legacyFiles(): array
    {
        return ['local disk' => [3], 'S3' => [4], 'private shared' => [8]];
    }

    #[Test]
    #[DataProvider('legacyFiles')]
    public function a_file_from_before_is_read_once_and_its_snippet_kept(int $id): void
    {
        [$name, $method] = self::FILES[$id];
        $this->app();

        match ($method) {
            'aws-s3'         => $this->s3Objects["text/$name"] = self::SEVEN_LINES,
            'private-shared' => $this->put($this->privatePath("text/$name"), self::SEVEN_LINES),
            default          => $this->put($this->publicPath("text/$name"), self::SEVEN_LINES),
        };

        $expected = ['status' => 200, 'hasSnippet' => 'true', 'snippet' => "l1\nl2\nl3\nl4\nl5"];

        $this->assertSame($expected, $this->render($id), $this->lastBody);

        $file = File::find($id);
        $this->assertSame("l1\nl2\nl3\nl4\nl5", $file->text_snippet);
        $this->assertTrue((bool) $file->text_snippet_has_more);

        // Gone from storage: the second render can only be using what was kept.
        $this->s3Objects = [];
        @unlink($this->publicPath("text/$name"));
        @unlink($this->privatePath("text/$name"));
        $reads = $this->storageReads();

        $database = $this->database();
        $database->flushQueryLog();
        $database->enableQueryLog();
        $this->assertSame($expected, $this->render($id), $this->lastBody);
        $writes = array_filter(
            array_column($database->getQueryLog(), 'query'),
            fn (string $sql) => stripos(ltrim($sql), 'update') === 0 && str_contains($sql, 'fof_upload_files')
        );
        $database->disableQueryLog();

        $this->assertSame($reads, $this->storageReads(), 'The second render reads nothing');
        $this->assertSame([], array_values($writes), 'The second render writes nothing');
    }

    public static function unreadableFiles(): array
    {
        return ['missing from local disk' => [5], 'missing from S3' => [6]];
    }

    #[Test]
    #[DataProvider('unreadableFiles')]
    public function a_file_that_cannot_be_read_renders_without_a_snippet(int $id): void
    {
        $this->assertSame(['status' => 200, 'hasSnippet' => 'false', 'snippet' => ''], $this->render($id), $this->lastBody);
        $this->assertNull(File::find($id)->text_snippet, 'Nothing is kept, so a later render tries again');
    }

    #[Test]
    public function a_snippet_is_capped_in_length(): void
    {
        $this->app();
        $this->put($this->publicPath('text/huge.txt'), str_repeat('x', 100000)."\nsecond\n");

        $render = $this->render(7);

        $this->assertSame(200, $render['status']);
        $this->assertSame(4000, mb_strlen($render['snippet']));
        $this->assertSame(4000, mb_strlen(File::find(7)->text_snippet));
    }

    public static function disks(): array
    {
        return ['local disk' => ['local'], 'S3' => ['aws-s3']];
    }

    #[Test]
    #[DataProvider('disks')]
    public function uploading_a_text_preview_keeps_its_snippet(string $adapter): void
    {
        $this->addType('^text\\/plain$', $adapter, 'text-preview');

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 1,
                'multipart'       => [$this->uploadFile($this->fixtures('Plain.txt'))],
            ])
        );

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());

        $file = File::byUuid(json_decode((string) $response->getBody(), true)['data'][0]['attributes']['uuid'])->firstOrFail();

        $this->assertSame("A plain text file.\nFor testing purposes.", $file->text_snippet);
        $this->assertFalse((bool) $file->text_snippet_has_more);
        $this->assertSame([], $this->s3Keys('GetObject'), 'Worked out from the upload, not read back');
    }

    #[Test]
    public function uploading_text_in_any_language_keeps_its_letters(): void
    {
        $this->addType('^text\\/plain$', 'local', 'text-preview');

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 1,
                'multipart'       => [$this->uploadFile($this->fixtures('Languages.txt'))],
            ])
        );

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());

        $file = File::byUuid(json_decode((string) $response->getBody(), true)['data'][0]['attributes']['uuid'])->firstOrFail();

        $this->assertSame("Århus og Ålborg\nхорошо, привет\nsą żółć\n七月 日本語\nκαλημέρα", $file->text_snippet);
        $this->assertFalse((bool) $file->text_snippet_has_more);
    }

    #[Test]
    public function other_uploads_get_no_snippet(): void
    {
        $this->addType('^text\\/plain$', 'local', 'file');

        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 1,
                'multipart'       => [$this->uploadFile($this->fixtures('Plain.txt'))],
            ])
        );

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());
        $this->assertNull(File::byUuid(json_decode((string) $response->getBody(), true)['data'][0]['attributes']['uuid'])->value('text_snippet'));
    }
}
