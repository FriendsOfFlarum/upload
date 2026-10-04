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

use FoF\Upload\Helpers\Util;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/**
 * The mapping a fresh install uses before the admin saves their own.
 *
 * It is matched against the name php-mime-detector returns, so it has to list that
 * name — 5.2 calls an animated PNG `image/apng`, not `image/png`.
 */
class UtilDefaultMimeTypesTest extends TestCase
{
    private function makeUtil(): Util
    {
        $util = $this->getMockBuilder(Util::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getAvailableUploadMethods', 'getMimeTypesConfiguration'])
            ->getMock();

        $util->method('getAvailableUploadMethods')->willReturn(collect(['local' => 'Local']));
        $util->method('getMimeTypesConfiguration')->willReturnCallback(fn () => $util->defaultMimeTypes());

        return $util;
    }

    /** @return array<string, array{string}> */
    public static function imageTypes(): array
    {
        return [
            'jpeg'         => ['image/jpeg'],
            'png'          => ['image/png'],
            'animated png' => ['image/apng'],
            'gif'          => ['image/gif'],
            'webp'         => ['image/webp'],
        ];
    }

    #[Test]
    #[DataProvider('imageTypes')]
    public function default_mapping_accepts_images(string $mime): void
    {
        $this->assertNotNull($this->makeUtil()->getMimeConfiguration($mime), "$mime is not allowed by default");
    }

    #[Test]
    public function default_mapping_does_not_accept_everything(): void
    {
        $this->assertNull($this->makeUtil()->getMimeConfiguration('text/html'));
    }
}
