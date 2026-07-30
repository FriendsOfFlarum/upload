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
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Upload\File;
use FoF\Upload\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * flarum/tags is an optional dependency, so tag scoping must be completely
 * inert when it is not enabled. Without this, adding the feature would break
 * downloads on every forum that does not use tags.
 */
class TagScopedDownloadWithoutTagsTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;
    use UploadFileTrait;

    private const DISCUSSION_ID = 200;
    private const POST_ID = 2000;

    public function setUp(): void
    {
        parent::setUp();

        // Deliberately does NOT enable flarum-tags.
        $this->extension('fof-upload');

        $this->addType('application\\/pdf', 'local', 'file');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 4, 'username' => 'plebian', 'email' => 'plebian@machine.local', 'is_email_confirmed' => true],
            ],
            'group_user' => [
                ['user_id' => 4, 'group_id' => 22],
            ],
            'groups' => [
                ['id' => 22, 'name_singular' => 'Members', 'name_plural' => 'Members', 'is_hidden' => 0],
            ],
            'group_permission' => [
                ['group_id' => 22, 'permission' => 'fof-upload.download'],
            ],
            Discussion::class => [
                ['id' => self::DISCUSSION_ID, 'title' => 'A discussion', 'user_id' => 1, 'first_post_id' => self::POST_ID, 'comment_count' => 1, 'created_at' => Carbon::now()->toDateTimeString()],
            ],
            Post::class => [
                ['id' => self::POST_ID, 'discussion_id' => self::DISCUSSION_ID, 'number' => 1, 'user_id' => 1, 'type' => 'comment', 'content' => '<t>A PDF</t>', 'created_at' => Carbon::now()->toDateTimeString()],
            ],
        ]);
    }

    private function uploadPdf(): File
    {
        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 1,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('Document.pdf')),
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $file = File::byUuid($json['data'][0]['attributes']['uuid'])->first();

        $file->posts()->attach(self::POST_ID);

        return $file;
    }

    #[Test]
    public function download_works_normally_when_tags_is_disabled()
    {
        $this->setting('fof-upload.disableHotlinkProtection', true);

        $file = $this->uploadPdf();

        $response = $this->send(
            $this->request('GET', '/api/fof/download/'.$file->uuid.'/'.self::POST_ID.'/tok', [
                'authenticatedAs' => 4,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode(), 'Tag scoping must not gate anything when tags is disabled');
    }

    #[Test]
    public function bare_uuid_download_works_normally_when_tags_is_disabled()
    {
        $file = $this->uploadPdf();

        $response = $this->send(
            $this->request('GET', '/api/fof/download/'.$file->uuid, [
                'authenticatedAs' => 4,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode(), 'Bare-uuid route must be unaffected when tags is disabled');
    }

    #[Test]
    public function base_download_permission_still_applies_when_tags_is_disabled()
    {
        $file = $this->uploadPdf();

        // User 2 (normalUser) has no base download permission.
        $response = $this->send(
            $this->request('GET', '/api/fof/download/'.$file->uuid, [
                'authenticatedAs' => 2,
            ])
        );

        $this->assertEquals(403, $response->getStatusCode(), 'Base permission must still be enforced');
    }
}
