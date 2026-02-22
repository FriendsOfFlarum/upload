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

use FoF\Upload\Contracts\TextFormatterTemplate;
use FoF\Upload\File;
use FoF\Upload\Templates\BbcodeImageTemplate;
use FoF\Upload\Templates\FileTemplate;
use FoF\Upload\Templates\ImagePreviewTemplate;
use FoF\Upload\Templates\ImageTemplate;
use FoF\Upload\Templates\JustUrlTemplate;
use FoF\Upload\Templates\MarkdownImageTemplate;
use FoF\Upload\Templates\TextPreviewTemplate;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Illuminate\Contracts\View\View;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\Translation\TranslatorInterface;

#[CoversClass(FileTemplate::class)]
#[CoversClass(ImageTemplate::class)]
#[CoversClass(ImagePreviewTemplate::class)]
#[CoversClass(TextPreviewTemplate::class)]
#[CoversClass(JustUrlTemplate::class)]
#[CoversClass(MarkdownImageTemplate::class)]
#[CoversClass(BbcodeImageTemplate::class)]
class TemplatesTest extends TestCase
{
    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------

    private function makeView(): View
    {
        return $this->createStub(View::class);
    }

    private function makeTranslator(): TranslatorInterface
    {
        $translator = $this->createStub(TranslatorInterface::class);
        $translator->method('trans')->willReturnArgument(0);

        return $translator;
    }

    private function makeViewFactory(?View $view = null): ViewFactory
    {
        $factory = $this->createStub(ViewFactory::class);
        $factory->method('make')->willReturn($view ?? $this->makeView());

        return $factory;
    }

    /** Build a File model stub populated with predictable test data. */
    private function makeFile(): File
    {
        $file = new File();
        $file->uuid = 'test-uuid-1234';
        $file->base_name = 'photo.jpg';
        $file->url = 'https://example.com/files/photo.jpg';
        $file->path = 'uploads/photo.jpg';
        $file->size = 2048;
        $file->type = 'image/jpeg';

        return $file;
    }

    // ---------------------------------------------------------------------------
    // JustUrlTemplate
    // ---------------------------------------------------------------------------

    #[Test]
    public function just_url_template_has_correct_tag(): void
    {
        $t = new JustUrlTemplate($this->makeViewFactory(), $this->makeTranslator());

        $this->assertSame('just-url', $t->tag());
    }

    #[Test]
    public function just_url_template_preview_returns_file_url(): void
    {
        $t = new JustUrlTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertSame($file->url, $t->preview($file));
    }

    #[Test]
    public function just_url_template_is_not_a_text_formatter_template(): void
    {
        $t = new JustUrlTemplate($this->makeViewFactory(), $this->makeTranslator());

        $this->assertNotInstanceOf(TextFormatterTemplate::class, $t);
    }

    // ---------------------------------------------------------------------------
    // MarkdownImageTemplate
    // ---------------------------------------------------------------------------

    #[Test]
    public function markdown_image_template_has_correct_tag(): void
    {
        $t = new MarkdownImageTemplate($this->makeViewFactory(), $this->makeTranslator());

        $this->assertSame('markdown-image', $t->tag());
    }

    #[Test]
    public function markdown_image_template_preview_produces_markdown_syntax(): void
    {
        $t = new MarkdownImageTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $preview = $t->preview($file);

        $this->assertSame('![Image description](https://example.com/files/photo.jpg)', $preview);
    }

