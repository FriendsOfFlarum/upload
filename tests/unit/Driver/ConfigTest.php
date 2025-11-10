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

namespace FoF\Upload\Tests\unit\Driver;

use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Driver\Config;
use Mockery as m;
use PHPUnit\Framework\TestCase;

class ConfigTest extends TestCase
{
    protected $settings;
    protected $config;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock the settings repository
        $this->settings = m::mock(SettingsRepositoryInterface::class);
        $this->config = new Config($this->settings);

        // Clear all test environment variables to ensure clean state
        $this->clearEnvVars();
    }

    protected function tearDown(): void
    {
        // Clean up any env vars set during tests
        $this->clearEnvVars();

        m::close();
        parent::tearDown();
    }

    protected function clearEnvVars(): void
    {
        $envVars = [
            'FOF_UPLOAD_AWS_S3_KEY',
            'FOF_UPLOAD_AWS_S3_SECRET',
            'FOF_UPLOAD_AWS_S3_BUCKET',
            'FOF_UPLOAD_AWS_S3_REGION',
            'FOF_UPLOAD_AWS_S3_ENDPOINT',
            'FOF_UPLOAD_AWS_S3_PATH_STYLE_ENDPOINT',
            'FOF_UPLOAD_AWS_S3_ACL',
            'FOF_UPLOAD_AWS_S3_CUSTOM_URL',
            'FOF_UPLOAD_AWS_S3_USE_IAM',
            'FOF_UPLOAD_CDN_URL',
        ];

        foreach ($envVars as $key) {
            putenv($key);
        }
    }

    /** @test */
    public function shouldUseEnv_returns_false_when_no_env_vars_set()
    {
        $this->assertFalse($this->config->shouldUseEnv());
    }

    /** @test */
    public function shouldUseEnv_returns_false_when_only_some_env_vars_set()
    {
        putenv('FOF_UPLOAD_AWS_S3_KEY=test-key');
        putenv('FOF_UPLOAD_AWS_S3_SECRET=test-secret');

        $this->assertFalse($this->config->shouldUseEnv());
    }

    /** @test */
    public function shouldUseEnv_returns_true_when_all_required_env_vars_set()
    {
        putenv('FOF_UPLOAD_AWS_S3_KEY=test-key');
        putenv('FOF_UPLOAD_AWS_S3_SECRET=test-secret');
        putenv('FOF_UPLOAD_AWS_S3_BUCKET=test-bucket');
        putenv('FOF_UPLOAD_AWS_S3_REGION=us-west-2');

        $this->assertTrue($this->config->shouldUseEnv());
    }

    /** @test */
    public function shouldUseEnv_returns_true_when_iam_flag_set_with_bucket_and_region()
    {
        putenv('FOF_UPLOAD_AWS_S3_BUCKET=test-bucket');
        putenv('FOF_UPLOAD_AWS_S3_REGION=us-west-2');
        putenv('FOF_UPLOAD_AWS_S3_USE_IAM=true');

        $this->assertTrue($this->config->shouldUseEnv());
    }

    /** @test */
    public function shouldUseEnv_returns_true_when_iam_flag_set_with_various_truthy_values()
    {
        $truthyValues = ['true', 'TRUE', '1', 'yes', 'YES', 'on', 'ON'];

        foreach ($truthyValues as $value) {
            $this->clearEnvVars();
            putenv('FOF_UPLOAD_AWS_S3_BUCKET=test-bucket');
            putenv('FOF_UPLOAD_AWS_S3_REGION=us-west-2');
            putenv("FOF_UPLOAD_AWS_S3_USE_IAM={$value}");

            $this->assertTrue($this->config->shouldUseEnv(), "Failed for value: {$value}");
        }
    }

    /** @test */
    public function shouldUseEnv_returns_false_when_iam_flag_set_but_missing_bucket()
    {
        putenv('FOF_UPLOAD_AWS_S3_REGION=us-west-2');
        putenv('FOF_UPLOAD_AWS_S3_USE_IAM=true');

        $this->assertFalse($this->config->shouldUseEnv());
    }

    /** @test */
    public function shouldUseEnv_returns_false_when_iam_flag_set_but_missing_region()
    {
        putenv('FOF_UPLOAD_AWS_S3_BUCKET=test-bucket');
        putenv('FOF_UPLOAD_AWS_S3_USE_IAM=true');

        $this->assertFalse($this->config->shouldUseEnv());
    }

    /** @test */
    public function shouldUseLocalCdnEnv_returns_false_when_not_set()
    {
        $this->assertFalse($this->config->shouldUseLocalCdnEnv());
    }

    /** @test */
    public function shouldUseLocalCdnEnv_returns_true_when_set()
    {
        putenv('FOF_UPLOAD_CDN_URL=https://cdn.example.com');

        $this->assertTrue($this->config->shouldUseLocalCdnEnv());
    }

    /** @test */
    public function getS3Config_uses_settings_when_env_not_configured()
    {
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Region')->andReturn('us-east-1');
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Endpoint')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3UsePathStyleEndpoint')->andReturn(false);
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Key')->andReturn('settings-key');
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Secret')->andReturn('settings-secret');
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Bucket')->andReturn('settings-bucket');
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3ACL')->andReturn('public-read');
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3CustomUrl')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.cdnUrl')->andReturn(null);

        $config = $this->config->getS3Config();

        $this->assertEquals('us-east-1', $config['region']);
        $this->assertEquals('settings-bucket', $config['bucket']);
        $this->assertEquals('public-read', $config['acl']);
        $this->assertArrayHasKey('credentials', $config);
        $this->assertEquals('settings-key', $config['credentials']['key']);
        $this->assertEquals('settings-secret', $config['credentials']['secret']);
    }

    /** @test */
    public function getS3Config_uses_env_when_configured()
    {
        putenv('FOF_UPLOAD_AWS_S3_KEY=env-key');
        putenv('FOF_UPLOAD_AWS_S3_SECRET=env-secret');
        putenv('FOF_UPLOAD_AWS_S3_BUCKET=env-bucket');
        putenv('FOF_UPLOAD_AWS_S3_REGION=eu-west-1');
        putenv('FOF_UPLOAD_AWS_S3_ACL=private');

        $config = $this->config->getS3Config();

        $this->assertEquals('eu-west-1', $config['region']);
        $this->assertEquals('env-bucket', $config['bucket']);
        $this->assertEquals('private', $config['acl']);
        $this->assertArrayHasKey('credentials', $config);
        $this->assertEquals('env-key', $config['credentials']['key']);
        $this->assertEquals('env-secret', $config['credentials']['secret']);

        // Settings should not be called
        $this->settings->shouldNotHaveReceived('get');
    }

    /** @test */
    public function getS3Config_includes_optional_env_vars_when_set()
    {
        putenv('FOF_UPLOAD_AWS_S3_KEY=env-key');
        putenv('FOF_UPLOAD_AWS_S3_SECRET=env-secret');
        putenv('FOF_UPLOAD_AWS_S3_BUCKET=env-bucket');
        putenv('FOF_UPLOAD_AWS_S3_REGION=us-west-2');
        putenv('FOF_UPLOAD_AWS_S3_ENDPOINT=https://s3-compatible.example.com');
        putenv('FOF_UPLOAD_AWS_S3_PATH_STYLE_ENDPOINT=1');
        putenv('FOF_UPLOAD_AWS_S3_CUSTOM_URL=https://custom.example.com');
        putenv('FOF_UPLOAD_CDN_URL=https://cdn.example.com');

        $config = $this->config->getS3Config();

        $this->assertEquals('https://s3-compatible.example.com', $config['endpoint']);
        $this->assertTrue($config['use_path_style_endpoint']);
        $this->assertEquals('https://custom.example.com', $config['custom_url']);
        $this->assertEquals('https://cdn.example.com', $config['cdn_url']);
    }

    /** @test */
    public function getS3Config_includes_credentials_when_both_key_and_secret_provided_in_env()
    {
        putenv('FOF_UPLOAD_AWS_S3_KEY=test-key');
        putenv('FOF_UPLOAD_AWS_S3_SECRET=test-secret');
        putenv('FOF_UPLOAD_AWS_S3_BUCKET=env-bucket');
        putenv('FOF_UPLOAD_AWS_S3_REGION=us-west-2');

        $config = $this->config->getS3Config();

        $this->assertArrayHasKey('credentials', $config);
        $this->assertEquals('test-key', $config['credentials']['key']);
        $this->assertEquals('test-secret', $config['credentials']['secret']);
    }

    /** @test */
    public function getS3Config_omits_credentials_when_not_provided_in_settings()
    {
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Region')->andReturn('us-east-1');
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Endpoint')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3UsePathStyleEndpoint')->andReturn(false);
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Key')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Secret')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Bucket')->andReturn('settings-bucket');
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3ACL')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3CustomUrl')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.cdnUrl')->andReturn(null);

        $config = $this->config->getS3Config();

        $this->assertArrayNotHasKey('credentials', $config);
    }

    /** @test */
    public function getS3Config_omits_credentials_when_iam_flag_enabled()
    {
        putenv('FOF_UPLOAD_AWS_S3_BUCKET=iam-bucket');
        putenv('FOF_UPLOAD_AWS_S3_REGION=us-east-1');
        putenv('FOF_UPLOAD_AWS_S3_USE_IAM=true');

        $config = $this->config->getS3Config();

        $this->assertEquals('iam-bucket', $config['bucket']);
        $this->assertEquals('us-east-1', $config['region']);
        $this->assertArrayNotHasKey('credentials', $config);

        // Settings should not be called
        $this->settings->shouldNotHaveReceived('get');
    }

    /** @test */
    public function getS3Config_returns_null_values_when_neither_env_nor_settings_configured()
    {
        // When S3 is not configured at all (no env vars, no settings)
        // The config is still built but will have null values for required fields
        // This documents the current behavior - S3Client instantiation will fail later
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Region')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Endpoint')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3UsePathStyleEndpoint')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Key')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Secret')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3Bucket')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3ACL')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.awsS3CustomUrl')->andReturn(null);
        $this->settings->shouldReceive('get')->with('fof-upload.cdnUrl')->andReturn(null);

        $config = $this->config->getS3Config();

        // Config is returned but with null values - will fail when S3Client is instantiated
        $this->assertNull($config['region']);
        $this->assertNull($config['bucket']);
        $this->assertNull($config['endpoint']);
        $this->assertNull($config['acl']);
        $this->assertArrayNotHasKey('credentials', $config);
    }

    /** @test */
    public function getLocalCdnUrl_returns_env_value_when_set()
    {
        putenv('FOF_UPLOAD_CDN_URL=https://cdn.example.com');

        $url = $this->config->getLocalCdnUrl();

        $this->assertEquals('https://cdn.example.com', $url);

        // Settings should not be called
        $this->settings->shouldNotHaveReceived('get');
    }

    /** @test */
    public function getLocalCdnUrl_returns_settings_value_when_env_not_set()
    {
        $this->settings->shouldReceive('get')
            ->with('fof-upload.cdnUrl')
            ->andReturn('https://settings-cdn.example.com');

        $url = $this->config->getLocalCdnUrl();

        $this->assertEquals('https://settings-cdn.example.com', $url);
    }

    /** @test */
    public function getLocalCdnUrl_returns_null_when_neither_env_nor_settings_set()
    {
        $this->settings->shouldReceive('get')
            ->with('fof-upload.cdnUrl')
            ->andReturn(null);

        $url = $this->config->getLocalCdnUrl();

        $this->assertNull($url);
    }

    /** @test */
    public function getS3Acl_returns_env_value_when_s3_env_configured()
    {
        putenv('FOF_UPLOAD_AWS_S3_KEY=env-key');
        putenv('FOF_UPLOAD_AWS_S3_SECRET=env-secret');
        putenv('FOF_UPLOAD_AWS_S3_BUCKET=env-bucket');
        putenv('FOF_UPLOAD_AWS_S3_REGION=us-west-2');
        putenv('FOF_UPLOAD_AWS_S3_ACL=public-read');

        $acl = $this->config->getS3Acl();

        $this->assertEquals('public-read', $acl);
    }

    /** @test */
    public function getS3Acl_returns_settings_value_when_env_not_configured()
    {
        $this->settings->shouldReceive('get')
            ->with('fof-upload.awsS3ACL')
            ->andReturn('private');

        $acl = $this->config->getS3Acl();

        $this->assertEquals('private', $acl);
    }

    /** @test */
    public function getS3CustomUrl_returns_env_value_when_s3_env_configured()
    {
        putenv('FOF_UPLOAD_AWS_S3_KEY=env-key');
        putenv('FOF_UPLOAD_AWS_S3_SECRET=env-secret');
        putenv('FOF_UPLOAD_AWS_S3_BUCKET=env-bucket');
        putenv('FOF_UPLOAD_AWS_S3_REGION=us-west-2');
        putenv('FOF_UPLOAD_AWS_S3_CUSTOM_URL=https://custom.example.com');

        $url = $this->config->getS3CustomUrl();

        $this->assertEquals('https://custom.example.com', $url);
    }

    /** @test */
    public function getS3CustomUrl_returns_settings_value_when_env_not_configured()
    {
        $this->settings->shouldReceive('get')
            ->with('fof-upload.awsS3CustomUrl')
            ->andReturn('https://settings-custom.example.com');

        $url = $this->config->getS3CustomUrl();

        $this->assertEquals('https://settings-custom.example.com', $url);
    }

    /** @test */
    public function getS3CdnUrl_returns_env_value_when_s3_env_configured()
    {
        putenv('FOF_UPLOAD_AWS_S3_KEY=env-key');
        putenv('FOF_UPLOAD_AWS_S3_SECRET=env-secret');
        putenv('FOF_UPLOAD_AWS_S3_BUCKET=env-bucket');
        putenv('FOF_UPLOAD_AWS_S3_REGION=us-west-2');
        putenv('FOF_UPLOAD_CDN_URL=https://s3-cdn.example.com');

        $url = $this->config->getS3CdnUrl();

        $this->assertEquals('https://s3-cdn.example.com', $url);
    }

    /** @test */
    public function getS3CdnUrl_returns_settings_value_when_env_not_configured()
    {
        $this->settings->shouldReceive('get')
            ->with('fof-upload.cdnUrl')
            ->andReturn('https://settings-s3-cdn.example.com');

        $url = $this->config->getS3CdnUrl();

        $this->assertEquals('https://settings-s3-cdn.example.com', $url);
    }
}
