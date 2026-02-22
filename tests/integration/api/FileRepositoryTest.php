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

use Carbon\Carbon;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use FoF\Upload\File;
use FoF\Upload\Repositories\FileRepository;
use FoF\Upload\Tests\EnhancedTestCase;

/**
 * Tests for FileRepository::matchFilesForPost(), matchPosts(), and cleanUp().
 *
 * These cover the bug reported in FriendsOfFlarum/upload#374 where:
 * - Files using FileTemplate (Default File Download) store only the UUID in
 *   post content, not the URL. The old matching logic only searched for the URL,
 *   so those files were incorrectly treated as orphaned and deleted by cleanup.
 * - cleanUp() did not exclude shared files, which have no post associations by design.
 */
class FileRepositoryTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    private const OLD_DATE = '2020-01-01 00:00:00';
    private const FUTURE_DATE = '2099-01-01 00:00:00';

    // Seeded file UUIDs
    private const UUID_URL_IN_CONTENT = 'uuid-url-in-content';
    private const UUID_UUID_IN_CONTENT = 'uuid-uuid-in-content';
    private const UUID_NEITHER_IN_CONTENT = 'uuid-neither-in-content';
    private const UUID_SHARED = 'uuid-shared-file';
    private const UUID_RECENT = 'uuid-recent-orphan';

    // UUIDs for per-template tests (seeded in setUp)
    private const UUID_TMPL_JUST_URL = 'uuid-tmpl-just-url';
    private const UUID_TMPL_MARKDOWN = 'uuid-tmpl-markdown';
    private const UUID_TMPL_BBCODE = 'uuid-tmpl-bbcode';
    private const UUID_TMPL_IMAGE_PREVIEW = 'uuid-tmpl-image-preview';
    private const UUID_TMPL_IMAGE = 'uuid-tmpl-image';
    private const UUID_TMPL_TEXT_PREVIEW = 'uuid-tmpl-text-preview';
    private const UUID_TMPL_FILE = 'uuid-tmpl-file';

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(), // id = 2
            ],
            'discussions' => [
                [
                    'id'            => 1, 'title' => 'Test', 'slug' => 'test',
                    'comment_count' => 2, 'participant_count' => 1,
                    'created_at'    => self::OLD_DATE, 'user_id' => 2,
                    'first_post_id' => 1, 'last_post_id' => 2,
                ],
            ],
            'posts' => [
                // Post 1: references the URL-in-content file by URL
                [
                    'id'      => 1, 'discussion_id' => 1, 'user_id' => 2,
                    'type'    => 'comment', 'number' => 1, 'created_at' => self::OLD_DATE,
                    'content' => 'See http://localhost/files/file-url.jpg here',
                ],
                // Post 2: references the UUID-in-content file by UUID only (FileTemplate BBCode)
                [
                    'id'      => 2, 'discussion_id' => 1, 'user_id' => 2,
                    'type'    => 'comment', 'number' => 2, 'created_at' => self::OLD_DATE,
                    'content' => '[upl-file uuid='.self::UUID_UUID_IN_CONTENT.' size=5kB]archive.zip[/upl-file]',
                ],
                // Posts 10-16: one per template format (for matchFilesForPost per-template tests)
                [
                    'id'      => 10, 'discussion_id' => 1, 'user_id' => 2,
                    'type'    => 'comment', 'number' => 10, 'created_at' => self::OLD_DATE,
                    'content' => 'http://localhost/files/tmpl.jpg',
                ],
                [
                    'id'      => 11, 'discussion_id' => 1, 'user_id' => 2,
                    'type'    => 'comment', 'number' => 11, 'created_at' => self::OLD_DATE,
                    'content' => '![alt](http://localhost/files/tmpl.jpg)',
                ],
                [
                    'id'      => 12, 'discussion_id' => 1, 'user_id' => 2,
                    'type'    => 'comment', 'number' => 12, 'created_at' => self::OLD_DATE,
                    'content' => '[URL=http://localhost/files/tmpl.jpg][IMG]http://localhost/files/tmpl.jpg[/IMG][/URL]',
                ],
                [
                    'id'      => 13, 'discussion_id' => 1, 'user_id' => 2,
                    'type'    => 'comment', 'number' => 13, 'created_at' => self::OLD_DATE,
                    'content' => '[upl-image-preview uuid='.self::UUID_TMPL_IMAGE_PREVIEW.' url=http://localhost/files/tmpl.jpg alt=img]',
                ],
                [
                    'id'      => 14, 'discussion_id' => 1, 'user_id' => 2,
                    'type'    => 'comment', 'number' => 14, 'created_at' => self::OLD_DATE,
                    'content' => '[upl-image uuid='.self::UUID_TMPL_IMAGE.' size=1kB url=http://localhost/files/tmpl.jpg]img[/upl-image]',
                ],
                [
                    'id'      => 15, 'discussion_id' => 1, 'user_id' => 2,
                    'type'    => 'comment', 'number' => 15, 'created_at' => self::OLD_DATE,
                    'content' => '[upl-text-preview uuid='.self::UUID_TMPL_TEXT_PREVIEW.' url=http://localhost/files/tmpl.jpg]name[/upl-text-preview]',
                ],
                [
                    'id'   => 16, 'discussion_id' => 1, 'user_id' => 2,
                    'type' => 'comment', 'number' => 16, 'created_at' => self::OLD_DATE,
                    // FileTemplate: UUID in BBCode, URL never appears in content
                    'content' => '[upl-file uuid='.self::UUID_TMPL_FILE.' size=1kB]file.zip[/upl-file]',
                ],
            ],
            'fof_upload_files' => [
                // File whose URL appears in post content
                [
                    'id'            => 1, 'uuid' => self::UUID_URL_IN_CONTENT,
                    'base_name'     => 'file-url.jpg', 'path' => 'files/file-url.jpg',
                    'url'           => 'http://localhost/files/file-url.jpg',
                    'type'          => 'image/jpeg', 'size' => 1000,
                    'upload_method' => 'local', 'actor_id' => 2,
                    'shared'        => false, 'created_at' => self::OLD_DATE,
                ],
                // File whose UUID appears in post content (FileTemplate), URL does NOT appear
                [
                    'id'            => 2, 'uuid' => self::UUID_UUID_IN_CONTENT,
                    'base_name'     => 'archive.zip', 'path' => 'files/archive.zip',
                    'url'           => 'http://localhost/files/archive.zip',
                    'type'          => 'application/zip', 'size' => 5000,
                    'upload_method' => 'local', 'actor_id' => 2,
                    'shared'        => false, 'created_at' => self::OLD_DATE,
                ],
                // Truly orphaned file — neither URL nor UUID in any post
                [
                    'id'            => 3, 'uuid' => self::UUID_NEITHER_IN_CONTENT,
                    'base_name'     => 'orphan.jpg', 'path' => 'files/orphan.jpg',
                    'url'           => 'http://localhost/files/orphan.jpg',
                    'type'          => 'image/jpeg', 'size' => 500,
                    'upload_method' => 'local', 'actor_id' => 2,
                    'shared'        => false, 'created_at' => self::OLD_DATE,
                ],
                // Shared file — no actor_id, no post association by design
                [
                    'id'            => 4, 'uuid' => self::UUID_SHARED,
                    'base_name'     => 'shared.jpg', 'path' => 'files/shared.jpg',
                    'url'           => 'http://localhost/files/shared.jpg',
                    'type'          => 'image/jpeg', 'size' => 800,
                    'upload_method' => 'local', 'actor_id' => null,
                    'shared'        => true, 'created_at' => self::OLD_DATE,
                ],
                // Recent orphan — within grace period, should not be cleaned up
                [
                    'id'            => 5, 'uuid' => self::UUID_RECENT,
                    'base_name'     => 'recent.jpg', 'path' => 'files/recent.jpg',
                    'url'           => 'http://localhost/files/recent.jpg',
                    'type'          => 'image/jpeg', 'size' => 300,
                    'upload_method' => 'local', 'actor_id' => 2,
                    'shared'        => false, 'created_at' => self::FUTURE_DATE,
                ],
                // Per-template files (matching posts 10-16).
                // Use FUTURE_DATE so these don't interfere with cleanup-cutoff tests.
                [
                    'id'            => 10, 'uuid' => self::UUID_TMPL_JUST_URL,
                    'base_name'     => 'tmpl.jpg', 'path' => 'files/tmpl.jpg',
                    'url'           => 'http://localhost/files/tmpl.jpg',
                    'type'          => 'image/jpeg', 'size' => 100,
                    'upload_method' => 'local', 'actor_id' => 2,
                    'shared'        => false, 'created_at' => self::FUTURE_DATE,
                ],
                [
                    'id'            => 11, 'uuid' => self::UUID_TMPL_MARKDOWN,
                    'base_name'     => 'tmpl.jpg', 'path' => 'files/tmpl.jpg',
                    'url'           => 'http://localhost/files/tmpl.jpg',
                    'type'          => 'image/jpeg', 'size' => 100,
                    'upload_method' => 'local', 'actor_id' => 2,
                    'shared'        => false, 'created_at' => self::FUTURE_DATE,
                ],
                [
                    'id'            => 12, 'uuid' => self::UUID_TMPL_BBCODE,
                    'base_name'     => 'tmpl.jpg', 'path' => 'files/tmpl.jpg',
                    'url'           => 'http://localhost/files/tmpl.jpg',
                    'type'          => 'image/jpeg', 'size' => 100,
                    'upload_method' => 'local', 'actor_id' => 2,
                    'shared'        => false, 'created_at' => self::FUTURE_DATE,
                ],
                [
                    'id'            => 13, 'uuid' => self::UUID_TMPL_IMAGE_PREVIEW,
                    'base_name'     => 'tmpl.jpg', 'path' => 'files/tmpl.jpg',
                    'url'           => 'http://localhost/files/tmpl.jpg',
                    'type'          => 'image/jpeg', 'size' => 100,
                    'upload_method' => 'local', 'actor_id' => 2,
                    'shared'        => false, 'created_at' => self::FUTURE_DATE,
                ],
                [
                    'id'            => 14, 'uuid' => self::UUID_TMPL_IMAGE,
                    'base_name'     => 'tmpl.jpg', 'path' => 'files/tmpl.jpg',
                    'url'           => 'http://localhost/files/tmpl.jpg',
                    'type'          => 'image/jpeg', 'size' => 100,
                    'upload_method' => 'local', 'actor_id' => 2,
                    'shared'        => false, 'created_at' => self::FUTURE_DATE,
                ],
                [
                    'id'            => 15, 'uuid' => self::UUID_TMPL_TEXT_PREVIEW,
                    'base_name'     => 'tmpl.jpg', 'path' => 'files/tmpl.jpg',
                    'url'           => 'http://localhost/files/tmpl.jpg',
                    'type'          => 'image/jpeg', 'size' => 100,
                    'upload_method' => 'local', 'actor_id' => 2,
                    'shared'        => false, 'created_at' => self::FUTURE_DATE,
                ],
                [
                    'id'            => 16, 'uuid' => self::UUID_TMPL_FILE,
                    'base_name'     => 'file.zip', 'path' => 'files/file.zip',
                    'url'           => 'http://localhost/files/file.zip',
                    'type'          => 'application/zip', 'size' => 100,
                    'upload_method' => 'local', 'actor_id' => 2,
                    'shared'        => false, 'created_at' => self::FUTURE_DATE,
                ],
            ],
        ]);
    }

    private function repo(): FileRepository
    {
        return $this->app()->getContainer()->make(FileRepository::class);
    }

    private function fileByUuid(string $uuid): File
    {
        $this->app(); // ensure app is booted before Eloquent queries

        return File::byUuid($uuid)->with('posts')->firstOrFail();
    }

    // -------------------------------------------------------------------------
    // matchPosts() — bulk CLI remapping
    // -------------------------------------------------------------------------

    /**
     * @test
     */
    public function match_posts_links_file_referenced_by_url_in_content(): void
    {
        $this->repo()->matchPosts();

        $file = $this->fileByUuid(self::UUID_URL_IN_CONTENT);
        $this->assertCount(1, $file->posts, 'File referenced by URL should be linked to one post');
        $this->assertEquals(1, $file->posts->first()->id);
    }

    /**
     * @test
     */
    public function match_posts_links_file_referenced_by_uuid_only_in_content(): void
    {
        // Regression for #374: FileTemplate stores UUID in BBCode, not URL.
        // The old code only matched by URL — these files appeared orphaned and were deleted.
        $this->repo()->matchPosts();

        $file = $this->fileByUuid(self::UUID_UUID_IN_CONTENT);
        $this->assertCount(1, $file->posts, 'File referenced by UUID (FileTemplate) should be linked to one post');
        $this->assertEquals(2, $file->posts->first()->id);
    }

    /**
     * @test
     */
    public function match_posts_does_not_link_truly_orphaned_file(): void
    {
        $this->repo()->matchPosts();

        $file = $this->fileByUuid(self::UUID_NEITHER_IN_CONTENT);
        $this->assertCount(0, $file->posts, 'Truly orphaned file should not be linked to any post');
    }

    /**
     * @test
     */
    public function match_posts_does_not_link_shared_file_to_any_post(): void
    {
        $this->repo()->matchPosts();

        $file = $this->fileByUuid(self::UUID_SHARED);
        $this->assertCount(0, $file->posts, 'Shared file (null actor_id) should never match posts');
    }

    // -------------------------------------------------------------------------
    // matchFilesForPost() — per-post live matching on Posted/Revised
    // -------------------------------------------------------------------------

    /**
     * @test
     */
    public function match_files_for_post_links_file_referenced_by_url(): void
    {
        $this->repo()->matchFilesForPost(Post::find(1));

        $file = $this->fileByUuid(self::UUID_URL_IN_CONTENT);
        $this->assertCount(1, $file->posts);
        $this->assertEquals(1, $file->posts->first()->id);
    }

    /**
     * @test
     */
    public function match_files_for_post_links_file_referenced_by_uuid_only(): void
    {
        // Regression for #374: FileTemplate embeds only UUID in BBCode, not the URL.
        $this->repo()->matchFilesForPost(Post::find(2));

        $file = $this->fileByUuid(self::UUID_UUID_IN_CONTENT);
        $this->assertCount(1, $file->posts, 'File should be linked via UUID match when URL is absent from post content');
        $this->assertEquals(2, $file->posts->first()->id);
    }

    /**
     * @test
     */
    public function match_files_for_post_detaches_file_no_longer_in_content(): void
    {
        $this->app();

        // Pre-attach the url-file to post 2 where it is NOT referenced
        $file = File::byUuid(self::UUID_URL_IN_CONTENT)->firstOrFail();
        $file->posts()->attach(Post::find(2));
        $this->assertCount(1, $file->fresh()->posts);

        // Running match on post 2 should detach it
        $this->repo()->matchFilesForPost(Post::find(2));

        $this->assertCount(0, $file->fresh()->posts, 'File should be detached when no longer in post content');
    }

    /**
     * @test
     */
    public function match_files_for_post_does_not_link_unrelated_file(): void
    {
        $this->repo()->matchFilesForPost(Post::find(1));

        $file = $this->fileByUuid(self::UUID_NEITHER_IN_CONTENT);
        $this->assertCount(0, $file->posts, 'Unrelated file must not be linked to post');
    }

    // -------------------------------------------------------------------------
    // Per-template format tests for matchFilesForPost
    // -------------------------------------------------------------------------

    /**
     * @test
     */
    public function match_files_for_post_handles_just_url_template(): void
    {
        // Post 10: "http://localhost/files/tmpl.jpg"
        $this->repo()->matchFilesForPost(Post::find(10));

        $file = $this->fileByUuid(self::UUID_TMPL_JUST_URL);
        $this->assertCount(1, $file->posts, 'JustUrlTemplate: file should be linked via URL in content');
    }

    /**
     * @test
     */
    public function match_files_for_post_handles_markdown_image_template(): void
    {
        // Post 11: "![alt](http://localhost/files/tmpl.jpg)"
        $this->repo()->matchFilesForPost(Post::find(11));

        $file = $this->fileByUuid(self::UUID_TMPL_MARKDOWN);
        $this->assertCount(1, $file->posts, 'MarkdownImageTemplate: file should be linked via URL in content');
    }

    /**
     * @test
     */
    public function match_files_for_post_handles_bbcode_image_template(): void
    {
        // Post 12: "[URL=...][IMG]...[/IMG][/URL]"
        $this->repo()->matchFilesForPost(Post::find(12));

        $file = $this->fileByUuid(self::UUID_TMPL_BBCODE);
        $this->assertCount(1, $file->posts, 'BbcodeImageTemplate: file should be linked via URL in content');
    }

    /**
     * @test
     */
    public function match_files_for_post_handles_image_preview_template(): void
    {
        // Post 13: "[upl-image-preview uuid=... url=...]"
        $this->repo()->matchFilesForPost(Post::find(13));

        $file = $this->fileByUuid(self::UUID_TMPL_IMAGE_PREVIEW);
        $this->assertCount(1, $file->posts, 'ImagePreviewTemplate: file should be linked via URL in content');
    }

    /**
     * @test
     */
    public function match_files_for_post_handles_image_template(): void
    {
        // Post 14: "[upl-image uuid=... url=...]"
        $this->repo()->matchFilesForPost(Post::find(14));

        $file = $this->fileByUuid(self::UUID_TMPL_IMAGE);
        $this->assertCount(1, $file->posts, 'ImageTemplate: file should be linked via URL in content');
    }

    /**
     * @test
     */
    public function match_files_for_post_handles_text_preview_template(): void
    {
        // Post 15: "[upl-text-preview uuid=... url=...]"
        $this->repo()->matchFilesForPost(Post::find(15));

        $file = $this->fileByUuid(self::UUID_TMPL_TEXT_PREVIEW);
        $this->assertCount(1, $file->posts, 'TextPreviewTemplate: file should be linked via URL in content');
    }

    /**
     * @test
     */
    public function match_files_for_post_handles_file_template_uuid_only(): void
    {
        // Post 16: "[upl-file uuid=<UUID> size=...]" — URL is NOT in the content.
        // This is the exact template that caused #374.
        $this->repo()->matchFilesForPost(Post::find(16));

        $file = $this->fileByUuid(self::UUID_TMPL_FILE);
        $this->assertCount(1, $file->posts, 'FileTemplate: file should be linked via UUID match (URL absent from content)');
    }

    // -------------------------------------------------------------------------
    // cleanUp() — orphan deletion
    // -------------------------------------------------------------------------

    /**
     * @test
     */
    public function cleanup_deletes_old_orphaned_file(): void
    {
        // Map first so that files 1 and 2 get linked to their posts.
        // Only file 3 (UUID_NEITHER_IN_CONTENT) remains unlinked.
        $repo = $this->repo();
        $repo->matchPosts();

        // Cutoff is before FUTURE_DATE, so OLD_DATE files qualify but FUTURE_DATE does not
        $before = Carbon::parse(self::FUTURE_DATE)->subYear();

        $count = $repo->cleanUp($before, fn () => true);

        $this->assertEquals(1, $count, 'Only the one genuinely orphaned file should be deleted');
        $this->assertNull(File::byUuid(self::UUID_NEITHER_IN_CONTENT)->first(), 'Old orphaned file should be gone');
    }

    /**
     * @test
     */
    public function cleanup_does_not_delete_shared_files(): void
    {
        // Regression for #374: shared files have no posts by design — must never be cleaned up.
        $before = Carbon::now()->addYears(200);

        $this->repo()->cleanUp($before, fn () => true);

        $this->app();
        $this->assertNotNull(File::byUuid(self::UUID_SHARED)->first(), 'Shared file must not be deleted by cleanup');
    }

    /**
     * @test
     */
    public function cleanup_does_not_delete_file_within_grace_period(): void
    {
        // FUTURE_DATE file won't qualify when cutoff is now
        $before = Carbon::now();

        $this->repo()->cleanUp($before, fn () => true);

        $this->app();
        $this->assertNotNull(File::byUuid(self::UUID_RECENT)->first(), 'Recent file within grace period must not be deleted');
    }

    /**
     * @test
     */
    public function cleanup_does_not_delete_file_linked_to_post(): void
    {
        $this->app();
        File::byUuid(self::UUID_URL_IN_CONTENT)->firstOrFail()->posts()->attach(Post::find(1));

        $before = Carbon::now()->addYears(200);

        $this->repo()->cleanUp($before, fn () => true);

        $this->assertNotNull(File::byUuid(self::UUID_URL_IN_CONTENT)->first(), 'File with post association must not be deleted');
    }

    /**
     * @test
     */
    public function cleanup_respects_confirm_callback_returning_false(): void
    {
        $before = Carbon::now()->addYears(200);

        $count = $this->repo()->cleanUp($before, fn () => false);

        $this->assertEquals(0, $count, 'No files should be deleted when confirm callback declines');
        $this->app();
        $this->assertNotNull(File::byUuid(self::UUID_NEITHER_IN_CONTENT)->first());
    }

    /**
     * @test
     */
    public function cleanup_with_null_confirm_deletes_silently(): void
    {
        $repo = $this->repo();
        $repo->matchPosts();

        $before = Carbon::parse(self::FUTURE_DATE)->subYear();

        $count = $repo->cleanUp($before, null);

        $this->assertEquals(1, $count, 'Should delete without prompting when confirm is null');
        $this->app();
        $this->assertNull(File::byUuid(self::UUID_NEITHER_IN_CONTENT)->first());
    }

    // -------------------------------------------------------------------------
    // Combined: the exact scenario from #374
    // -------------------------------------------------------------------------

    /**
     * @test
     */
    public function map_then_cleanup_does_not_delete_file_download_template_files(): void
    {
        // Before the fix: matchPosts() never matched FileTemplate files (URL not in content),
        // so cleanUp() treated them as orphans and deleted them.
        $this->repo()->matchPosts();

        $before = Carbon::now()->addYears(200);
        $this->repo()->cleanUp($before, fn () => true);

        $this->app();
        $this->assertNotNull(
            File::byUuid(self::UUID_UUID_IN_CONTENT)->first(),
            'File used in a post via FileTemplate (UUID-only BBCode) must survive map+cleanup'
        );
    }

    /**
     * @test
     */
    public function map_then_cleanup_only_deletes_genuinely_orphaned_files(): void
    {
        $this->repo()->matchPosts();

        $before = Carbon::parse(self::FUTURE_DATE)->subYear();
        $deleted = $this->repo()->cleanUp($before, fn () => true);

        $this->assertEquals(1, $deleted, 'Exactly one genuinely orphaned old file should be deleted');

        $this->app();
        $this->assertNull(File::byUuid(self::UUID_NEITHER_IN_CONTENT)->first(), 'True orphan should be deleted');
        $this->assertNotNull(File::byUuid(self::UUID_URL_IN_CONTENT)->first(), 'URL-matched file must survive');
        $this->assertNotNull(File::byUuid(self::UUID_UUID_IN_CONTENT)->first(), 'UUID-matched file must survive');
        $this->assertNotNull(File::byUuid(self::UUID_SHARED)->first(), 'Shared file must survive');
        $this->assertNotNull(File::byUuid(self::UUID_RECENT)->first(), 'Recent file must survive');
    }
}
