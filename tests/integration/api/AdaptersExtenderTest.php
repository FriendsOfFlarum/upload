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

class AdaptersExtenderTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');
    }

    /**
     * @test
     * TODO: Flarum 2.0 - Remove this test when 'awss3' backward compatibility is dropped
     */
    public function force_extender_limits_available_adapters_to_awss3()
    {
        $this->extend(
            (new Adapters())->force('awss3')
        );

        $this->app();

        /** @var Manager $manager */
        $manager = $this->app()->getContainer()->make(Manager::class);
        $adapters = $manager->adapters();

        // Only 'awss3' should be available
        $this->assertTrue($adapters->has('awss3'));
        $this->assertFalse($adapters->has('aws-s3'));
        $this->assertFalse($adapters->has('local'));
        $this->assertFalse($adapters->has('imgur'));
        $this->assertEquals(1, $adapters->count());
    }

    /**
     * @test
     * TODO: Flarum 2.0 - Remove this test when 'awss3' backward compatibility is dropped
     */
    public function force_extender_allows_instantiation_of_forced_awss3_adapter()
    {
        $this->extend(
            (new Adapters())->force('awss3')
        );

        // Configure S3 settings
        $this->prepareDatabase([
            'settings' => [
                ['key' => 'fof-upload.awsS3Region', 'value' => 'us-east-1'],
                ['key' => 'fof-upload.awsS3Bucket', 'value' => 'test-bucket'],
                ['key' => 'fof-upload.awsS3Key', 'value' => 'test-key'],
                ['key' => 'fof-upload.awsS3Secret', 'value' => 'test-secret'],
            ],
        ]);

        $this->app();

        /** @var Manager $manager */
        $manager = $this->app()->getContainer()->make(Manager::class);

        // Should successfully instantiate 'awss3' thanks to normalization
        // Note: This will actually try to create an S3 client, so we're just testing
        // that the normalization allows the method to be found
        $adapters = $manager->adapters();
        $this->assertTrue($adapters->has('awss3'));

        // We can't fully instantiate without valid AWS credentials, but we can verify
        // the adapter is available in the collection after forcing
        $this->assertEquals(1, $adapters->count());
    }

    /**
     * @test
     */
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
        $this->assertFalse($adapters->has('awss3'));
        $this->assertFalse($adapters->has('local'));
        $this->assertFalse($adapters->has('imgur'));
        $this->assertEquals(1, $adapters->count());
    }

    /**
     * @test
     */
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
        $this->assertFalse($adapters->has('awss3'));
        $this->assertFalse($adapters->has('imgur'));
        $this->assertEquals(1, $adapters->count());

        // Local adapter should be instantiable
        $adapter = $manager->instantiate('local');
        $this->assertInstanceOf(\FoF\Upload\Adapters\Local::class, $adapter);
    }

    /**
     * @test
     */
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
        $this->assertTrue($adapters->has('awss3'));
        $this->assertTrue($adapters->has('local'));
    }

    /**
     * @test
     */
    public function without_extender_all_adapters_are_available()
    {
        $this->app();

        /** @var Manager $manager */
        $manager = $this->app()->getContainer()->make(Manager::class);
        $adapters = $manager->adapters();

        // All adapters should be available by default
        $this->assertTrue($adapters->has('aws-s3'));
        // TODO: Flarum 2.0 - Remove 'awss3' assertion when backward compatibility is dropped
        $this->assertTrue($adapters->has('awss3'));
        $this->assertTrue($adapters->has('local'));
        $this->assertTrue($adapters->has('imgur'));
        $this->assertGreaterThanOrEqual(4, $adapters->count());
    }

    /**
     * @test
     * Tests the scenario: DB has awss3, forced to aws-s3
     * TODO: Flarum 2.0 - Remove this test when 'awss3' backward compatibility is dropped
     */
    public function force_aws_s3_when_db_has_awss3_configuration()
    {
        // Mock adapter that will be returned instead of trying to create real S3Client
        $mockAdapter = \Mockery::mock(\FoF\Upload\Contracts\UploadAdapter::class);

        $this->extend(
            (new Adapters())->force('aws-s3'),

            // Use event listener to provide mock adapter for instantiation
            (new \Flarum\Extend\Event())
                ->listen(\FoF\Upload\Events\Adapter\Instantiate::class, function ($event) use ($mockAdapter) {
                    // Return mock for both 'awss3' and 'aws-s3' to test bidirectional compatibility
                    if (in_array($event->adapter, ['awss3', 'aws-s3'])) {
                        return $mockAdapter;
                    }
                })
        );

        $this->app();

        /** @var Manager $manager */
        $manager = $this->app()->getContainer()->make(Manager::class);
        $adapters = $manager->adapters();

        // Only aws-s3 should be available (forced)
        $this->assertTrue($adapters->has('aws-s3'));
        $this->assertFalse($adapters->has('awss3'));
        $this->assertEquals(1, $adapters->count());

        // With bidirectional compatibility, 'awss3' CAN be instantiated when 'aws-s3' is forced
        // This allows old files with upload_method='awss3' to still work
        $adapter = $manager->instantiate('awss3');
        $this->assertSame($mockAdapter, $adapter);
    }

    /**
     * @test
     * Tests the scenario: DB has aws-s3, forced to awss3
     * TODO: Flarum 2.0 - Remove this test when 'awss3' backward compatibility is dropped
     */
    public function force_awss3_when_db_has_aws_s3_configuration()
    {
        // Mock adapter that will be returned instead of trying to create real S3Client
        $mockAdapter = \Mockery::mock(\FoF\Upload\Contracts\UploadAdapter::class);

        $this->extend(
            (new Adapters())->force('awss3'),

            // Use event listener to provide mock adapter for instantiation
            (new \Flarum\Extend\Event())
                ->listen(\FoF\Upload\Events\Adapter\Instantiate::class, function ($event) use ($mockAdapter) {
                    // Return mock for both 'awss3' and 'aws-s3' to test bidirectional compatibility
                    if (in_array($event->adapter, ['awss3', 'aws-s3'])) {
                        return $mockAdapter;
                    }
                })
        );

        $this->app();

        /** @var Manager $manager */
        $manager = $this->app()->getContainer()->make(Manager::class);
        $adapters = $manager->adapters();

        // Only awss3 should be available (forced)
        $this->assertTrue($adapters->has('awss3'));
        $this->assertFalse($adapters->has('aws-s3'));
        $this->assertEquals(1, $adapters->count());

        // With bidirectional compatibility, 'aws-s3' CAN be instantiated when 'awss3' is forced
        // This allows old files with upload_method='aws-s3' to still work
        $adapter = $manager->instantiate('aws-s3');
        $this->assertSame($mockAdapter, $adapter);
    }

    /**
     * @test
     * Tests that awss3 can be instantiated when forced, demonstrating the normalization fix
     * TODO: Flarum 2.0 - Remove this test when 'awss3' backward compatibility is dropped
     */
    public function awss3_instantiation_works_with_normalization()
    {
        // Mock adapter that will be returned instead of trying to create real S3Client
        $mockAdapter = \Mockery::mock(\FoF\Upload\Contracts\UploadAdapter::class);

        $this->extend(
            (new Adapters())->force('awss3'),

            // Use event listener to provide mock adapter for instantiation
            (new \Flarum\Extend\Event())
                ->listen(\FoF\Upload\Events\Adapter\Instantiate::class, function ($event) use ($mockAdapter) {
                    if (in_array($event->adapter, ['awss3', 'aws-s3'])) {
                        return $mockAdapter;
                    }
                })
        );

        $this->app();

        /** @var Manager $manager */
        $manager = $this->app()->getContainer()->make(Manager::class);

        // awss3 should be available
        $adapters = $manager->adapters();
        $this->assertTrue($adapters->has('awss3'));
        $this->assertEquals(1, $adapters->count());

        // This should work thanks to normalization (awss3 -> aws-s3 -> awsS3 method)
        $adapter = $manager->instantiate('awss3');
        $this->assertSame($mockAdapter, $adapter);
    }

    /**
     * @test
     * Tests that aws-s3 continues to work as expected
     */
    public function aws_s3_instantiation_works_as_standard()
    {
        // Mock adapter that will be returned instead of trying to create real S3Client
        $mockAdapter = \Mockery::mock(\FoF\Upload\Contracts\UploadAdapter::class);

        $this->extend(
            (new Adapters())->force('aws-s3'),

            // Use event listener to provide mock adapter for instantiation
            (new \Flarum\Extend\Event())
                ->listen(\FoF\Upload\Events\Adapter\Instantiate::class, function ($event) use ($mockAdapter) {
                    if (in_array($event->adapter, ['awss3', 'aws-s3'])) {
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
