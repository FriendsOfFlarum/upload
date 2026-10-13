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

use Flarum\Extend;
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use FoF\Upload\Adapters\AwsS3;
use FoF\Upload\Data\Uploads;
use FoF\Upload\Events\Adapter\Instantiate;
use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Promise\Create;
use GuzzleHttp\Psr7\Response;
use Illuminate\Contracts\Filesystem\Factory;
use League\Flysystem\Config;
use League\Flysystem\InMemory\InMemoryFilesystemAdapter;
use PHPUnit\Framework\Attributes\Test;
use Psr\Http\Message\RequestInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * A user's GDPR export includes the files they uploaded.
 */
class GdprExportTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    /** Where "aws-s3" files are kept in these tests. */
    protected InMemoryFilesystemAdapter $storage;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('flarum-gdpr', 'fof-upload');

        $this->storage = new InMemoryFilesystemAdapter();

        $this->extend(
            (new Extend\Event())->listen(Instantiate::class, function (Instantiate $event) {
                return $event->adapter === 'aws-s3'
                    ? new AwsS3($this->storage, resolve(SettingsRepositoryInterface::class), resolve(UrlGenerator::class))
                    : null;
            })
        );

        $this->prepareDatabase([
            User::class        => [$this->normalUser()],
            'fof_upload_files' => [
                $this->file(1, 'aws-s3', 'stored.txt'),
                $this->file(2, 'aws-s3', 'missing.txt'),
                $this->file(3, 'retired-adapter', 'elsewhere.txt'),
            ],
        ]);
    }

    protected function file(int $id, string $method, string $name): array
    {
        return [
            'id'            => $id, 'uuid' => "00000000-0000-0000-0000-00000000000$id",
            'base_name'     => $name, 'path' => "files/$name",
            // Nothing listens here, so fetching it fails at once.
            'url'           => "http://127.0.0.1:9/files/$name",
            'type'          => 'text/plain', 'size' => 5,
            'upload_method' => $method, 'actor_id' => 2,
            'shared'        => false, 'created_at' => '2026-01-01 00:00:00',
        ];
    }

    /**
     * The files the export would contain, as path => contents.
     */
    protected function export(): array
    {
        $container = $this->app()->getContainer();

        $uploads = new Uploads(
            User::find(2),
            null,
            $container->make(Factory::class),
            $container->make(SettingsRepositoryInterface::class),
            $container->make(UrlGenerator::class),
            $container->make(TranslatorInterface::class)
        );

        return array_merge(...($uploads->export() ?? []));
    }

    #[Test]
    public function stored_files_are_read_from_storage_rather_than_their_public_url()
    {
        $this->app();
        $this->storage->write('files/stored.txt', 'hello', new Config());

        $this->assertSame('hello', $this->export()['uploads/files/stored.txt'] ?? null);
    }

    #[Test]
    public function a_file_that_cannot_be_retrieved_is_listed_rather_than_left_out()
    {
        $this->app();

        $notIncluded = json_decode($this->export()['uploads/not-included.json'] ?? '[]', true);

        $this->assertContains('missing.txt', array_column($notIncluded, 'name'));
    }

    /**
     * A file only reachable at its URL is fetched over HTTP, and a server that
     * never answers must not hold the export up until the queue gives up on it.
     */
    #[Test]
    public function a_file_fetched_from_its_url_is_given_up_on_rather_than_waited_for()
    {
        $requests = [];
        $stack = HandlerStack::create(function (RequestInterface $request, array $options) use (&$requests) {
            $requests[(string) $request->getUri()] = $options;

            return Create::promiseFor(str_ends_with($request->getUri()->getPath(), 'elsewhere.txt')
                ? new Response(200, [], 'from the url')
                : new Response(404));
        });

        $this->app()->getContainer()->instance(Client::class, new Client(['handler' => $stack]));

        $this->assertSame('from the url', $this->export()['uploads/files/elsewhere.txt'] ?? null);

        $options = $requests['http://127.0.0.1:9/files/elsewhere.txt'] ?? [];
        $this->assertGreaterThan(0, $options['connect_timeout'] ?? 0);
        $this->assertGreaterThan(0, $options['timeout'] ?? 0);
    }
}
