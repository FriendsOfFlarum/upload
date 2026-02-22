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

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Upload\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Tests for the per-mime-type permission scoping feature.
 *
 * When a mime type config includes a `permission_slug`, the UploadHandler
 * performs an additional assertCan('fof-upload.upload-mime.{slug}') check
 * on top of the base 'fof-upload.upload' check (AND logic).
 *
 * These tests verify:
 * - Both permissions are required when a slug is configured.
 * - Base-only check applies when no slug is configured (backwards compat).
 * - Admin bypasses all mime-specific permission checks.
 * - Per-mime permissions are independent: having one doesn't grant another.
 */
class MimePermissionTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;
    use UploadFileTrait;

    /** Mime regex covering image/jpeg (the MilkyWay.jpg fixture). */
    private const MIME_IMAGE = '^image\\/jpeg$';

    /** Mime regex covering text/plain (the Plain.txt fixture). */
    private const MIME_TEXT = 'text\\/plain';

    /** Mime regex covering application/zip (the Example.zip fixture). */
    private const MIME_ZIP = 'application\\/zip';

    /** Permission slug assigned to the image mime type in tests. */
    private const SLUG_IMAGE = 'images';

    /** Permission slug assigned to the text mime type in tests. */
    private const SLUG_TEXT = 'documents';

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(), // id = 2
            ],
        ]);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Configure a mime type with an explicit permission slug.
     */
    private function addTypeWithPermission(
        string $mime,
        string $permissionLabel,
        string $permissionSlug,
        string $adapter = 'local',
        string $template = 'just-url'
    ): void {
        $this->setting('fof-upload.mimeTypes', json_encode([
            $mime => [
                'adapter'          => $adapter,
                'template'         => $template,
                'permission_label' => $permissionLabel,
                'permission_slug'  => $permissionSlug,
            ],
        ]));
    }

    /**
     * Configure two mime types, each with their own permission slug.
     */
    private function addTwoTypesWithPermissions(): void
    {
        $this->setting('fof-upload.mimeTypes', json_encode([
            self::MIME_IMAGE => [
                'adapter'          => 'local',
                'template'         => 'image-preview',
                'permission_label' => 'Images',
                'permission_slug'  => self::SLUG_IMAGE,
            ],
            self::MIME_TEXT => [
                'adapter'          => 'local',
                'template'         => 'just-url',
                'permission_label' => 'Documents',
                'permission_slug'  => self::SLUG_TEXT,
            ],
        ]));
    }

    private function grantPermission(string $permission): void
    {
        $this->prepareDatabase([
            'group_permission' => [
                ['group_id' => 3, 'permission' => $permission],
            ],
        ]);
    }

    private function uploadImage(): \Psr\Http\Message\ResponseInterface
    {
        return $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('MilkyWay.jpg')),
                ],
            ])
        );
    }

    private function uploadText(): \Psr\Http\Message\ResponseInterface
    {
        return $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('Plain.txt')),
                ],
            ])
        );
    }

    private function uploadImageAsAdmin(): \Psr\Http\Message\ResponseInterface
    {
        return $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 1, // admin
                'multipart'       => [
                    $this->uploadFile($this->fixtures('MilkyWay.jpg')),
                ],
            ])
        );
    }

    // -------------------------------------------------------------------------
    // Core AND-logic: both base + mime permission required
    // -------------------------------------------------------------------------

    #[Test]
    public function user_with_both_base_and_mime_permission_can_upload(): void
    {
        $this->addTypeWithPermission(self::MIME_IMAGE, 'Images', self::SLUG_IMAGE);
        $this->grantPermission('fof-upload.upload');
        $this->grantPermission('fof-upload.upload-mime.'.self::SLUG_IMAGE);

        $this->assertEquals(200, $this->uploadImage()->getStatusCode());
    }

    #[Test]
    public function user_with_only_base_permission_cannot_upload_mime_restricted_type(): void
    {
        $this->addTypeWithPermission(self::MIME_IMAGE, 'Images', self::SLUG_IMAGE);
        $this->grantPermission('fof-upload.upload');
        // mime-specific permission NOT granted

        $this->assertEquals(422, $this->uploadImage()->getStatusCode());
    }

    #[Test]
    public function user_with_only_mime_permission_cannot_upload_without_base_permission(): void
    {
        $this->addTypeWithPermission(self::MIME_IMAGE, 'Images', self::SLUG_IMAGE);
        // base permission NOT granted
        $this->grantPermission('fof-upload.upload-mime.'.self::SLUG_IMAGE);

        $this->assertEquals(403, $this->uploadImage()->getStatusCode());
    }

    #[Test]
    public function user_with_no_permissions_cannot_upload_mime_restricted_type(): void
    {
        $this->addTypeWithPermission(self::MIME_IMAGE, 'Images', self::SLUG_IMAGE);
        // no permissions granted at all

        $this->assertEquals(403, $this->uploadImage()->getStatusCode());
    }

    // -------------------------------------------------------------------------
    // Backwards compatibility: no slug → base permission only
    // -------------------------------------------------------------------------

    #[Test]
    public function user_with_base_permission_can_upload_when_no_mime_permission_configured(): void
    {
        // Mime type configured without permission_slug — base check only (existing behaviour)
        $this->addType(self::MIME_IMAGE, 'local', 'image-preview');
        $this->grantPermission('fof-upload.upload');

        $this->assertEquals(200, $this->uploadImage()->getStatusCode());
    }

    #[Test]
    public function user_without_base_permission_cannot_upload_even_without_mime_permission_configured(): void
    {
        $this->addType(self::MIME_IMAGE, 'local', 'image-preview');
        // no permissions granted

        $this->assertEquals(403, $this->uploadImage()->getStatusCode());
    }

    // -------------------------------------------------------------------------
    // Admin bypasses mime-specific checks
    // -------------------------------------------------------------------------

    #[Test]
    public function admin_can_upload_mime_restricted_type_without_explicit_mime_permission(): void
    {
        // Admin has all permissions implicitly; mime-specific check should not block them
        $this->addTypeWithPermission(self::MIME_IMAGE, 'Images', self::SLUG_IMAGE);
        // mime-specific permission NOT explicitly granted to admin group —
        // admin bypasses permission checks entirely in Flarum

        $this->assertEquals(200, $this->uploadImageAsAdmin()->getStatusCode());
    }

    // -------------------------------------------------------------------------
    // Independent per-mime permissions
    // -------------------------------------------------------------------------

    #[Test]
    public function having_image_permission_does_not_grant_text_upload(): void
    {
        $this->addTwoTypesWithPermissions();
        $this->grantPermission('fof-upload.upload');
        $this->grantPermission('fof-upload.upload-mime.'.self::SLUG_IMAGE);
        // SLUG_TEXT permission NOT granted

        // Image upload should succeed
        $this->assertEquals(
            200,
            $this->uploadImage()->getStatusCode(),
            'Image upload should succeed with image permission'
        );

        // Text upload should be denied
        $this->assertEquals(
            422,
            $this->uploadText()->getStatusCode(),
            'Text upload should fail without document permission'
        );
    }

    #[Test]
    public function having_text_permission_does_not_grant_image_upload(): void
    {
        $this->addTwoTypesWithPermissions();
        $this->grantPermission('fof-upload.upload');
        $this->grantPermission('fof-upload.upload-mime.'.self::SLUG_TEXT);
        // SLUG_IMAGE permission NOT granted

        // Text upload should succeed
        $this->assertEquals(
            200,
            $this->uploadText()->getStatusCode(),
            'Text upload should succeed with document permission'
        );

        // Image upload should be denied
        $this->assertEquals(
            422,
            $this->uploadImage()->getStatusCode(),
            'Image upload should fail without image permission'
        );
    }

    #[Test]
    public function user_with_both_mime_permissions_can_upload_both_types(): void
    {
        $this->addTwoTypesWithPermissions();
        $this->grantPermission('fof-upload.upload');
        $this->grantPermission('fof-upload.upload-mime.'.self::SLUG_IMAGE);
        $this->grantPermission('fof-upload.upload-mime.'.self::SLUG_TEXT);

        $this->assertEquals(
            200,
            $this->uploadImage()->getStatusCode(),
            'Image upload should succeed'
        );
        $this->assertEquals(
            200,
            $this->uploadText()->getStatusCode(),
            'Text upload should succeed'
        );
    }

    // -------------------------------------------------------------------------
    // Slug-less mime types coexisting with slugged ones
    // -------------------------------------------------------------------------

    #[Test]
    public function user_can_upload_unrestricted_type_alongside_restricted_type(): void
    {
        // Image is restricted; zip has no permission slug (unrestricted)
        $this->setting('fof-upload.mimeTypes', json_encode([
            self::MIME_IMAGE => [
                'adapter'          => 'local',
                'template'         => 'image-preview',
                'permission_label' => 'Images',
                'permission_slug'  => self::SLUG_IMAGE,
            ],
            self::MIME_ZIP => [
                'adapter'  => 'local',
                'template' => 'just-url',
                // no permission_slug
            ],
        ]));
        $this->grantPermission('fof-upload.upload');
        // mime-specific image permission NOT granted

        // Zip (unrestricted) should succeed with base permission only
        $response = $this->send(
            $this->request('POST', '/api/fof/upload', [
                'authenticatedAs' => 2,
                'multipart'       => [
                    $this->uploadFile($this->fixtures('Example.zip')),
                ],
            ])
        );
        $this->assertEquals(
            200,
            $response->getStatusCode(),
            'Zip upload should succeed — no mime permission required'
        );

        // Image (restricted) should still be denied
        $this->assertEquals(
            422,
            $this->uploadImage()->getStatusCode(),
            'Image upload should still require mime permission'
        );
    }
}
