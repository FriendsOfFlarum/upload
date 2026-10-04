import { buildPattern, isValidSubtype, MIME_PRESETS, parsePattern, suggestedSubtypes } from '../../../src/admin/utils/mimePatterns';

/**
 * The friendly file-type editor decomposes a stored regex into a type plus
 * subtype chips, and rebuilds a regex when the admin edits them. Since the saved
 * format is unchanged, a decompose/recompose bug would silently rewrite a working
 * mime mapping — so the round trip is pinned here, along with the cases that must
 * be refused and left as raw patterns.
 */
describe('mimePatterns', () => {
  describe('parsePattern → buildPattern round trip', () => {
    // Patterns taken from a real forum's saved configuration plus the
    // extension's own shipped default.
    const friendly = [
      '^image\\/(jpeg|png|gif|webp|avif|bmp|tiff|svg\\+xml)$',
      '^application\\/(pdf|msword|zip|x-zip-compressed)$',
      '^application\\/pdf$',
      '^video\\/(mp4|webm)$',
      '^application\\/(vnd\\.ms-excel|vnd\\.openxmlformats-officedocument\\.spreadsheetml\\.sheet)$',
    ];

    it.each(friendly)('rebuilds %s byte-identically', (pattern) => {
      const parsed = parsePattern(pattern);

      expect(parsed.friendly).toBe(true);
      expect(buildPattern(parsed.type, parsed.subtypes)).toBe(pattern);
    });

    it('unescapes subtypes for display', () => {
      const parsed = parsePattern('^image\\/(jpeg|svg\\+xml)$');

      expect(parsed.type).toBe('image');
      // The chip shows "svg+xml", not "svg\+xml".
      expect(parsed.subtypes).toEqual(['jpeg', 'svg+xml']);
    });

    it('re-escapes + and . when rebuilding', () => {
      expect(buildPattern('image', ['svg+xml'])).toBe('^image\\/svg\\+xml$');
      expect(buildPattern('application', ['vnd.ms-excel'])).toBe('^application\\/vnd\\.ms-excel$');
    });

    it('uses a group only for multiple subtypes', () => {
      expect(buildPattern('image', ['png'])).toBe('^image\\/png$');
      expect(buildPattern('image', ['png', 'gif'])).toBe('^image\\/(png|gif)$');
    });
  });

  /**
   * Anything that cannot be rebuilt exactly must be reported as not friendly, so
   * the UI shows the raw pattern rather than replacing it with an approximation.
   */
  describe('patterns that must stay raw', () => {
    const advanced = [
      // No anchors — matches anywhere in the mime string.
      'text\\/plain',
      // A wildcard the chip model cannot express.
      '^image\\/.*$',
      // Optional character.
      '^image\\/(jpe?g)$',
      // Alternation in the top-level type.
      '^(image|video)\\/(mp4)$',
      // Malformed: empty alternative.
      '^image\\/(jpeg||png)$',
      // Character class.
      '^image\\/[a-z]+$',
      // Nested group.
      '^image\\/((jpe|pn)g)$',
    ];

    it.each(advanced)('treats %s as advanced', (pattern) => {
      expect(parsePattern(pattern).friendly).toBe(false);
    });

    it('reports no type or subtypes for advanced patterns', () => {
      const parsed = parsePattern('^image\\/.*$');

      expect(parsed.type).toBe('');
      expect(parsed.subtypes).toEqual([]);
    });
  });

  describe('buildPattern guards', () => {
    it('returns an empty string when there is nothing to build', () => {
      expect(buildPattern('', ['png'])).toBe('');
      expect(buildPattern('image', [])).toBe('');
      expect(buildPattern('image', ['   '])).toBe('');
    });

    it('ignores blank subtypes rather than emitting an empty alternative', () => {
      // An empty branch would make the pattern match everything.
      expect(buildPattern('image', ['png', '  ', 'gif'])).toBe('^image\\/(png|gif)$');
    });

    it('trims surrounding whitespace', () => {
      expect(buildPattern('image', [' png '])).toBe('^image\\/png$');
    });
  });

  describe('isValidSubtype', () => {
    it.each(['png', 'svg+xml', 'vnd.ms-excel', 'x-zip-compressed', 'epub+zip'])('accepts %s', (subtype) => {
      expect(isValidSubtype(subtype)).toBe(true);
    });

    it.each(['', '   ', 'jpe?g', 'a|b', '(png)', '[a-z]', 'a*', 'a$'])('rejects %s', (subtype) => {
      expect(isValidSubtype(subtype)).toBe(false);
    });
  });

  describe('presets', () => {
    it('every preset produces a pattern that parses back to itself', () => {
      MIME_PRESETS.forEach((preset) => {
        const pattern = buildPattern(preset.type, preset.subtypes);
        const parsed = parsePattern(pattern);

        expect(parsed.friendly).toBe(true);
        expect(parsed.type).toBe(preset.type);
        expect(parsed.subtypes).toEqual(preset.subtypes);
      });
    });

    it('has unique keys', () => {
      const keys = MIME_PRESETS.map((p) => p.key);

      expect(new Set(keys).size).toBe(keys.length);
    });

    // Patterns are matched against the name php-mime-detector returns, which is not
    // always the common one: a .wav is audio/vnd.wave, an animated PNG image/apng.
    const accepts = (key: string, mime: string) => {
      const preset = MIME_PRESETS.find((p) => p.key === key)!;

      return new RegExp(buildPattern(preset.type, preset.subtypes)).test(mime);
    };

    it.each(['image/jpeg', 'image/png', 'image/apng', 'image/gif', 'image/webp'])('images accepts %s', (mime) => {
      expect(accepts('images', mime)).toBe(true);
    });

    it.each(['audio/mpeg', 'audio/ogg', 'audio/opus', 'audio/vnd.wave', 'audio/x-m4a'])('audio accepts %s', (mime) => {
      expect(accepts('audio', mime)).toBe(true);
    });

    it('names a template for every preset', () => {
      MIME_PRESETS.forEach((preset) => {
        expect(preset.template).toBeTruthy();
      });
    });
  });

  describe('suggestedSubtypes', () => {
    it.each([
      ['image', 'apng'],
      ['audio', 'vnd.wave'],
      ['audio', 'x-flac'],
      ['audio', 'x-m4a'],
      ['video', 'vnd.avi'],
    ])('suggests %s/%s, the name php-mime-detector returns', (type, subtype) => {
      expect(suggestedSubtypes(type, [])).toContain(subtype);
    });

    it.each([
      ['audio', 'wav'],
      ['audio', 'flac'],
      ['video', 'x-msvideo'],
    ])('does not suggest %s/%s, which php-mime-detector never returns', (type, subtype) => {
      expect(suggestedSubtypes(type, [])).not.toContain(subtype);
    });

    it('excludes subtypes already on the row', () => {
      const suggestions = suggestedSubtypes('image', ['jpeg', 'png']);

      expect(suggestions).not.toContain('jpeg');
      expect(suggestions).not.toContain('png');
      expect(suggestions).toContain('gif');
    });

    it('returns an empty list for an unknown type', () => {
      expect(suggestedSubtypes('chemical', [])).toEqual([]);
    });
  });
});
