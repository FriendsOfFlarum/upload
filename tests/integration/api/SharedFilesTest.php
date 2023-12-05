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

use Flarum\Testing\integration\TestCase;

class SharedFilesTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');
    }

    /**
     * @test
     */
    public function list_shared_files()
    {
        $response = $this->send(
            $this->request('GET', '/api/fof/upload/shared-files')
        );

        $this->assertEquals(200, $response->getStatusCode());
    }
}
