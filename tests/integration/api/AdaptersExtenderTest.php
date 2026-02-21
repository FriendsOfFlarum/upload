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
use FoF\Upload\Adapters\Manager;
use FoF\Upload\Extend\Adapters;
use PHPUnit\Framework\Attributes\Test;

class AdaptersExtenderTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');
    }

    #[Test]
    public function force_extender_limits_available_adapters_to_aws_s3()
    {
        $this->extend(
            (new Adapters())->force('aws-s3')
        );

        $this->app();

        /** @var Manager $manager */
        $manager = $this->app()->getContainer()->make(Manager::class);
        $adapters = $manager->adapters();

        // Only 'aws-s3' should be available
        $this->assertTrue($adapters->has('aws-s3'));
        $this->assertFalse($adapters->has('local'));
        $this->assertFalse($adapters->has('imgur'));
        $this->assertEquals(1, $adapters->count());
    }

    #[Test]
    public function force_extender_works_with_local_adapter()
    {
        $this->extend(
            (new Adapters())->force('local')
        );

        $this->app();

        /** @var Manager $manager */
        $manager = $this->app()->getContainer()->make(Manager::class);
        $adapters = $manager->adapters();

        // Only 'local' should be available
        $this->assertTrue($adapters->has('local'));
        $this->assertFalse($adapters->has('aws-s3'));
        $this->assertFalse($adapters->has('imgur'));
        $this->assertEquals(1, $adapters->count());

        // Local adapter should be instantiable
        $adapter = $manager->instantiate('local');
        $this->assertInstanceOf(\FoF\Upload\Adapters\Local::class, $adapter);
    }

    #[Test]
    public function disable_extender_removes_specified_adapters()
    {
        $this->extend(
            (new Adapters())
                ->disable('imgur')
                ->disable('qiniu')
        );

        $this->app();

        /** @var Manager $manager */
        $manager = $this->app()->getContainer()->make(Manager::class);
        $adapters = $manager->adapters();

        // imgur and qiniu should not be available
        $this->assertFalse($adapters->has('imgur'));
        $this->assertFalse($adapters->has('qiniu'));

        // Other adapters should still be available
        $this->assertTrue($adapters->has('aws-s3'));
        $this->assertTrue($adapters->has('local'));
    }

    #[Test]
    public function without_extender_all_adapters_are_available()
    {
        $this->app();

        /** @var Manager $manager */
        $manager = $this->app()->getContainer()->make(Manager::class);
        $adapters = $manager->adapters();

        // All adapters should be available by default
        $this->assertTrue($adapters->has('aws-s3'));
        $this->assertTrue($adapters->has('local'));
        $this->assertTrue($adapters->has('imgur'));
        $this->assertGreaterThanOrEqual(4, $adapters->count());
    }

    /**
     * Tests that aws-s3 continues to work as expected.
     */
    #[Test]
    public function aws_s3_instantiation_works_as_standard()
    {
        // Mock adapter that will be returned instead of trying to create real S3Client
        $mockAdapter = \Mockery::mock(\FoF\Upload\Contracts\UploadAdapter::class);

        $this->extend(
            (new Adapters())->force('aws-s3'),

            // Use event listener to provide mock adapter for instantiation
            (new \Flarum\Extend\Event())
                ->listen(\FoF\Upload\Events\Adapter\Instantiate::class, function ($event) use ($mockAdapter) {
                    if ($event->adapter === 'aws-s3') {
                        return $mockAdapter;
                    }
                })
        );

        $this->app();

        /** @var Manager $manager */
        $manager = $this->app()->getContainer()->make(Manager::class);

        // aws-s3 should be available
        $adapters = $manager->adapters();
        $this->assertTrue($adapters->has('aws-s3'));
        $this->assertEquals(1, $adapters->count());

        // Standard case (aws-s3 -> awsS3 method) should work
        $adapter = $manager->instantiate('aws-s3');
        $this->assertSame($mockAdapter, $adapter);
    }
}
