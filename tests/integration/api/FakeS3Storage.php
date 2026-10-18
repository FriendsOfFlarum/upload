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

use Aws\CommandInterface;
use Aws\Result;
use Aws\S3\Exception\S3Exception;
use Aws\S3\S3Client;
use Flarum\Extend;
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Upload\Adapters\AwsS3;
use FoF\Upload\Events\Adapter\Instantiate;
use GuzzleHttp\Promise\Create;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\Utils;
use League\Flysystem\AwsS3V3\AwsS3V3Adapter;
use Psr\Http\Message\RequestInterface;

/**
 * The real aws-s3 upload adapter, Flysystem adapter and S3Client, with only the
 * HTTP transport replaced: every S3 command is recorded and answered locally.
 * Real adapter instances matter, as FileRepository checks get_class().
 */
trait FakeS3Storage
{
    /** @var list<array{command: string, key: ?string}> */
    protected array $s3Commands = [];

    /** @var array<string, string> the bucket's contents, by key */
    protected array $s3Objects = [];

    /** @var (callable(string, ?string): bool|int)|null decides which commands fail: true, or an HTTP status */
    protected $s3Fails = null;

    protected function useFakeS3(): void
    {
        $this->extend(
            (new Extend\Event())->listen(Instantiate::class, function (Instantiate $event) {
                if ($event->adapter !== 'aws-s3') {
                    return null;
                }

                $client = new S3Client([
                    'region'      => 'us-east-1',
                    'version'     => 'latest',
                    'credentials' => ['key' => 'test', 'secret' => 'test'],
                    'handler'     => function (CommandInterface $command, ?RequestInterface $request = null) {
                        $key = $command['Key'] ?? null;
                        $this->s3Commands[] = ['command' => $command->getName(), 'key' => $key];

                        $failure = $this->s3Fails !== null ? ($this->s3Fails)($command->getName(), $key) : false;

                        if ($failure !== false) {
                            // An int answers with that HTTP status (404: no such object).
                            $context = is_int($failure) ? ['response' => new Response($failure)] : [];

                            return Create::rejectionFor(new S3Exception('Simulated S3 failure', $command, $context));
                        }

                        // A minimal bucket, so reads see what was written.
                        switch ($command->getName()) {
                            case 'PutObject':
                                $this->s3Objects[$key] = (string) $command['Body'];
                                break;
                            case 'DeleteObject':
                                unset($this->s3Objects[$key]);
                                break;
                            case 'GetObject':
                            case 'HeadObject':
                                if (!array_key_exists($key, $this->s3Objects)) {
                                    return Create::rejectionFor(new S3Exception('Not found', $command, ['response' => new Response(404)]));
                                }

                                return Create::promiseFor(new Result(
                                    $command->getName() === 'GetObject' ? ['Body' => Utils::streamFor($this->s3Objects[$key])] : []
                                ));
                        }

                        return Create::promiseFor(new Result([]));
                    },
                ]);

                return new AwsS3(
                    new AwsS3V3Adapter($client, 'test-bucket'),
                    resolve(SettingsRepositoryInterface::class),
                    resolve(UrlGenerator::class),
                    null,
                    'test-bucket',
                    'us-east-1'
                );
            })
        );
    }

    /**
     * @return list<?string> object keys the given S3 command was sent for
     */
    protected function s3Keys(string $command): array
    {
        return array_values(array_map(
            fn (array $c) => $c['key'],
            array_filter($this->s3Commands, fn (array $c) => $c['command'] === $command)
        ));
    }
}
