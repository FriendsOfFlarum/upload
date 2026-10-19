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

namespace FoF\Upload\Tests\unit\Formatter;

use FoF\Upload\File;
use FoF\Upload\Formatter\TextPreview\TextSnippets;
use FoF\Upload\Helpers\Util;
use Illuminate\Contracts\Filesystem\Factory;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/**
 * How a text file's first lines become its snippet.
 */
class TextSnippetsTest extends TestCase
{
    /**
     * @return array{0: ?string, 1: ?bool}
     */
    private function snippetOf(string $contents): array
    {
        $stream = fopen('php://memory', 'r+');
        fwrite($stream, $contents);
        rewind($stream);

        $file = new File();
        (new TextSnippets($this->createStub(Util::class), $this->createStub(Factory::class)))->fill($file, $stream);
        fclose($stream);

        return [$file->text_snippet, $file->text_snippet_has_more];
    }

    /**
     * A byte of 0x85 inside a character is not a line break: it's how UTF-8
     * writes Å, х, ą and many more.
     */
    public static function languages(): array
    {
        return [
            'Danish'  => ["Århus\nÅlborg\n"],
            'Russian' => ["хорошо\nпривет\n"],
            'Polish'  => ["są\nżółć\n"],
            'CJK'     => ["七月\n日本語\n"],
            'Greek'   => ["καλημέρα\nκόσμε\n"],
        ];
    }

    #[Test]
    #[DataProvider('languages')]
    public function letters_are_kept_whole(string $contents): void
    {
        $this->assertSame([rtrim($contents, "\n"), false], $this->snippetOf($contents));
    }

    public static function lineEndings(): array
    {
        return [
            'LF'   => ["one\ntwo\nthree\n"],
            'CRLF' => ["one\r\ntwo\r\nthree\r\n"],
            'CR'   => ["one\rtwo\rthree\r"],
        ];
    }

    #[Test]
    #[DataProvider('lineEndings')]
    public function every_line_ending_splits_lines(string $contents): void
    {
        $this->assertSame(["one\ntwo\nthree", false], $this->snippetOf($contents));
    }

    #[Test]
    public function a_crlf_split_across_reads_is_one_line_break(): void
    {
        // Reads are 8192 bytes. Blank lines (skipped) put the \r at the end of
        // the first read and its \n at the start of the next.
        $contents = 'x'.str_repeat("\n", 8189).'y'."\r\nsecond\r\n";

        $this->assertSame(["x\ny\nsecond", false], $this->snippetOf($contents));
    }

    #[Test]
    public function a_character_split_across_reads_is_kept_whole(): void
    {
        // Å is two bytes: 0xC3 ends the first read, 0x85 starts the next.
        $contents = 'x'.str_repeat("\n", 8190).'Å'."\nnext\n";

        $this->assertSame(["x\nÅ\nnext", false], $this->snippetOf($contents));
    }

    #[Test]
    public function a_snippet_cut_short_by_its_length_cap_says_there_is_more(): void
    {
        [$snippet, $hasMore] = $this->snippetOf(str_repeat('a', TextSnippets::MAX_LENGTH + 10)."\n");

        $this->assertSame(TextSnippets::MAX_LENGTH, mb_strlen($snippet));
        $this->assertTrue($hasMore);
    }

    #[Test]
    public function blank_lines_are_skipped_and_the_first_five_kept(): void
    {
        $this->assertSame(["l1\nl2\nl3\nl4\nl5", true], $this->snippetOf("l1\n\n  \nl2\r\nl3\nl4\nl5\nl6\n"));
    }
}
