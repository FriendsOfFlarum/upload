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

namespace FoF\Upload\Repositories;

use Carbon\Carbon;
use Flarum\Foundation\Paths;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use FoF\Upload\Adapters\Manager;
use FoF\Upload\Commands\Download as DownloadCommand;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\Download;
use FoF\Upload\Exceptions\InvalidUploadException;
use FoF\Upload\File;
use FoF\Upload\Validators\UploadValidator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Str;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use Psr\Http\Message\UploadedFileInterface;
use Ramsey\Uuid\Uuid;
use SoftCreatR\MimeDetector\MimeDetector;
use Symfony\Component\HttpFoundation\File\UploadedFile as Upload;

class FileRepository
{
    /**
     * @var string
     */
    protected $path;
    /**
     * @var UploadValidator
     */
    private $validator;

    /**
     * @var MimeDetector
     */
    private $mimeDetector;
    /**
     * @var SettingsRepositoryInterface
     */
    private $settings;

    public function __construct(Paths $paths, UploadValidator $validator, MimeDetector $mimeDetector, SettingsRepositoryInterface $settings)
    {
        $this->path = $paths->storage;
        $this->validator = $validator;
        $this->mimeDetector = $mimeDetector;
        $this->settings = $settings;
    }

    /**
     * @param $uuid
     *
     * @return File|Model
     */
    public function findByUuid($uuid)
    {
        return File::query()
            ->with('downloads')
            ->where('uuid', $uuid)
            ->first();
    }

    /**
     * @param Upload $file
     * @param User   $actor
     * @param string $mime
     *
     * @throws \Exception
     *
     * @return File
     */
    public function createFileFromUpload(Upload $file, User $actor, string $mime)
    {
        // Generate a guaranteed unique Uuid.
        while ($uuid = Uuid::uuid4()->toString()) {
            if (!$this->findByUuid($uuid)) {
                break;
            }
        }

        return (new File())->forceFill([
            'uuid'      => $uuid,
            'base_name' => $this->getBasename($file, $uuid),
            'size'      => $file->getSize(),
            'type'      => $mime,
            'actor_id'  => $actor->id,
        ]);
    }

    /**
     * @param UploadedFileInterface $upload
     *
     * @throws InvalidUploadException
     * @throws \Illuminate\Validation\ValidationException
     *
     * @return Upload
     */
    public function moveUploadedFileToTemp(UploadedFileInterface $upload)
    {
        $this->handleUploadError($upload->getError());

        // Move the file to a temporary location first.
        /**
         * sometimes function tempnam() maybe show notice
         * https://www.php.net/manual/zh/function.tempnam.php.
         *
         * Please note that this function might throw a notice in PHP 7.1.0 and above.
         * This was a bugfix: https://bugs.php.net/bug.php?id=69489
         * PHP Notice:tempnam(): file created in the system's temporary directory
         *
         * That Notice will lead to
         * Fatal error: Uncaught Laminas\HttpHandlerRunner\Exception\EmitterException:
         * Output has been emitted previously; cannot emit response
         */
        $tempFile = @tempnam($this->path.'/tmp', 'fof.upload.');
        $upload->moveTo($tempFile);

        $file = new Upload(
            $tempFile,
            $upload->getClientFilename(),
            $upload->getClientMediaType(),
            $upload->getError(),
            true
        );

        $this->validator->assertValid(compact('file'));

        return $file;
    }

    /**
     * @param $code
     *
     * @throws InvalidUploadException
     */
    protected function handleUploadError($code): void
    {
        switch ($code) {
            case UPLOAD_ERR_INI_SIZE:
                throw new InvalidUploadException('max_upload_file_size_ini', 413);
            case UPLOAD_ERR_FORM_SIZE:
                throw new InvalidUploadException('max_upload_file_size_form', 413);
            case UPLOAD_ERR_PARTIAL:
                throw new InvalidUploadException('partial_upload', 206);
            case UPLOAD_ERR_NO_FILE:
                throw new InvalidUploadException('no_file_uploaded', 400);
            case UPLOAD_ERR_NO_TMP_DIR:
                throw new InvalidUploadException('no_upload_tmp_folder', 500);
            case UPLOAD_ERR_CANT_WRITE:
                throw new InvalidUploadException('cannot_write_to_disk', 500);
            case UPLOAD_ERR_EXTENSION:
                throw new InvalidUploadException('upload_blocked_by_php_extension', 500);
            case UPLOAD_ERR_OK:
                break;
        }
    }

    /**
     * Deletes a file from the temporary file location.
     *
     * @param Upload $file
     *
     * @throws \League\Flysystem\FileNotFoundException
     *
     * @return bool
     */
    public function removeFromTemp(Upload $file)
    {
        return $this->getTempFilesystem($file->getPath())->delete($file->getBasename());
    }

    /**
     * Retrieves a filesystem manager for the temporary file location.
     *
     * @param string $path
     *
     * @return Filesystem
     */
    protected function getTempFilesystem($path)
    {
        return new Filesystem(new Local($path));
    }

