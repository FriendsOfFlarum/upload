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

namespace FoF\Upload\Tests\unit\Adapters;

use Flarum\Foundation\Paths;
use Flarum\Foundation\ValidationException;
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Adapters\Manager;
use FoF\Upload\Driver\Config;
use FoF\Upload\Helpers\Util;
use Illuminate\Contracts\Events\Dispatcher;
use Mockery as m;
use PHPUnit\Framework\TestCase;

class ManagerTest extends TestCase
{
    protected $manager;
    protected $events;
    protected $paths;
    protected $util;
    protected $settings;
    protected $url;
    protected $config;

    protected function setUp(): void
    {
        parent::setUp();

        $this->events = m::mock(Dispatcher::class);
        $this->paths = m::mock(Paths::class);
        $this->util = m::mock(Util::class);
        $this->settings = m::mock(SettingsRepositoryInterface::class);
        $this->url = m::mock(UrlGenerator::class);
        $this->config = m::mock(Config::class);

        $this->manager = new Manager(
            $this->events,
            $this->paths,
            $this->util,
            $this->settings,
            $this->url,
            $this->config
        );
    }

    protected function tearDown(): void
    {
        m::close();
        parent::tearDown();
    }

    /** @test */
    public function adapters_returns_collection_with_aws_s3_when_s3client_available()
    {
        $this->events->shouldReceive('dispatch')->once();

        $adapters = $this->manager->adapters();

        $this->assertTrue($adapters->get('aws-s3'));
        // TODO: Flarum 2.0 - Remove 'awss3' assertion when backward compatibility is dropped
        $this->assertTrue($adapters->get('awss3'));
    }

    /** @test */
    public function adapters_always_includes_local_and_imgur()
    {
        $this->events->shouldReceive('dispatch')->once();

        $adapters = $this->manager->adapters();

        $this->assertTrue($adapters->get('local'));
        $this->assertTrue($adapters->get('imgur'));
    }

    /** @test */
    public function instantiate_throws_exception_for_unconfigured_adapter()
    {
        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('No adapter configured for nonexistent');

        $this->events->shouldReceive('dispatch')->once();

        $this->manager->instantiate('nonexistent');
    }

    /**
     * @test
     * TODO: Flarum 2.0 - Remove this test when 'awss3' backward compatibility is dropped
     */
    public function instantiate_normalizes_awss3_to_aws_s3()
    {
        // Mock the Collecting event dispatch
        $this->events->shouldReceive('dispatch')->once();

        // Mock the Instantiate event dispatch - should return null so Manager uses its own method
        $this->events->shouldReceive('until')->once()->andReturn(null);

        // Mock the config to return valid S3 configuration
        $this->config->shouldReceive('getS3Config')->once()->andReturn([
            'region'                  => 'us-east-1',
            'version'                 => 'latest',
            'endpoint'                => null,
            'use_path_style_endpoint' => false,
            'credentials'             => [
                'key'    => 'test-key',
                'secret' => 'test-secret',
            ],
            'bucket' => 'test-bucket',
        ]);

        // Mock settings for AwsS3 adapter constructor
        $this->settings->shouldReceive('get')->andReturn(null);
        $this->url->shouldReceive('to')->andReturnSelf();
        $this->url->shouldReceive('route')->andReturn('http://example.com');

        // This should NOT throw an exception - 'awss3' should be normalized to 'aws-s3'
        $adapter = $this->manager->instantiate('awss3');

        $this->assertInstanceOf(\FoF\Upload\Adapters\AwsS3::class, $adapter);
    }

    /** @test */
    public function instantiate_works_with_aws_s3_hyphenated_name()
    {
        // Mock the Collecting event dispatch
        $this->events->shouldReceive('dispatch')->once();

        // Mock the Instantiate event dispatch - should return null so Manager uses its own method
        $this->events->shouldReceive('until')->once()->andReturn(null);

        // Mock the config to return valid S3 configuration
        $this->config->shouldReceive('getS3Config')->once()->andReturn([
            'region'                  => 'us-east-1',
            'version'                 => 'latest',
            'endpoint'                => null,
            'use_path_style_endpoint' => false,
            'credentials'             => [
                'key'    => 'test-key',
                'secret' => 'test-secret',
            ],
            'bucket' => 'test-bucket',
        ]);

        // Mock settings for AwsS3 adapter constructor
        $this->settings->shouldReceive('get')->andReturn(null);
        $this->url->shouldReceive('to')->andReturnSelf();
        $this->url->shouldReceive('route')->andReturn('http://example.com');

        // This should work with the standard hyphenated name
        $adapter = $this->manager->instantiate('aws-s3');

        $this->assertInstanceOf(\FoF\Upload\Adapters\AwsS3::class, $adapter);
    }

    /** @test */
    public function instantiate_works_with_local_adapter()
    {
        // Mock the Collecting event dispatch
        $this->events->shouldReceive('dispatch')->once();

        // Mock the Instantiate event dispatch - should return null so Manager uses its own method
        $this->events->shouldReceive('until')->once()->andReturn(null);

        // Use a temporary directory for testing
        $tempDir = sys_get_temp_dir().'/fof-upload-test-'.uniqid();
        mkdir($tempDir, 0777, true);
        $this->paths->public = $tempDir;

        // Mock settings and url for Local adapter constructor
        $this->settings->shouldReceive('get')->andReturn(null);
        $this->url->shouldReceive('to')->andReturnSelf();
        $this->url->shouldReceive('route')->andReturn('http://example.com');

        $adapter = $this->manager->instantiate('local');

        $this->assertInstanceOf(\FoF\Upload\Adapters\Local::class, $adapter);

        // Clean up
        if (is_dir($tempDir.'/assets/files')) {
            rmdir($tempDir.'/assets/files');
        }
        if (is_dir($tempDir.'/assets')) {
            rmdir($tempDir.'/assets');
        }
        if (is_dir($tempDir)) {
            rmdir($tempDir);
        }
    }
}
