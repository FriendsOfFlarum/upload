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

namespace FoF\Upload\Tests\unit\Helpers;

use FoF\Upload\Adapters\AwsS3;
use FoF\Upload\Adapters\Imgur;
use FoF\Upload\Adapters\Local;
use FoF\Upload\Helpers\Util;
use League\Flysystem\FilesystemAdapter;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/**
 * Unit tests for Util::setMethod().
 *
 * setMethod() must store the canonical Manager registration key in
 * File::upload_method, not a class-name-derived guess.  Manager::instantiate()
 * stamps the key on the adapter as $adapterKey so setMethod() can read it
 * directly, handling third-party adapters whose class name differs from their
 * registration key.
 */
class UtilSetMethodTest extends TestCase
{
    private function makeUtil(): Util
    {
        return $this->getMockBuilder(Util::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();
    }

    private function makeFlysystemAdapter(string $adapterKey = ''): Local
    {
        $adapter = new Local(
            $this->createStub(FilesystemAdapter::class),
            $this->createStub(\Flarum\Settings\SettingsRepositoryInterface::class),
            $this->createStub(\Flarum\Http\UrlGenerator::class)
        );
        $adapter->adapterKey = $adapterKey;

        return $adapter;
    }

    private function makeImgurAdapter(string $adapterKey = ''): Imgur
    {
        $adapter = new Imgur($this->createStub(\GuzzleHttp\Client::class));
        $adapter->adapterKey = $adapterKey;

        return $adapter;
    }

    // ---------------------------------------------------------------------------

    #[Test]
    public function returns_private_shared_when_no_adapter_given(): void
    {
        $util = $this->makeUtil();
        $this->assertSame('private-shared', $util->setMethod(null));
    }

    #[Test]
    public function uses_adapter_key_when_set_on_local_adapter(): void
    {
        $util = $this->makeUtil();
        $adapter = $this->makeFlysystemAdapter('local');

        $this->assertSame('local', $util->setMethod($adapter));
    }

    #[Test]
    public function uses_adapter_key_when_set_on_aws_s3_adapter(): void
    {
        $util = $this->makeUtil();
        $adapter = new AwsS3(
            $this->createStub(FilesystemAdapter::class),
            $this->createStub(\Flarum\Settings\SettingsRepositoryInterface::class),
            $this->createStub(\Flarum\Http\UrlGenerator::class)
        );
        $adapter->adapterKey = 'aws-s3';

        $this->assertSame('aws-s3', $util->setMethod($adapter));
    }

    #[Test]
    public function uses_adapter_key_for_third_party_adapter_with_custom_key(): void
    {
        // Simulate BlomstraObjectStorage registered under 'blomstra'.
        // Without the fix, setMethod() would have returned 'local' or a class-derived
        // guess; with the fix it returns exactly the key stamped by Manager::instantiate().
        $util = $this->makeUtil();
        $adapter = $this->makeFlysystemAdapter('blomstra');

        $this->assertSame('blomstra', $util->setMethod($adapter));
    }

    #[Test]
    public function uses_adapter_key_for_imgur(): void
    {
        $util = $this->makeUtil();
        $adapter = $this->makeImgurAdapter('imgur');

        $this->assertSame('imgur', $util->setMethod($adapter));
    }

    #[Test]
    public function falls_back_to_class_name_derivation_when_adapter_key_is_empty(): void
    {
        // adapterKey is '' (adapter constructed outside Manager).
        $util = $this->makeUtil();
        $adapter = $this->makeFlysystemAdapter(''); // no key stamped

        // Fallback: class is Local → 'local'
        $this->assertSame('local', $util->setMethod($adapter));
    }

    #[Test]
    public function falls_back_correctly_for_aws_s3_class_name(): void
    {
        // Without adapterKey, AwsS3 class name → 'aws-s3' via the match rule.
        $util = $this->makeUtil();
        $adapter = new AwsS3(
            $this->createStub(FilesystemAdapter::class),
            $this->createStub(\Flarum\Settings\SettingsRepositoryInterface::class),
            $this->createStub(\Flarum\Http\UrlGenerator::class)
        );
        // adapterKey defaults to ''

        $this->assertSame('aws-s3', $util->setMethod($adapter));
    }

    #[Test]
    public function falls_back_correctly_for_imgur_class_name(): void
    {
        $util = $this->makeUtil();
        $adapter = $this->makeImgurAdapter('');

        $this->assertSame('imgur', $util->setMethod($adapter));
    }
}
