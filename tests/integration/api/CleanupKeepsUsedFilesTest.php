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

use Carbon\Carbon;
use Flarum\Foundation\Paths;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Upload\File;
use FoF\Upload\Repositories\FileRepository;
use FoF\Upload\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * fof:upload --map --cleanup must never delete a file a post still shows,
 * whoever wrote that post — including after its uploader's account is gone (#471).
 */
class CleanupKeepsUsedFilesTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    private const OLD = '2020-01-01 00:00:00';

    /** @var array<int, string> file id => what it is */
    private const FILES = [
        1 => 'in-someone-elses-post',
        2 => 'uploader-deleted',
        3 => 'url-only-in-someone-elses-post',
        4 => 'linked-when-saved',
        6 => 'orphan',
    ];

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-upload');

        $file = fn (int $id, ?int $actorId) => [
            'id'            => $id, 'uuid' => 'uuid-'.self::FILES[$id], 'base_name' => self::FILES[$id].'.png',
            'path'          => 'cleanup/'.self::FILES[$id].'.png', 'url' => 'http://localhost/assets/files/cleanup/'.self::FILES[$id].'.png',
            'type'          => 'image/png', 'size' => 10, 'upload_method' => 'local', 'actor_id' => $actorId,
            'shared'        => false, 'created_at' => self::OLD,
        ];
        $post = fn (int $id, ?int $userId, string $content) => [
            'id'         => $id, 'discussion_id' => 1, 'number' => $id, 'user_id' => $userId, 'type' => 'comment',
            'content'    => "<t>$content</t>", 'created_at' => self::OLD,
        ];

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(), // 2 uploads everything below
                ['id' => 3, 'username' => 'someone', 'email' => 'someone@machine.local', 'is_email_confirmed' => true],
            ],
            'discussions' => [
                ['id' => 1, 'title' => 'Cleanup', 'slug' => 'cleanup', 'comment_count' => 4, 'participant_count' => 1, 'created_at' => self::OLD, 'user_id' => 3, 'first_post_id' => 1, 'last_post_id' => 5],
            ],
            'posts' => [
                $post(1, 3, '[upl-image-preview uuid=uuid-in-someone-elses-post url=http://localhost/assets/files/cleanup/in-someone-elses-post.png]'),
                // Its author's account is gone too: core nulls posts.user_id.
                $post(2, null, '[upl-image-preview uuid=uuid-uploader-deleted url=http://localhost/assets/files/cleanup/uploader-deleted.png]'),
                $post(3, 3, 'Look: http://localhost/assets/files/cleanup/url-only-in-someone-elses-post.png'),
                $post(5, 3, '[upl-image-preview uuid=uuid-linked-when-saved url=http://localhost/assets/files/cleanup/linked-when-saved.png]'),
            ],
            'fof_upload_files' => [
                $file(1, 2),
                // Uploaded by an account that has since been deleted.
                $file(2, 99),
                $file(3, 2),
                $file(4, 2),
                $file(6, 2),
            ],
            // As LinkFilesToPostOnSave records it when post 5 was saved.
            'fof_upload_file_posts' => [
                ['file_id' => 4, 'post_id' => 5],
            ],
        ]);
    }

    private function repo(): FileRepository
    {
        return $this->app()->getContainer()->make(FileRepository::class);
    }

    /**
     * @return array<int, list<int>> file id => the posts it's linked to
     */
    private function links(): array
    {
        $links = [];

        foreach (array_keys(self::FILES) as $id) {
            $links[$id] = File::find($id)?->posts()->orderBy('posts.id')->pluck('posts.id')->map(fn ($p) => (int) $p)->all();
        }

        return $links;
    }

    private function cleanUp(): int
    {
        // Each file on disk, so a wrongful delete would really succeed.
        $root = $this->app()->getContainer()->make(Paths::class)->public.'/assets/files/cleanup';
        @mkdir($root, 0777, true);
        foreach (self::FILES as $name) {
            file_put_contents("$root/$name.png", 'png');
        }

        return $this->repo()->cleanUp(Carbon::now()->addDay(), fn () => true);
    }

    #[Test]
    public function map_links_each_file_to_every_post_that_uses_it_whoever_wrote_it(): void
    {
        $this->app();
        $this->repo()->matchPosts();

        $this->assertSame([1 => [1], 2 => [2], 3 => [3], 4 => [5], 6 => []], $this->links());
    }

    #[Test]
    public function map_keeps_a_link_made_when_the_post_was_saved(): void
    {
        $this->app();
        $this->repo()->matchPosts();

        $this->assertSame([5], $this->links()[4]);
    }

    #[Test]
    public function map_then_cleanup_removes_only_the_file_no_post_uses(): void
    {
        $this->app();
        $this->repo()->matchPosts();

        $this->assertSame(1, $this->cleanUp());
        $this->assertSame([1, 2, 3, 4], File::query()->orderBy('id')->pluck('id')->map(fn ($id) => (int) $id)->all());
    }

    #[Test]
    public function cleanup_alone_still_keeps_files_that_posts_use(): void
    {
        $this->app();

        // No --map first: files 1-3 have no links at all.
        $this->assertSame(1, $this->cleanUp());
        $this->assertSame([1, 2, 3, 4], File::query()->orderBy('id')->pluck('id')->map(fn ($id) => (int) $id)->all());
        $this->assertSame([1 => [1], 2 => [2], 3 => [3], 4 => [5]], array_slice($this->links(), 0, 4, true), 'The files it keeps are linked as it goes');
    }

    #[Test]
    public function cleanup_reaches_every_orphan_past_the_first_page(): void
    {
        // More than one page of 1,000: deleting as it goes must not skip any.
        $orphans = [];
        for ($id = 100; $id < 1301; $id++) {
            $orphans[] = [
                'id'            => $id, 'uuid' => "uuid-orphan-$id", 'base_name' => "o$id.png", 'path' => "cleanup/many/o$id.png",
                'url'           => "http://localhost/assets/files/cleanup/many/o$id.png", 'type' => 'image/png', 'size' => 1,
                'upload_method' => 'local', 'actor_id' => 2, 'shared' => false, 'created_at' => self::OLD,
            ];
        }
        $this->prepareDatabase(['fof_upload_files' => $orphans]);
        $this->app();

        // The 1,201 above, plus file 6 from setUp.
        $this->assertSame(1202, $this->cleanUp());
        $this->assertSame(0, File::query()->where('id', '>=', 100)->count());
    }
}
