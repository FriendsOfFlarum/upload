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

use Flarum\Extend;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use FoF\Upload\File;
use FoF\Upload\Tests\EnhancedTestCase;

/**
 * End-to-end tests verifying that files are automatically linked to posts
 * when a post is created or edited via the API (the LinkFilesToPostOnSave listener).
 *
 * These tests exercise the full HTTP path: upload → post → verify file-post association.
 * They ensure that the automatic mapping fires correctly on the Posted and Revised events
 * for all template types, including FileTemplate which only embeds the UUID.
 */
class FileMappingOnPostSaveTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;
    use UploadFileTrait;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        // Exempt CSRF for discussion/post creation in tests
        $this->extend(
            (new Extend\Csrf())
                ->exemptRoute('discussions.create')
                ->exemptRoute('posts.create')
                ->exemptRoute('posts.update')
        );

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(), // id = 2
            ],
            'group_permission' => [
                ['group_id' => 3, 'permission' => 'fof-upload.upload'],
                ['group_id' => 3, 'permission' => 'startDiscussion'],
                ['group_id' => 3, 'permission' => 'discussion.reply'],
                ['group_id' => 3, 'permission' => 'postWithoutThrottle'],
            ],
        ]);
    }

    /**
     * Upload a file via the API and return its UUID and URL.
     */
    private function uploadFileAndGetInfo(string $fixture = 'MilkyWay.jpg'): array
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures($fixture)),
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode(), 'Upload should succeed');

        $json = json_decode($response->getBody()->getContents(), true);
        $attrs = $json['data'][0]['attributes'];

        return [
            'uuid' => $attrs['uuid'],
            'url'  => $attrs['url'],
        ];
    }

    /**
     * Create a discussion via the API and return the discussion and first post IDs.
     */
    private function createDiscussion(string $title, string $content): array
    {
        $response = $this->send(
            $this->request('POST', '/api/discussions', [
                'authenticatedAs' => 2,
                'json'            => [
                    'data' => [
                        'type'       => 'discussions',
                        'attributes' => [
                            'title'   => $title,
                            'content' => $content,
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(201, $response->getStatusCode(), 'Discussion creation should succeed');

        $json = json_decode($response->getBody()->getContents(), true);

        return [
            'discussion_id' => (int) $json['data']['id'],
            'post_id'       => (int) $json['data']['relationships']['firstPost']['data']['id'],
        ];
    }

    /**
     * Edit a post via the API.
     */
    private function editPost(int $postId, string $content): void
    {
        $response = $this->send(
            $this->request('PATCH', "/api/posts/{$postId}", [
                'authenticatedAs' => 2,
                'json'            => [
                    'data' => [
                        'type'       => 'posts',
                        'id'         => (string) $postId,
                        'attributes' => [
                            'content' => $content,
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode(), 'Post edit should succeed');
    }

    /**
     * Reply to a discussion via the API and return the new post ID.
     */
    private function replyToDiscussion(int $discussionId, string $content): int
    {
        $response = $this->send(
            $this->request('POST', '/api/posts', [
                'authenticatedAs' => 2,
                'json'            => [
                    'data' => [
                        'type'       => 'posts',
                        'attributes' => [
                            'content' => $content,
                        ],
                        'relationships' => [
                            'discussion' => [
                                'data' => ['type' => 'discussions', 'id' => (string) $discussionId],
                            ],
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(201, $response->getStatusCode(), 'Reply should succeed');

        $json = json_decode($response->getBody()->getContents(), true);
        return (int) $json['data']['id'];
    }

    // -------------------------------------------------------------------------
    // Automatic mapping on Posted event
    // -------------------------------------------------------------------------

    /**
     * @test
     */
    public function file_is_linked_to_post_when_url_is_in_new_discussion_content(): void
    {
        ['uuid' => $uuid, 'url' => $url] = $this->uploadFileAndGetInfo();

        // Use the URL directly in content (JustUrl / MarkdownImage style)
        ['post_id' => $postId] = $this->createDiscussion('Test', $url);

        $this->app();
        $file = File::byUuid($uuid)->with('posts')->first();
        $this->assertNotNull($file);
        $this->assertCount(1, $file->posts, 'File should be linked to post when URL is in content');
        $this->assertEquals($postId, $file->posts->first()->id);
    }

    /**
     * @test
     */
    public function file_is_linked_to_post_when_uuid_bbcode_is_in_new_discussion_content(): void
    {
        // This is the FileTemplate ("Default File Download") scenario from #374.
        // Only the UUID appears in content — the URL does not.
        ['uuid' => $uuid] = $this->uploadFileAndGetInfo();

        $bbcode = "[upl-file uuid={$uuid} size=1kB]milkyway.jpg[/upl-file]";
        ['post_id' => $postId] = $this->createDiscussion('Test', $bbcode);

        $this->app();
        $file = File::byUuid($uuid)->with('posts')->first();
        $this->assertNotNull($file);
        $this->assertCount(1, $file->posts, 'File should be linked to post via UUID match (FileTemplate)');
        $this->assertEquals($postId, $file->posts->first()->id);
    }

    /**
     * @test
     */
    public function file_not_in_content_is_not_linked_to_post(): void
    {
        ['uuid' => $uuid] = $this->uploadFileAndGetInfo();

        // Post content has no reference to the uploaded file
        $this->createDiscussion('Test', 'This post contains no file reference.');

        $this->app();
        $file = File::byUuid($uuid)->with('posts')->first();
        $this->assertNotNull($file);
        $this->assertCount(0, $file->posts, 'File not referenced in post should not be linked');
    }

    // -------------------------------------------------------------------------
    // Automatic mapping on Revised event
    // -------------------------------------------------------------------------

    /**
     * @test
     */
    public function file_is_linked_to_post_when_url_is_added_on_edit(): void
    {
        ['uuid' => $uuid, 'url' => $url] = $this->uploadFileAndGetInfo();

        // Create post without the file
        ['post_id' => $postId] = $this->createDiscussion('Test', 'No file here yet.');

        $this->app();
        $file = File::byUuid($uuid)->with('posts')->first();
        $this->assertCount(0, $file->posts, 'File should not be linked before edit');

        // Edit the post to include the file URL
        $this->editPost($postId, "Now it has the file: {$url}");

        $file = File::byUuid($uuid)->with('posts')->first();
        $this->assertNotNull($file);
        $this->assertCount(1, $file->posts, 'File should be linked after edit adds URL to content');
        $this->assertEquals($postId, $file->posts->first()->id);
    }

    /**
     * @test
     */
    public function file_is_linked_to_post_when_uuid_bbcode_is_added_on_edit(): void
    {
        // FileTemplate scenario on edit — UUID added to content during revision.
        ['uuid' => $uuid] = $this->uploadFileAndGetInfo();

        ['post_id' => $postId] = $this->createDiscussion('Test', 'No file yet.');

        $bbcode = "[upl-file uuid={$uuid} size=1kB]milkyway.jpg[/upl-file]";
        $this->editPost($postId, $bbcode);

        $this->app();
        $file = File::byUuid($uuid)->with('posts')->first();
        $this->assertNotNull($file);
        $this->assertCount(1, $file->posts, 'File should be linked after edit adds UUID BBCode to content');
        $this->assertEquals($postId, $file->posts->first()->id);
    }

    /**
     * @test
     */
    public function file_is_unlinked_from_post_when_removed_on_edit(): void
    {
        ['uuid' => $uuid, 'url' => $url] = $this->uploadFileAndGetInfo();

        // Create post with the file
        ['post_id' => $postId] = $this->createDiscussion('Test', "Here it is: {$url}");

        $this->app();
        $file = File::byUuid($uuid)->with('posts')->first();
        $this->assertCount(1, $file->posts, 'File should be linked initially');

        // Edit to remove the file reference
        $this->editPost($postId, 'The file has been removed from this post.');

        $file = File::byUuid($uuid)->with('posts')->first();
        $this->assertCount(0, $file->posts, 'File should be unlinked after URL is removed from content');
    }

    // -------------------------------------------------------------------------
    // Mapping on replies (Posted event on reply post)
    // -------------------------------------------------------------------------

    /**
     * @test
     */
    public function file_is_linked_to_reply_post_when_url_is_in_content(): void
    {
        ['uuid' => $uuid, 'url' => $url] = $this->uploadFileAndGetInfo();

        ['discussion_id' => $discussionId] = $this->createDiscussion('Test', 'Opening post.');
        $replyPostId = $this->replyToDiscussion($discussionId, "Reply with file: {$url}");

        $this->app();
        $file = File::byUuid($uuid)->with('posts')->first();
        $this->assertNotNull($file);
        $this->assertCount(1, $file->posts, 'File should be linked to reply post');
        $this->assertEquals($replyPostId, $file->posts->first()->id);
    }

    /**
     * @test
     */
    public function file_is_linked_to_reply_post_when_uuid_bbcode_is_in_content(): void
    {
        // FileTemplate in a reply — the core #374 scenario in the wild.
        ['uuid' => $uuid] = $this->uploadFileAndGetInfo();

        ['discussion_id' => $discussionId] = $this->createDiscussion('Test', 'Opening post.');

        $bbcode = "[upl-file uuid={$uuid} size=1kB]milkyway.jpg[/upl-file]";
        $replyPostId = $this->replyToDiscussion($discussionId, $bbcode);

        $this->app();
        $file = File::byUuid($uuid)->with('posts')->first();
        $this->assertNotNull($file);
        $this->assertCount(1, $file->posts, 'File should be linked to reply via UUID BBCode (FileTemplate)');
        $this->assertEquals($replyPostId, $file->posts->first()->id);
    }
}
