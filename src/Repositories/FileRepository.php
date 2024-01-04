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
use enshrined\svgSanitize\Sanitizer;
use Flarum\Foundation\Paths;
use Flarum\Foundation\ValidationException;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use FoF\Upload\Adapters\Manager;
use FoF\Upload\Commands\Download as DownloadCommand;
use FoF\Upload\Contracts\UploadAdapter;
use FoF\Upload\Download;
use FoF\Upload\Events\File\IsSlugged;
use FoF\Upload\Exceptions\InvalidUploadException;
use FoF\Upload\File;
use FoF\Upload\Validators\UploadValidator;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use Psr\Http\Message\UploadedFileInterface;
use Ramsey\Uuid\Uuid;
use SoftCreatR\MimeDetector\MimeDetector;
use SoftCreatR\MimeDetector\MimeDetectorException;
use Symfony\Component\HttpFoundation\File\UploadedFile as Upload;
use Symfony\Contracts\Translation\TranslatorInterface;

class FileRepository
{
    /**
     * @var string
     */
    protected $path;

    public function __construct(
        Paths $paths,
        private UploadValidator $validator,
        private SettingsRepositoryInterface $settings,
        private Dispatcher $events,
        private Sanitizer $sanitizer,
        private MimeDetector $mimeDetector,
        private TranslatorInterface $translator
    ) {
        $this->path = $paths->storage;
    }

    /**
     * @param $uuid
     *
     * @return File|null
     */
    public function findByUuid($uuid)
    {
        return File::byUuid($uuid)
            ->with('downloads')
            ->first();
    }

    public function createFileFromUpload(
        Upload $file,
        ?User $actor,
        string $mime,
        bool $hideFromMediaManager = false,
        bool $sharedFile = false
    ): File {
        // Generate a guaranteed unique Uuid.
        while ($uuid = Uuid::uuid4()->toString()) {
            if (!$this->findByUuid($uuid)) {
                break;
            }
        }

        $this->events->dispatch(
            $event = new IsSlugged($file, $actor, $mime, $this->getBasename($file, $uuid))
        );

        return (new File())->forceFill([
            'uuid'                    => $uuid,
            'base_name'               => $event->slug,
            'size'                    => $file->getSize(),
            'type'                    => $mime,
            'actor_id'                => $sharedFile ? null : ($actor ? $actor->id : null), // shared files are not associated with a user
            'hidden'                  => $hideFromMediaManager,
            'shared'                  => $sharedFile,
        ]);
    }

    public function moveUploadedFileToTemp(UploadedFileInterface $upload): ?Upload
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

    public function removeFromTemp(Upload $file): bool
    {
        return $this->getTempFilesystem($file->getPath())->delete($file->getBasename());
    }

    protected function getTempFilesystem(string $path): Filesystem
    {
        return new Filesystem(new Local($path));
    }

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

    protected function getBasename(Upload $upload, string $uuid): string
    {
        $name = pathinfo($upload->getClientOriginalName(), PATHINFO_FILENAME);

        $slug = trim(Str::slug($name));

        return sprintf(
            '%s.%s',
            empty($slug) ? $uuid : $slug,
            $this->determineExtension($upload)
        );
    }

    public function readUpload(Upload $upload, ?UploadAdapter $adapter = null)
    {
        $filesystem = $this->getTempFilesystem($upload->getPath());

        return $adapter?->supportsStreams()
            ? $filesystem->readStream($upload->getBasename())
            : $filesystem->read($upload->getBasename());
    }

    public function downloadedEntry(File $file, DownloadCommand $command): Download
    {
        $download = new Download();

        $download->forceFill([
            'file_id'       => $file->id,
            'discussion_id' => $command->discussionId,
            'post_id'       => $command->postId,
            'downloaded_at' => new Carbon(),
        ]);

        if (!$command->actor->isGuest()) {
            $download->actor_id = $command->actor->id;
        }

        $download->save();

        return $download;
    }

    public function matchFilesForPost(Post $post): void
    {
        $table = (new File())->getTable();

        $db = (new File())->getConnection();
        $prefix = $db->getTablePrefix();

        File::query()
            // Files already mapped to the post.
            ->whereHas('posts', fn ($query) => $query->where('posts.id', $post->id))
            // Files found in (new) content.
            ->orWhereExists(
                fn ($query) => $query
                    ->select($db->raw(1))
                    ->from('posts')
                    ->where('posts.id', $post->id)
                    ->whereColumn('posts.content', 'like', $db->raw("CONCAT('%', $prefix$table.url, '%')"))
            )
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
        $table = (new File())->getTable();
        $db = (new File())->getConnection();
        $prefix = $db->getTablePrefix();

        $changes = 0;

        // Finds files and the posts they have been published in.
        File::query()
            // Sorting is required when using each, for bulk querying.
            ->orderBy("$table.id")
            // Load everything for files, and any matched post ids concatenated.
            ->select("$table.*", $db->raw("group_concat(distinct {$prefix}posts.id) as matched_post_ids"))
            // Join on the posts table so that we can find posts that contain the file url.
            ->leftJoin('posts', function (JoinClause $join) use ($table, $db, $prefix) {
                $join
                    ->on("$table.actor_id", '=', 'posts.user_id')
                    ->where('posts.content', 'like', $db->raw("CONCAT('%', $prefix$table.url, '%')"));
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

    /**
     * If an SVG has been uploaded, remove any unwanted tags & attrs, if possible.
     *
     *
     * @param Upload $file
     * @param string $mime
     *
     * @throws ValidationException
     *
     * @return void
     */
    public function sanitizeSvg(Upload $file, string $mime): void
    {
        if (!Str::startsWith($mime, 'image/svg')) {
            return;
        }

        $cleanSvg = $this->sanitizer->sanitize(file_get_contents($file->getPathname()));

        /** @phpstan-ignore-next-line */
        if (!$cleanSvg || $cleanSvg === false) {
            //TODO maybe expose the error list via ValidationException?
            //$issues = $this->sanitizer->getXmlIssues();
            throw new ValidationException(['upload' => $this->translator->trans('fof-upload.api.upload_errors.svg_failure')]);
        }

        file_put_contents($file->getPathname(), $cleanSvg, LOCK_EX);
    }

    /**
     * Determine the mime type of an uploaded file.
     *
     *
     * @param Upload $file
     *
     * @throws ValidationException
     *
     * @return string|null
     */
    public function determineMime(Upload $file): ?string
    {
        try {
            $this->mimeDetector->setFile($file->getPathname());
            $uploadFileData = $this->mimeDetector->getFileType();

            if (Arr::has($uploadFileData, 'mime')) {
                return $uploadFileData['mime'];
            }

            return mime_content_type($file->getPathname());
        } catch (MimeDetectorException|\Exception $e) {
            throw new ValidationException(['upload' => $this->translator->trans('fof-upload.api.upload_errors.could_not_detect_mime')]);
        }
    }

    public function generateFilenameFor(File $file, bool $withFolder = false): string
    {
        $today = (new Carbon());

        $path = $today->timestamp.'-'.$today->micro.'-'.$file->base_name;

        return $withFolder ? sprintf(
            '%s%s%s',
            $today->toDateString(),
            '/',
            $path
        ) : $path;
    }
}
