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

namespace FoF\Upload\Tests\unit\Templates;

use FoF\Upload\File;
use FoF\Upload\Templates\FileTemplate;
use FoF\Upload\Templates\ImageTemplate;
use FoF\Upload\Templates\TextPreviewTemplate;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Illuminate\Contracts\View\View;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use s9e\TextFormatter\Configurator;
use s9e\TextFormatter\Unparser;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * The download templates render the BBCode *body* as the visible label — see
 * {SIMPLETEXT1} in file.blade.php. That body was tokenised as SIMPLETEXT, whose
 * filter is `[-a-zA-Z0-9+.,_ ]+`, so a label containing a colon, bracket,
 * apostrophe or ampersand fails to parse and the whole tag degrades to raw
 * BBCode text — the user loses their download button entirely.
 *
 * These tests pin the switch to TEXT, which allows arbitrary label text, and
 * guard the three constraints that switch has to satisfy:
 *
 *   1. Backwards compatible — post XML stored under the old SIMPLETEXT
 *      definition must still render correctly.
 *   2. Editable — an old post must survive an unparse/edit/reparse round trip,
 *      so a display name can be added to existing content.
 *   3. Safe — a freer token must not become an HTML or BBCode injection vector.
 */
#[CoversClass(FileTemplate::class)]
#[CoversClass(ImageTemplate::class)]
#[CoversClass(TextPreviewTemplate::class)]
class DisplayNameTest extends TestCase
{
    private function makeTranslator(): TranslatorInterface
    {
        $translator = $this->createStub(TranslatorInterface::class);
        $translator->method('trans')->willReturnArgument(0);

        return $translator;
    }

    private function makeViewFactory(): ViewFactory
    {
        $factory = $this->createStub(ViewFactory::class);
        $factory->method('make')->willReturn($this->createStub(View::class));

        return $factory;
    }

    private function makeFile(): File
    {
        $file = new File();
        $file->uuid = '35f180d1-a0b7-45fc-a3af-777233725ae0';
        $file->base_name = 'ticket-thu-jan-30-18-35-38-cet-2025.pdf';
        $file->url = 'https://example.com/files/ticket.pdf';
        $file->path = 'uploads/ticket.pdf';
        $file->size = 44032;
        $file->type = 'application/pdf';

        return $file;
    }

    /**
     * Build a working parser/renderer pair for the file download BBCode, using
     * the given body token so old and new definitions can be compared directly.
     */
    private function formatter(string $bodyToken): array
    {
        $configurator = new Configurator();
        $configurator->BBCodes->addCustom(
            '[upl-file uuid={IDENTIFIER} size={SIMPLETEXT2}]{'.$bodyToken.'}[/upl-file]',
            '<div class="ButtonGroup" data-fof-upload-download-uuid="{@uuid}">'
            ."<span class=\"label\">{{$bodyToken}}</span>"
            .'<span class="size"><xsl:value-of select="@size"/></span></div>'
        );

        return $configurator->finalize();
    }

    private function bbcodeFor(string $label): string
    {
        return '[upl-file uuid=35f180d1-a0b7-45fc-a3af-777233725ae0 size=43kB]'.$label.'[/upl-file]';
    }

    // -----------------------------------------------------------------------
    // The bug being fixed
    // -----------------------------------------------------------------------

    /** @return array<string, array{0: string}> */
    public static function punctuatedLabels(): array
    {
        return [
            'colon and brackets' => ['Train ticket: Jan 30 (Brussels)'],
            'apostrophe'         => ["Tom's expense report"],
            'ampersand'          => ['Terms & Conditions'],
            'question mark'      => ['Which venue?'],
            'slash'              => ['Invoice 2026/07'],
            'quotes'             => ['The "final" version'],
        ];
    }

    #[Test]
    #[DataProvider('punctuatedLabels')]
    public function simpletext_body_fails_to_parse_realistic_display_names(string $label): void
    {
        ['parser' => $parser] = $this->formatter('SIMPLETEXT1');

        $xml = $parser->parse($this->bbcodeFor($label));

        // Documents the old behaviour: the tag does not parse, so the post shows
        // raw BBCode instead of a download button.
        $this->assertStringNotContainsString(
            '<UPL-FILE',
            $xml,
            'SIMPLETEXT was expected to reject this label — if it now parses, the premise of this change has shifted'
        );
    }

