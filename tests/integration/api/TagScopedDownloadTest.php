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
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Tags\Tag;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Upload\File;
use FoF\Upload\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Tests for tag-scoped download permissions.
 *
 * Scenario driving this feature: a client uploads PDFs into a restricted tag.
 * Everyone may *read* the tag and see that a download exists, but only certain
 * groups may actually download the file.
 *
 * The permission model mirrors flarum/tags' own convention: an ability checked
 * against a Tag model resolves via TagPolicy to `tag{id}.{ability}`, and only
 * bites when the tag is flagged `is_restricted`. So:
 *
 *   allowed = actor.can('fof-upload.download')                       (base, always required)
 *             AND actor.can('fof-upload.download-files', <tag>)      (per-tag, when restricted)
 *
 * Group map used throughout:
 *   - group 3 = members (base download permission only)
 *   - group 20 = privileged (base + per-tag download on the restricted tag)
 *   - group 21 = no base download permission at all
 */
class TagScopedDownloadTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;
    use UploadFileTrait;

    /** Tag that is restricted: readable by all, download gated. */
    private const RESTRICTED_TAG_ID = 10;

    /** Tag with no restriction at all. */
    private const OPEN_TAG_ID = 11;

    /** Discussion inside the restricted tag. */
    private const RESTRICTED_DISCUSSION_ID = 100;

    /** Discussion inside the open tag. */
    private const OPEN_DISCUSSION_ID = 101;

    private const RESTRICTED_POST_ID = 1000;
    private const OPEN_POST_ID = 1001;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('flarum-tags', 'fof-upload');

        // PDFs are handled by the "Default file download template" (tag: file),
        // which proxies downloads through PHP rather than embedding a public URL.
        $this->addType('application\\/pdf', 'local', 'file');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(), // id 2, group 3
                ['id' => 3, 'username' => 'privileged', 'email' => 'privileged@machine.local', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'plebian', 'email' => 'plebian@machine.local', 'is_email_confirmed' => true],
                ['id' => 6, 'username' => 'nodownload', 'email' => 'nodownload@machine.local', 'is_email_confirmed' => true],
            ],
            'group_user' => [
                ['user_id' => 3, 'group_id' => 20],
                ['user_id' => 4, 'group_id' => 22],
                ['user_id' => 6, 'group_id' => 21],
            ],
            'groups' => [
                ['id' => 20, 'name_singular' => 'Privileged', 'name_plural' => 'Privileged', 'is_hidden' => 0],
                // Group 21 deliberately has NO base download permission.
                ['id' => 21, 'name_singular' => 'NoDownload', 'name_plural' => 'NoDownload', 'is_hidden' => 0],
                // Group 22 has base download permission but no per-tag grant.
                ['id' => 22, 'name_singular' => 'Members', 'name_plural' => 'Members', 'is_hidden' => 0],
            ],
            'group_permission' => [
                // Base download permission is granted to the two explicit test groups
                // only. It is deliberately NOT granted to group 3 (Members), because
                // every registered user is implicitly a Member — granting it there
                // would also grant it to the "no download permission" user.
                ['group_id' => 22, 'permission' => 'fof-upload.download'],
                ['group_id' => 20, 'permission' => 'fof-upload.download'],
                // ...but only the privileged group may download within the restricted tag.
                ['group_id' => 20, 'permission' => 'tag'.self::RESTRICTED_TAG_ID.'.fof-upload.download-files'],
                // All groups may view the restricted tag's discussions — the client
                // requirement is that non-permitted users still SEE the download.
                ['group_id' => 3, 'permission' => 'tag'.self::RESTRICTED_TAG_ID.'.viewForum'],
            ],
            Tag::class => [
                ['id' => self::RESTRICTED_TAG_ID, 'name' => 'Restricted', 'slug' => 'restricted', 'position' => 0, 'is_restricted' => true],
                ['id' => self::OPEN_TAG_ID, 'name' => 'Open', 'slug' => 'open', 'position' => 1, 'is_restricted' => false],
            ],
            Discussion::class => [
                ['id' => self::RESTRICTED_DISCUSSION_ID, 'title' => 'Restricted discussion', 'user_id' => 3, 'first_post_id' => self::RESTRICTED_POST_ID, 'comment_count' => 1, 'created_at' => Carbon::now()->toDateTimeString()],
                ['id' => self::OPEN_DISCUSSION_ID, 'title' => 'Open discussion', 'user_id' => 3, 'first_post_id' => self::OPEN_POST_ID, 'comment_count' => 1, 'created_at' => Carbon::now()->toDateTimeString()],
            ],
            'discussion_tag' => [
                ['discussion_id' => self::RESTRICTED_DISCUSSION_ID, 'tag_id' => self::RESTRICTED_TAG_ID],
                ['discussion_id' => self::OPEN_DISCUSSION_ID, 'tag_id' => self::OPEN_TAG_ID],
            ],
            Post::class => [
                ['id' => self::RESTRICTED_POST_ID, 'discussion_id' => self::RESTRICTED_DISCUSSION_ID, 'number' => 1, 'user_id' => 3, 'type' => 'comment', 'content' => '<t>A restricted PDF</t>', 'created_at' => Carbon::now()->toDateTimeString()],
                ['id' => self::OPEN_POST_ID, 'discussion_id' => self::OPEN_DISCUSSION_ID, 'number' => 1, 'user_id' => 3, 'type' => 'comment', 'content' => '<t>An open PDF</t>', 'created_at' => Carbon::now()->toDateTimeString()],
            ],
        ]);
    }

    /**
     * Upload a PDF as the privileged user and attach it to the given post.
     */
    private function uploadPdfToPost(int $postId): File
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 1, // admin, always allowed to upload
                'multipart'       => [
                    $this->uploadFile($this->fixtures('Document.pdf')),
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode(), 'PDF upload should succeed');

        $json = json_decode($response->getBody()->getContents(), true);
        $file = File::byUuid($json['data'][0]['attributes']['uuid'])->first();

        $this->assertNotNull($file, 'Uploaded PDF should exist in the database');
        $this->assertEquals('file', $file->tag, 'PDF should use the default file download template');

        $file->posts()->attach($postId);

        return $file;
    }

    private function download(File $file, int $actorId, ?int $postId = null)
    {
        $path = $postId === null
            ? '/api/fof/download/'.$file->uuid
            : '/api/fof/download/'.$file->uuid.'/'.$postId.'/'.'csrf-token-placeholder';

        return $this->send(
            $this->request('GET', $path, ['authenticatedAs' => $actorId])
        );
    }

    #[Test]
    public function user_with_per_tag_permission_can_download_pdf_in_restricted_tag()
    {
        // Hotlink protection would otherwise reject our placeholder CSRF token.
        $this->setting('fof-upload.disableHotlinkProtection', true);

        $file = $this->uploadPdfToPost(self::RESTRICTED_POST_ID);

        $response = $this->download($file, 3, self::RESTRICTED_POST_ID);

        $this->assertEquals(200, $response->getStatusCode(), 'Privileged user should be able to download');
    }

    #[Test]
    public function user_without_per_tag_permission_cannot_download_pdf_in_restricted_tag()
    {
        $this->setting('fof-upload.disableHotlinkProtection', true);

        $file = $this->uploadPdfToPost(self::RESTRICTED_POST_ID);

        $response = $this->download($file, 4, self::RESTRICTED_POST_ID);

        $this->assertEquals(403, $response->getStatusCode(), 'User lacking per-tag download permission must be denied');
    }

    /**
     * The bypass vector: the UUID is present in the page HTML as
     * data-fof-upload-download-uuid, and the bare-UUID route carries no post id.
     * It must still resolve the tag scope via the file's posts pivot.
     */
    #[Test]
    public function bare_uuid_route_cannot_bypass_tag_scoping()
    {
        $file = $this->uploadPdfToPost(self::RESTRICTED_POST_ID);

        $response = $this->download($file, 4);

        $this->assertEquals(403, $response->getStatusCode(), 'Bare-UUID route must not bypass tag scoping');
    }

    #[Test]
    public function download_in_unrestricted_tag_is_unaffected()
    {
        $this->setting('fof-upload.disableHotlinkProtection', true);

        $file = $this->uploadPdfToPost(self::OPEN_POST_ID);

        $response = $this->download($file, 4, self::OPEN_POST_ID);

        $this->assertEquals(200, $response->getStatusCode(), 'Unrestricted tags should not gate downloads');
    }

    /**
     * User 6 is in group 21, which has viewForum on the restricted tag but no
     * base 'fof-upload.download' permission at all. The base check must still
     * apply independently of any tag scoping, even in an open tag.
     */
    #[Test]
    public function base_download_permission_is_still_required()
    {
        $this->setting('fof-upload.disableHotlinkProtection', true);

        $file = $this->uploadPdfToPost(self::OPEN_POST_ID);

        $response = $this->download($file, 6, self::OPEN_POST_ID);

        $this->assertEquals(403, $response->getStatusCode(), 'Base download permission must still be required');
    }

    #[Test]
    public function admin_can_always_download()
    {
        $this->setting('fof-upload.disableHotlinkProtection', true);

        $file = $this->uploadPdfToPost(self::RESTRICTED_POST_ID);

        $response = $this->download($file, 1, self::RESTRICTED_POST_ID);

        $this->assertEquals(200, $response->getStatusCode(), 'Admin should bypass tag scoping');
    }

    /**
     * A file attached to both a restricted and an open discussion. The client's
     * use case is confidentiality, so the most-restrictive reading applies:
     * if any linked discussion gates the file, the user needs that permission.
     */
    #[Test]
    public function file_in_both_restricted_and_open_discussion_is_most_restrictive()
    {
        $file = $this->uploadPdfToPost(self::RESTRICTED_POST_ID);
        $file->posts()->attach(self::OPEN_POST_ID);

        $response = $this->download($file, 4);

        $this->assertEquals(403, $response->getStatusCode(), 'Most-restrictive semantics: restricted attachment wins');
    }

    /**
     * A file that exists only in the media library, never posted, has no tag
     * context and must remain downloadable with just the base permission.
     */
    #[Test]
    public function unposted_file_is_not_tag_scoped()
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 1,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('Document.pdf')),
                ],
            ])
        );

        $json = json_decode($response->getBody()->getContents(), true);
        $file = File::byUuid($json['data'][0]['attributes']['uuid'])->first();

        $response = $this->download($file, 4);

        $this->assertEquals(200, $response->getStatusCode(), 'A file with no post context is not tag-scoped');
    }

    /**
     * The frontend renders the download control in a disabled state from this
     * flag. It must reflect the same decision the download endpoint makes.
     */
    #[Test]
    public function discussion_exposes_can_download_files_flag_to_frontend()
    {
        $response = $this->send(
            $this->request('GET', '/api/discussions/'.self::RESTRICTED_DISCUSSION_ID, [
                'authenticatedAs' => 4,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertFalse(
            $json['data']['attributes']['canDownloadFiles'],
            'User without per-tag permission should see canDownloadFiles=false'
        );
    }

    #[Test]
    public function discussion_flag_is_true_for_permitted_user()
    {
        $response = $this->send(
            $this->request('GET', '/api/discussions/'.self::RESTRICTED_DISCUSSION_ID, [
                'authenticatedAs' => 3,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertTrue(
            $json['data']['attributes']['canDownloadFiles'],
            'Privileged user should see canDownloadFiles=true'
        );
    }
}
