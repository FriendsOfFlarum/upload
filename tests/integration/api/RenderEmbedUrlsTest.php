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

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');
    }

    /** @test */
    public function an_image_preview_of_no_known_file_does_not_show_the_url_it_was_posted_with()
    {
        $this->givenPost(1, $this->imagePreview(self::ELSEWHERE, 404));

        $this->assertSame([], $this->urlsIn(1));
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
    protected function urlsIn(int $postId): array
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

        return array_values(array_unique($urls));
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
}