    #[Test]
    public function markdown_image_template_preview_embeds_url(): void
    {
        $t = new MarkdownImageTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->url, $t->preview($file));
    }

    // ---------------------------------------------------------------------------
    // BbcodeImageTemplate
    // ---------------------------------------------------------------------------

    #[Test]
    public function bbcode_image_template_has_correct_tag(): void
    {
        $t = new BbcodeImageTemplate($this->makeViewFactory(), $this->makeTranslator());

        $this->assertSame('bbcode-image', $t->tag());
    }

    #[Test]
    public function bbcode_image_template_preview_produces_bbcode_syntax(): void
    {
        $t = new BbcodeImageTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $url = $file->url;
        $preview = $t->preview($file);

        $this->assertSame("[URL=$url][IMG]{$url}[/IMG][/URL]", $preview);
    }

    #[Test]
    public function bbcode_image_template_preview_contains_url_twice(): void
    {
        $t = new BbcodeImageTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        // URL appears in both the [URL=…] wrapper and the [IMG]…[/IMG] inner tag
        $this->assertSame(2, substr_count($t->preview($file), $file->url));
    }

    // ---------------------------------------------------------------------------
    // FileTemplate
    // ---------------------------------------------------------------------------

    #[Test]
    public function file_template_has_correct_tag(): void
    {
        $t = new FileTemplate($this->makeViewFactory(), $this->makeTranslator());

        $this->assertSame('file', $t->tag());
    }

    #[Test]
    public function file_template_is_a_text_formatter_template(): void
    {
        $t = new FileTemplate($this->makeViewFactory(), $this->makeTranslator());

        $this->assertInstanceOf(TextFormatterTemplate::class, $t);
    }

    #[Test]
    public function file_template_bbcode_contains_uuid_and_size_placeholders(): void
    {
        $t = new FileTemplate($this->makeViewFactory(), $this->makeTranslator());
        $bbcode = $t->bbcode();

        $this->assertStringContainsString('uuid={IDENTIFIER}', $bbcode);
        $this->assertStringContainsString('size={SIMPLETEXT2}', $bbcode);
        $this->assertStringContainsString('[upl-file', $bbcode);
        $this->assertStringContainsString('[/upl-file]', $bbcode);
    }

    #[Test]
    public function file_template_bbcode_does_not_contain_url_placeholder(): void
    {
        // FileTemplate stores only by UUID (no URL in post content)
        $t = new FileTemplate($this->makeViewFactory(), $this->makeTranslator());

        $this->assertStringNotContainsString('url=', $t->bbcode());
    }

    #[Test]
    public function file_template_preview_substitutes_uuid(): void
    {
        $t = new FileTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->uuid, $t->preview($file));
    }

    #[Test]
    public function file_template_preview_substitutes_human_size(): void
    {
        $t = new FileTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->humanSize, $t->preview($file));
    }

    #[Test]
    public function file_template_preview_substitutes_base_name(): void
    {
        $t = new FileTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->base_name, $t->preview($file));
    }

    #[Test]
    public function file_template_preview_contains_no_remaining_placeholders(): void
    {
        $t = new FileTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $preview = $t->preview($file);

        $this->assertStringNotContainsString('{IDENTIFIER}', $preview);
        $this->assertStringNotContainsString('{SIMPLETEXT1}', $preview);
        $this->assertStringNotContainsString('{SIMPLETEXT2}', $preview);
    }

    #[Test]
    public function file_template_returns_a_view(): void
    {
        $view = $this->makeView();
        $t = new FileTemplate($this->makeViewFactory($view), $this->makeTranslator());

        $this->assertSame($view, $t->template());
    }

    // ---------------------------------------------------------------------------
    // ImageTemplate
    // ---------------------------------------------------------------------------

    #[Test]
    public function image_template_has_correct_tag(): void
    {
        $t = new ImageTemplate($this->makeViewFactory(), $this->makeTranslator());

        $this->assertSame('image', $t->tag());
    }

    #[Test]
    public function image_template_is_a_text_formatter_template(): void
    {
        $t = new ImageTemplate($this->makeViewFactory(), $this->makeTranslator());

        $this->assertInstanceOf(TextFormatterTemplate::class, $t);
    }

    #[Test]
    public function image_template_bbcode_contains_uuid_size_and_url_placeholders(): void
    {
        $t = new ImageTemplate($this->makeViewFactory(), $this->makeTranslator());
        $bbcode = $t->bbcode();

        $this->assertStringContainsString('uuid={IDENTIFIER}', $bbcode);
        $this->assertStringContainsString('size={SIMPLETEXT2}', $bbcode);
        $this->assertStringContainsString('url={URL}', $bbcode);
        $this->assertStringContainsString('[upl-image', $bbcode);
        $this->assertStringContainsString('[/upl-image]', $bbcode);
    }

    #[Test]
    public function image_template_preview_substitutes_uuid(): void
    {
        $t = new ImageTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->uuid, $t->preview($file));
    }

    #[Test]
    public function image_template_preview_substitutes_url(): void
    {
        $t = new ImageTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->url, $t->preview($file));
    }

    #[Test]
    public function image_template_preview_substitutes_human_size(): void
    {
        $t = new ImageTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->humanSize, $t->preview($file));
    }

    #[Test]
    public function image_template_preview_substitutes_base_name(): void
    {
        $t = new ImageTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->base_name, $t->preview($file));
    }

    #[Test]
    public function image_template_preview_contains_no_remaining_placeholders(): void
    {
        $t = new ImageTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $preview = $t->preview($file);

        $this->assertStringNotContainsString('{IDENTIFIER}', $preview);
        $this->assertStringNotContainsString('{SIMPLETEXT1}', $preview);
        $this->assertStringNotContainsString('{SIMPLETEXT2}', $preview);
        $this->assertStringNotContainsString('{URL}', $preview);
    }

    #[Test]
    public function image_template_returns_a_view(): void
    {
        $view = $this->makeView();
        $t = new ImageTemplate($this->makeViewFactory($view), $this->makeTranslator());

        $this->assertSame($view, $t->template());
    }

    // ---------------------------------------------------------------------------
    // ImagePreviewTemplate
    // ---------------------------------------------------------------------------

    #[Test]
    public function image_preview_template_has_correct_tag(): void
    {
        $t = new ImagePreviewTemplate($this->makeViewFactory(), $this->makeTranslator());

        $this->assertSame('image-preview', $t->tag());
    }

    #[Test]
    public function image_preview_template_is_a_text_formatter_template(): void
    {
        $t = new ImagePreviewTemplate($this->makeViewFactory(), $this->makeTranslator());

        $this->assertInstanceOf(TextFormatterTemplate::class, $t);
    }

    #[Test]
    public function image_preview_template_bbcode_contains_uuid_and_url_placeholders(): void
    {
        $t = new ImagePreviewTemplate($this->makeViewFactory(), $this->makeTranslator());
        $bbcode = $t->bbcode();

        $this->assertStringContainsString('uuid={IDENTIFIER}', $bbcode);
        $this->assertStringContainsString('url={URL?}', $bbcode);
        $this->assertStringContainsString('[upl-image-preview', $bbcode);
    }

    #[Test]
    public function image_preview_template_preview_substitutes_uuid(): void
    {
        $t = new ImagePreviewTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->uuid, $t->preview($file));
    }

    #[Test]
    public function image_preview_template_preview_substitutes_url(): void
    {
        $t = new ImagePreviewTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->url, $t->preview($file));
    }

    #[Test]
    public function image_preview_template_preview_substitutes_all_placeholders(): void
    {
        $t = new ImagePreviewTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $preview = $t->preview($file);

        $this->assertStringNotContainsString('{IDENTIFIER}', $preview);
        $this->assertStringNotContainsString('{URL?}', $preview);
        $this->assertStringNotContainsString('{TEXT?}', $preview);
    }

    #[Test]
    public function image_preview_template_preview_sets_alt_to_base_name(): void
    {
        // Default alt text is the filename. Users who manually edit the BBCode
        // in their post can override alt= and the formatter will preserve it,
        // since alt={TEXT?} in bbcode() marks it as an accepted optional attribute.
        $t = new ImagePreviewTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString("alt={$file->base_name}", $t->preview($file));
    }

    #[Test]
    public function image_preview_template_returns_a_view(): void
    {
        $view = $this->makeView();
        $t = new ImagePreviewTemplate($this->makeViewFactory($view), $this->makeTranslator());

        $this->assertSame($view, $t->template());
    }

    // ---------------------------------------------------------------------------
    // TextPreviewTemplate
    // ---------------------------------------------------------------------------

    #[Test]
    public function text_preview_template_has_correct_tag(): void
    {
        $t = new TextPreviewTemplate($this->makeViewFactory(), $this->makeTranslator());

        $this->assertSame('text-preview', $t->tag());
    }

    #[Test]
    public function text_preview_template_is_a_text_formatter_template(): void
    {
        $t = new TextPreviewTemplate($this->makeViewFactory(), $this->makeTranslator());

        $this->assertInstanceOf(TextFormatterTemplate::class, $t);
    }

    #[Test]
    public function text_preview_template_bbcode_contains_uuid_url_and_snippet_placeholders(): void
    {
        $t = new TextPreviewTemplate($this->makeViewFactory(), $this->makeTranslator());
        $bbcode = $t->bbcode();

        $this->assertStringContainsString('uuid={IDENTIFIER}', $bbcode);
        $this->assertStringContainsString('url={URL}', $bbcode);
        $this->assertStringContainsString('has_snippet=', $bbcode);
        $this->assertStringContainsString('snippet=', $bbcode);
        $this->assertStringContainsString('[upl-text-preview', $bbcode);
        $this->assertStringContainsString('[/upl-text-preview]', $bbcode);
    }

    #[Test]
    public function text_preview_template_preview_uses_uuid(): void
    {
        $t = new TextPreviewTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->uuid, $t->preview($file));
    }

    #[Test]
    public function text_preview_template_preview_uses_url(): void
    {
        $t = new TextPreviewTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->url, $t->preview($file));
    }

    #[Test]
    public function text_preview_template_preview_uses_base_name_as_inner_text(): void
    {
        $t = new TextPreviewTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString($file->base_name, $t->preview($file));
    }

    #[Test]
    public function text_preview_template_preview_sets_has_snippet_false(): void
    {
        $t = new TextPreviewTemplate($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $this->assertStringContainsString('has_snippet=false', $t->preview($file));
    }

    #[Test]
    public function text_preview_template_returns_a_view(): void
    {
        $view = $this->makeView();
        $t = new TextPreviewTemplate($this->makeViewFactory($view), $this->makeTranslator());

        $this->assertSame($view, $t->template());
    }

    // ---------------------------------------------------------------------------
    // Cross-template: tag uniqueness
    // ---------------------------------------------------------------------------

    /** @return array<string, array{0: string}> */
    public static function allTemplateTags(): array
    {
        return [
            'just-url'       => ['just-url'],
            'markdown-image' => ['markdown-image'],
            'bbcode-image'   => ['bbcode-image'],
            'file'           => ['file'],
            'image'          => ['image'],
            'image-preview'  => ['image-preview'],
            'text-preview'   => ['text-preview'],
        ];
    }

    #[Test]
    public function all_template_tags_are_unique(): void
    {
        $tags = array_map(fn (array $row) => $row[0], self::allTemplateTags());

        $this->assertSame(count($tags), count(array_unique($tags)), 'Duplicate template tag detected');
    }

    // ---------------------------------------------------------------------------
    // Cross-template: preview never contains unsubstituted braces
    // ---------------------------------------------------------------------------

    /** @return array<string, array{0: object}> */
    public static function allTextFormatterTemplates(): array
    {
        // Instantiated with stub dependencies in the data provider via closures;
        // the actual instances are built inside the test method.
        return [
            'file'          => [FileTemplate::class],
            'image'         => [ImageTemplate::class],
            'image-preview' => [ImagePreviewTemplate::class],
            'text-preview'  => [TextPreviewTemplate::class],
        ];
    }

    #[Test]
    #[DataProvider('allTextFormatterTemplates')]
    public function text_formatter_template_preview_substitutes_all_required_placeholders(string $class): void
    {
        $t = new $class($this->makeViewFactory(), $this->makeTranslator());
        $file = $this->makeFile();

        $preview = $t->preview($file);

        // All data placeholders must be substituted in preview() output.
        // Optional TextFormatter structural markers like {SIMPLETEXT?} (used for
        // has_snippet/snippet in text-preview) are left as-is by design.
        $requiredPlaceholders = [
            '{IDENTIFIER}',
            '{SIMPLETEXT1}',
            '{SIMPLETEXT2}',
            '{URL}',
        ];

        foreach ($requiredPlaceholders as $placeholder) {
            if (str_contains($t->bbcode(), $placeholder)) {
                $this->assertStringNotContainsString(
                    $placeholder,
                    $preview,
                    "Template $class left required placeholder $placeholder unsubstituted in: $preview"
                );
            }
        }
    }
}
