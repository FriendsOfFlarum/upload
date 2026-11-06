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

use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Adapters\AwsS3;
use FoF\Upload\Driver\Config;
use League\Flysystem\FilesystemAdapter;
use Mockery as m;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class AwsS3Test extends TestCase
{
    protected function tearDown(): void
    {
        m::close();
        parent::tearDown();
    }

    protected function adapter(?string $customUrl, string $prefix): AwsS3
    {
        $config = m::mock(Config::class);
        $config->shouldReceive('getS3CustomUrl')->andReturn($customUrl);
        $config->shouldReceive('getS3CdnUrl')->andReturn(null);

        return new AwsS3(
            m::mock(FilesystemAdapter::class),
            m::mock(SettingsRepositoryInterface::class),
            m::mock(UrlGenerator::class),
            $config,
            'my-bucket',
            'eu-west-2',
            $prefix
        );
    }

    #[Test]
    public function hostName_is_bucket_url_without_prefix()
    {
        $this->assertSame('https://my-bucket.s3.eu-west-2.amazonaws.com', $this->adapter(null, '')->hostName());
    }

    #[Test]
    public function hostName_appends_prefix_to_bucket_url()
    {
        $this->assertSame('https://my-bucket.s3.eu-west-2.amazonaws.com/forum/uploads', $this->adapter(null, 'forum/uploads')->hostName());
    }

    #[Test]
    public function hostName_appends_prefix_to_custom_url()
    {
        $this->assertSame('https://cdn.example.com/forum/uploads', $this->adapter('https://cdn.example.com/', 'forum/uploads')->hostName());
    }
}