    #[Test]
    #[DataProvider('punctuatedLabels')]
    public function text_body_parses_realistic_display_names(string $label): void
    {
        ['parser' => $parser, 'renderer' => $renderer] = $this->formatter('TEXT1');

        $xml = $parser->parse($this->bbcodeFor($label));

        $this->assertStringContainsString('<UPL-FILE', $xml, "TEXT should accept the label: $label");
        $this->assertStringContainsString('data-fof-upload-download-uuid', $renderer->render($xml));
    }

    // -----------------------------------------------------------------------
    // Constraint 1: backwards compatibility
    // -----------------------------------------------------------------------

    #[Test]
    public function post_xml_stored_under_simpletext_still_renders_under_text(): void
    {
        // A post saved before this change: parsed and stored with SIMPLETEXT1.
        ['parser' => $oldParser] = $this->formatter('SIMPLETEXT1');
        $storedXml = $oldParser->parse($this->bbcodeFor('ticket-thu-jan-30-18-35-38-cet-2025.pdf'));

        $this->assertStringContainsString('<UPL-FILE', $storedXml);

        // Rendered today, after the switch to TEXT1.
        ['renderer' => $newRenderer] = $this->formatter('TEXT1');
        $html = $newRenderer->render($storedXml);

        $this->assertStringContainsString('ticket-thu-jan-30-18-35-38-cet-2025.pdf', $html);
        $this->assertStringContainsString('data-fof-upload-download-uuid="35f180d1-a0b7-45fc-a3af-777233725ae0"', $html);
        $this->assertStringContainsString('43kB', $html);
    }

    #[Test]
    public function old_and_new_definitions_render_legacy_content_identically(): void
    {
        $bbcode = $this->bbcodeFor('quarterly-report.pdf');

        ['parser'   => $oldParser, 'renderer' => $oldRenderer] = $this->formatter('SIMPLETEXT1');
        ['renderer' => $newRenderer] = $this->formatter('TEXT1');

        $storedXml = $oldParser->parse($bbcode);

        $this->assertSame(
            $oldRenderer->render($storedXml),
            $newRenderer->render($storedXml),
            'Legacy posts must render byte-identically after the token change'
        );
    }

    // -----------------------------------------------------------------------
    // Constraint 2: existing content can be edited to add a display name
    // -----------------------------------------------------------------------

    #[Test]
    public function legacy_post_can_be_edited_to_add_a_punctuated_display_name(): void
    {
        // Stored under the old definition.
        ['parser' => $oldParser] = $this->formatter('SIMPLETEXT1');
        $storedXml = $oldParser->parse($this->bbcodeFor('ticket-thu-jan-30-18-35-38-cet-2025.pdf'));

        // The user clicks edit: Flarum unparses stored XML back to BBCode source.
        $source = Unparser::unparse($storedXml);
        $this->assertSame($this->bbcodeFor('ticket-thu-jan-30-18-35-38-cet-2025.pdf'), $source);

        // They replace the label with something readable, and save.
        $edited = str_replace(
            'ticket-thu-jan-30-18-35-38-cet-2025.pdf',
            'Train ticket: Jan 30 (Brussels)',
            $source
        );

        ['parser' => $newParser, 'renderer' => $newRenderer] = $this->formatter('TEXT1');
        $xml = $newParser->parse($edited);

        $this->assertStringContainsString('<UPL-FILE', $xml, 'Edited legacy post must re-parse');

        $html = $newRenderer->render($xml);
        $this->assertStringContainsString('Train ticket: Jan 30 (Brussels)', $html);
        $this->assertStringContainsString('data-fof-upload-download-uuid', $html);
    }

    // -----------------------------------------------------------------------
    // Constraint 3: the freer token must stay safe
    // -----------------------------------------------------------------------

    #[Test]
    public function display_name_cannot_inject_html(): void
    {
        ['parser' => $parser, 'renderer' => $renderer] = $this->formatter('TEXT1');

        $html = $renderer->render($parser->parse($this->bbcodeFor('Report <script>alert(1)</script>')));

        $this->assertStringNotContainsString('<script>', $html);
        $this->assertStringContainsString('&lt;script&gt;', $html);
    }

