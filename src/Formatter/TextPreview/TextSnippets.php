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

namespace FoF\Upload\Formatter\TextPreview;

use FoF\Upload\Adapters\Flysystem;
use FoF\Upload\Downloader\DefaultDownloader;
use FoF\Upload\File;
use FoF\Upload\Helpers\Util;
use Illuminate\Contracts\Filesystem\Factory;
use Throwable;

/**
 * The first lines a text preview shows, kept on the file so rendering never
 * reads storage: worked out at upload, or once on first render for older files.
 */
class TextSnippets
{
    public const LINES = 5;

    /** Characters; keeps a minified one-line file out of the page and within the column. */
    public const MAX_LENGTH = 4000;

    /** Bytes read looking for the first lines, so a huge file is never read whole. */
    protected const READ_LIMIT = 65536;

    public function __construct(
        protected Util $util,
        protected Factory $filesystems
    ) {
    }

    /**
     * The file's snippet, reading it from storage and keeping it if it hasn't
     * been worked out yet. Null when the file can't be read: nothing is kept,
     * so a later render tries again.
     *
     * @return array{snippet: string, hasMore: bool}|null
     */
    public function for(File $file): ?array
    {
        if ($file->text_snippet === null) {
            $stream = $this->open($file);

            if ($stream === null) {
                return null;
            }

            try {
                $this->fill($file, $stream);
            } finally {
                fclose($stream);
            }

            // By key rather than save(): the file may have been loaded with
            // attributes of a relation that aren't columns.
            File::query()->whereKey($file->getKey())->update([
                'text_snippet'          => $file->text_snippet,
                'text_snippet_has_more' => $file->text_snippet_has_more,
            ]);
        }

        return ['snippet' => $file->text_snippet, 'hasMore' => (bool) $file->text_snippet_has_more];
    }

    /**
     * Set the file's snippet from its contents. Lines are split as \R does and
     * blank ones are skipped.
     *
     * @param resource $stream
     */
    public function fill(File $file, $stream): void
    {
        $lines = [];
        $buffer = '';
        $read = 0;

        while (count($lines) <= self::LINES && $read < self::READ_LIMIT && !feof($stream)) {
            $chunk = fread($stream, 8192);

            if ($chunk === false || $chunk === '') {
                break;
            }

            $read += strlen($chunk);
            $parts = preg_split('/\R/', $buffer.$chunk);
            // The last part may be a line that continues in the next chunk.
            $buffer = array_pop($parts);

            foreach ($parts as $line) {
                if (trim($line) !== '') {
                    $lines[] = $line;
                }
            }
        }

        $complete = feof($stream);

        if (trim($buffer) !== '') {
            $lines[] = $buffer;
        }

        $snippet = implode("\n", array_slice($lines, 0, self::LINES));

        $file->text_snippet = mb_substr(mb_scrub($snippet, 'UTF-8'), 0, self::MAX_LENGTH, 'UTF-8');
        $file->text_snippet_has_more = count($lines) > self::LINES || !$complete;
    }

    /**
     * @return resource|null
     */
    protected function open(File $file)
    {
        // Broad on purpose: whatever storage throws, the post must still render.
        try {
            if ($this->util->isPrivateShared($file)) {
                return $this->filesystems->disk('private-shared')->readStream($file->path);
            }

            $adapter = $this->util->getStorageAdapterForFile($file);

            if ($adapter instanceof Flysystem) {
                return $adapter->readStream($file);
            }

            // Adapters that can't read their own storage: their public URL.
            $response = resolve(DefaultDownloader::class)->download($file);

            return $response->getStatusCode() === 200 ? $response->getBody()->detach() : null;
        } catch (Throwable) {
            return null;
        }
    }
}
