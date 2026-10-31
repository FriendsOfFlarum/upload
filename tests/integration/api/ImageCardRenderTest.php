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
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ImageCardRenderTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        $this->prepareDatabase([
            Discussion::class => [
                ['id' => 1, 'title' => 'Cards', 'user_id' => 1, 'created_at' => '2026-01-01 00:00:00', 'first_post_id' => 1, 'comment_count' => 1],
            ],
            Post::class => [
                ['id' => 1, 'discussion_id' => 1, 'number' => 1, 'user_id' => 1, 'type' => 'comment', 'created_at' => '2026-01-01 00:00:00',
                    'content'    => '<r>'.$this->card(1, 'with-thumb.png').$this->card(2, 'no-thumb.png').$this->card(3, 'gone.png', 'https://evil.example/x.png').'</r>'],
            ],
            'fof_upload_files' => [
                $this->upload(1, 'with-thumb.png', [
                    'thumbnail_path'  => 'files/with-thumb-thumb.webp', 'image_width' => 1600, 'image_height' => 900,
                    'thumbnail_width' => 800, 'thumbnail_height' => 450,
                ]),
                $this->upload(2, 'no-thumb.png', ['image_width' => 30, 'image_height' => 40]),
            ],
        ]);
    }

    #[Test]
    public function an_image_card_shows_its_live_thumbnail_at_its_size(): void
    {
        $this->assertSame([
            'uuid' => $this->uuid(1), 'src' => 'http://localhost/assets/files/files/with-thumb-thumb.webp', 'width' => '800', 'height' => '450',
            'label' => 'with-thumb.png', 'size' => '2MB', 'button' => 'button',
        ], $this->cards()[0]);
    }

    #[Test]
    public function an_image_card_without_a_thumbnail_shows_the_file_itself(): void
    {
        $this->assertSame([
            'uuid' => $this->uuid(2), 'src' => 'http://localhost/assets/files/files/no-thumb.png', 'width' => '30', 'height' => '40',
            'label' => 'no-thumb.png', 'size' => '2MB', 'button' => 'button',
        ], $this->cards()[1]);
    }

    #[Test]
    public function a_thumbnail_typed_into_the_bbcode_is_never_shown(): void
    {
        $this->assertSame([
            'uuid' => $this->uuid(3), 'src' => 'https://old.example.com/3', 'width' => '', 'height' => '',
            'label' => 'gone.png', 'size' => '2MB', 'button' => 'button',
        ], $this->cards()[2]);
    }

    protected function cards(): array
    {
        $response = $this->send($this->request('GET', '/api/posts/1', ['authenticatedAs' => 1]));
        $html = json_decode((string) $response->getBody(), true)['data']['attributes']['contentHtml'];

        $document = new DOMDocument();
        $document->loadHTML('<?xml encoding="utf-8"?><body>'.$html.'</body>', LIBXML_NOERROR);
        $xpath = new DOMXPath($document);

        return array_map(function (DOMElement $card) use ($xpath) {
            $image = $xpath->query('.//img', $card)->item(0);
            $button = $xpath->query('.//*[contains(@class, "fof-upload-download-button")]', $card)->item(0);

            return [
                'uuid'   => $card->getAttribute('data-fof-upload-download-uuid'),
                'src'    => $image->getAttribute('src'),
                'width'  => $image->getAttribute('width'),
                'height' => $image->getAttribute('height'),
                'label'  => trim($xpath->query('.//*[contains(@class, "fof-upload-download-label")]', $card)->item(0)->textContent),
                'size'   => trim($xpath->query('.//*[contains(@class, "fof-upload-download-size")]', $card)->item(0)->textContent),
                'button' => $button?->nodeName,
            ];
        }, iterator_to_array($xpath->query('//div[contains(@class, "fof-download")][@data-fof-upload-download-uuid]')));
    }

    protected function card(int $id, string $label, ?string $typedThumbnail = null): string
    {
        $uuid = $this->uuid($id);
        $thumbnail = $typedThumbnail ? " thumbnail_url=\"$typedThumbnail\"" : '';

        return "<UPL-IMAGE size=\"2MB\"$thumbnail url=\"https://old.example.com/$id\" uuid=\"$uuid\"><s>[upl-image uuid=$uuid size=2MB url=https://old.example.com/$id]</s>$label<e>[/upl-image]</e></UPL-IMAGE>";
    }

    protected function upload(int $id, string $name, array $extra = []): array
    {
        return $extra + [
            'id'            => $id, 'uuid' => $this->uuid($id), 'base_name' => $name, 'path' => "files/$name",
            'url'           => "https://old.example.com/$id", 'type' => 'image/png', 'size' => 1000,
            'upload_method' => 'local', 'actor_id' => 1, 'shared' => false, 'created_at' => '2026-01-01 00:00:00',
        ];
    }

    protected function uuid(int $id): string
    {
        return sprintf('00000000-0000-0000-0000-%012d', $id);
    }
}