    /**
     * Chooses a file extension for the upload.
     *
     * @param Upload $upload
     *
     * @return string
     */
    protected function determineExtension(Upload $upload): string
    {
        $whitelistedClientExtensions = explode(',', $this->settings->get('fof-upload.whitelistedClientExtensions', ''));

        $originalClientExtension = $upload->getClientOriginalExtension();

        // Check the extension is not blank and is in the whitelist
        if ($originalClientExtension && in_array($originalClientExtension, $whitelistedClientExtensions)) {
            return $originalClientExtension;
        }

        $guessed = $upload->guessExtension();

        if ($guessed) {
            return $guessed;
        }

        return 'bin';
    }

    /**
     * @param Upload $upload
     * @param string $uuid
     *
     * @return string
     */
    protected function getBasename(Upload $upload, $uuid)
    {
        $name = pathinfo($upload->getClientOriginalName(), PATHINFO_FILENAME);

        $slug = trim(Str::slug($name));

        return sprintf(
            '%s.%s',
            empty($slug) ? $uuid : $slug,
            $this->determineExtension($upload)
        );
    }

    /**
     * @param Upload        $upload
     * @param UploadAdapter $adapter
     *
     * @throws \League\Flysystem\FileNotFoundException
     *
     * @return bool|false|resource|string
     */
    public function readUpload(Upload $upload, UploadAdapter $adapter)
    {
        $filesystem = $this->getTempFilesystem($upload->getPath());

        return $adapter->supportsStreams()
            ? $filesystem->readStream($upload->getBasename())
            : $filesystem->read($upload->getBasename());
    }

    /**
     * @param File            $file
     * @param DownloadCommand $command
     *
     * @return Download
     */
    public function downloadedEntry(File $file, DownloadCommand $command)
    {
        $download = new Download();

        $download->forceFill([
            'file_id'       => $file->id,
            'discussion_id' => $command->discussionId,
            'post_id'       => $command->postId,
            'downloaded_at' => new Carbon(),
        ]);

        if ($command->actor && !$command->actor->isGuest()) {
            $download->actor_id = $command->actor->id;
        }

        $download->save();

        return $download;
    }

    public function matchFilesForPost(Post $post): void
    {
        $table = $this->getTable();

        $db = (new File())->getConnection();

        File::query()
            // Files already mapped to the post.
            ->whereHas('posts', fn ($query) => $query->where('posts.id', $post->id))
            // Files found in (new) content.
            ->orWhereExists(fn ($query) => $query->select($db->raw(1))->from('posts')->where('posts.id', $post->id)->whereColumn('posts.content', 'like', $db->raw("CONCAT('%', $table.url, '%')")))
            // Loop over every found item to de- or attach.
            ->each(function (File $file) use ($post) {
                if (Str::contains($post->content, $file->url)) {
                    $file->posts()->attach($post);
                } else {
                    $file->posts()->detach($post);
                }
            });
    }

    public function matchPosts(): int
    {
        $table = $this->getTable();
        $db = (new File())->getConnection();

        $changes = 0;

        // Finds files and the posts they have been published in.
        File::query()
            // Sorting is required when using each, for bulk querying.
            ->orderBy("$table.id")
            // Load everything for files, and any matched post ids concatenated.
            ->select("$table.*", $db->raw('group_concat(distinct posts.id) as matched_post_ids'))
            // Join on the posts table so that we can find posts that contain the file url.
            ->leftJoin('posts', function (JoinClause $join) use ($table, $db) {
                $join
                    ->on("$table.actor_id", '=', 'posts.user_id')
                    ->where('posts.content', 'like', $db->raw("CONCAT('%', $table.url, '%')"));
            })
            // Group the results by file id, this works together with the group_concat in the select.
            ->groupBy("$table.id")
            // Now loop over all discovered files.
            ->each(function (File $file) use (&$changes) {
                // Sync attaches and detaches in one swoop. This updates the intermediate table.
                // $file->matched_post_ids contains all posts by author that contain the file url.
                $attached = $file->posts()->sync(
                    array_filter(explode(',', $file->matched_post_ids ?? ''))
                );

                $changes += count($attached);
            });

        return $changes;
    }

    public function cleanUp(Carbon $before, callable $confirm = null): int
    {
        /** @var Manager $manager */
        $manager = resolve(Manager::class);

        $count = 0;

        File::query()
            ->whereDoesntHave('posts')
            ->where('created_at', '<', $before)
            ->each(function (File $file) use ($manager, &$count, $confirm) {
                $adapter = $manager->instantiate($file->upload_method);

                if ($confirm !== null && $confirm($file, $adapter) !== true) {
                    return;
                }

                if ($adapter->delete($file)) {
                    $file->delete() && $count++;
                }
            });

        return $count;
    }

    protected function getTable(): string
    {
        $file = new File();

        $prfx = $file->getConnection()->getTablePrefix();
        $table = $file->getTable();

        // join the prefix to the table name (if it exists)
        $table = $prfx.$table;

        return $table;
    }
}