    #[Test]
    public function display_name_cannot_inject_attributes(): void
    {
        ['parser' => $parser, 'renderer' => $renderer] = $this->formatter('TEXT1');

        $html = $renderer->render($parser->parse($this->bbcodeFor('x" onerror="alert(1)')));

        $this->assertStringNotContainsString('onerror="alert(1)"', $html);
    }

    #[Test]
    public function display_name_does_not_interpret_nested_bbcode(): void
    {
        ['parser' => $parser, 'renderer' => $renderer] = $this->formatter('TEXT1');

        $html = $renderer->render($parser->parse($this->bbcodeFor('[b]bold[/b] attempt')));

        $this->assertStringNotContainsString('<b>', $html);
        $this->assertStringContainsString('[b]bold[/b] attempt', $html);
    }

    // -----------------------------------------------------------------------
    // The templates themselves must use the permissive token
    // -----------------------------------------------------------------------

    /** @return array<string, array{0: class-string, 1: string}> */
    public static function bodyTokenTemplates(): array
    {
        return [
            'file'         => [FileTemplate::class, '[upl-file'],
            'image'        => [ImageTemplate::class, '[upl-image'],
            'text-preview' => [TextPreviewTemplate::class, '[upl-text-preview'],
        ];
    }

    #[Test]
    #[DataProvider('bodyTokenTemplates')]
    public function template_body_uses_text_token_not_simpletext(string $class, string $opening): void
    {
        $t = new $class($this->makeViewFactory(), $this->makeTranslator());
        $bbcode = $t->bbcode();

        $this->assertStringContainsString($opening, $bbcode);
        $this->assertStringContainsString('{TEXT1}', $bbcode, "$class must use TEXT1 for the label body");
        $this->assertStringNotContainsString('{SIMPLETEXT1}', $bbcode, "$class must no longer use SIMPLETEXT1");
    }

    // -----------------------------------------------------------------------
    // preview(): the display name has to reach the inserted BBCode
    // -----------------------------------------------------------------------

    #[Test]
    public function file_preview_defaults_to_base_name_when_no_display_name_given(): void
    {
        $t = new FileTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->base_name, $t->preview($file));
    }

    #[Test]
    public function file_preview_uses_display_name_when_provided(): void
    {
        $t = new FileTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $preview = $t->preview($file, 'Train ticket: Jan 30 (Brussels)');

        $this->assertStringContainsString('Train ticket: Jan 30 (Brussels)', $preview);
        $this->assertStringNotContainsString($file->base_name, $preview);
    }

    #[Test]
    public function file_preview_with_display_name_round_trips_through_the_parser(): void
    {
        $t = new FileTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $preview = $t->preview($file, "Tom's report & notes (final)");

        ['parser' => $parser, 'renderer' => $renderer] = $this->formatter('TEXT1');
        $xml = $parser->parse($preview);

        $this->assertStringContainsString('<UPL-FILE', $xml, "preview() output must parse: $preview");
        $this->assertStringContainsString("Tom's report &amp; notes (final)", $renderer->render($xml));
    }

    #[Test]
    public function blank_display_name_falls_back_to_base_name(): void
    {
        $t = new FileTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->base_name, $t->preview($file, '   '));
        $this->assertStringContainsString($file->base_name, $t->preview($file, ''));
    }

    /**
     * A newline in the label would terminate the BBCode body and break the tag,
     * so preview() must normalise whitespace rather than emit it verbatim.
     */
    #[Test]
    public function display_name_with_newlines_still_produces_parseable_bbcode(): void
    {
        $t = new FileTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $preview = $t->preview($file, "Line one\nLine two");

        ['parser' => $parser] = $this->formatter('TEXT1');

        $this->assertStringContainsString('<UPL-FILE', $parser->parse($preview));
    }

    /**
     * The label must not be able to close its own tag and inject sibling markup.
     */
    #[Test]
    public function display_name_cannot_break_out_of_the_bbcode_tag(): void
    {
        $t = new FileTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $preview = $t->preview($file, 'evil[/upl-file][b]escaped[/b]');

        ['parser' => $parser, 'renderer' => $renderer] = $this->formatter('TEXT1');
        $html = $renderer->render($parser->parse($preview));

        $this->assertStringNotContainsString('<b>', $html, 'Label must not be able to close the tag and inject markup');
    }
}
