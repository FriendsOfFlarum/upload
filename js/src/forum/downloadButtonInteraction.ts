import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Alert from 'flarum/common/components/Alert';
import Post from 'flarum/forum/components/Post';

/**
 * How long a denial alert stays on screen before dismissing itself.
 *
 * Core's AlertManager only dismisses on click, so the timeout is applied here
 * against the identifier returned by show().
 */
const ALERT_TIMEOUT = 4500;

function showDenialAlert(message: string): void {
  const id = app.alerts.show(Alert, { type: 'error' }, message);

  setTimeout(() => app.alerts.dismiss(id), ALERT_TIMEOUT);
}

/**
 * FontAwesome style classes, in both FA7 long form and the legacy short form.
 * Icon names and utility classes (fa-fw, fa-spin) also begin with `fa-`, so the
 * list is explicit rather than pattern-based.
 */
const FA_STYLE_CLASSES = new Set([
  'fa',
  'fas',
  'far',
  'fal',
  'fat',
  'fad',
  'fab',
  'fa-solid',
  'fa-regular',
  'fa-light',
  'fa-thin',
  'fa-duotone',
  'fa-brands',
  'fa-sharp',
  'fa-sharp-duotone',
]);

/**
 * FontAwesome utility classes that are not icon names: sizing, fixed width,
 * rotation, animation and list markers. These must survive an icon swap.
 */
const FA_UTILITY_CLASSES =
  /^fa-(fw|ul|li|border|pull-(left|right)|spin|pulse|rotate-\d+|flip-(horizontal|vertical|both)|stack(-[12]x)?|inverse|beat|fade|bounce|shake|spin-pulse|spin-reverse|2xs|xs|sm|lg|xl|2xl|\d+x)$/;

/**
 * Point an existing icon element at the padlock glyph.
 *
 * Only the icon *name* is replaced; every style class already on the element is
 * kept. That matters because a forum may force a FontAwesome style globally —
 * rewriting each icon's style classes — so hardcoding `fa-solid` (or overriding
 * the glyph from CSS, which is keyed to the declared class) would fight that and
 * silently render the wrong icon, or none.
 */
function swapToLockIcon(icon: Element): void {
  const classes = icon.className.split(/\s+/).filter(Boolean);

  // Drop only the old icon name. Style classes, sizing/utility classes and any
  // non-FontAwesome classes all survive.
  const kept = classes.filter((cls) => FA_STYLE_CLASSES.has(cls) || FA_UTILITY_CLASSES.test(cls) || !cls.startsWith('fa-'));

  // Nothing recognisable to preserve: fall back to a plain FA7 solid padlock.
  if (!kept.some((cls) => FA_STYLE_CLASSES.has(cls))) {
    kept.push('fa-solid');
  }

  icon.className = [...kept, 'fa-lock'].join(' ');
}

/**
 * Mark a rendered download as locked.
 *
 * The file name and size are left alone — a locked download still has to say
 * what it is — and the reason is appended as its own element rather than
 * replacing anything.
 *
 * The icon is swapped by rewriting its classes rather than by overriding the
 * glyph in CSS: a forum can force a FontAwesome style globally, which rewrites
 * every icon's classes, so a stylesheet rule keyed to the declared class would
 * silently stop matching. The swap preserves whatever style is already applied.
 *
 * Colours are left alone deliberately. Greying the control out reads as broken
 * rather than locked; the padlock and the stated reason carry the meaning.
 */
function markDenied(el: HTMLElement): void {
  if (el.classList.contains('fof-upload-download-denied')) return;

  el.classList.add('fof-upload-download-denied');
  el.setAttribute('aria-disabled', 'true');

  el.querySelectorAll('i').forEach((icon) => {
    swapToLockIcon(icon);
  });

  const reasonText = app.translator.trans('fof-upload.forum.states.permission_required', {}, true);

  // Guard against a re-render appending a second copy.
  if (!el.querySelector('.fof-upload-download-reason')) {
    const reason = document.createElement('div');
    reason.className = 'Button fof-upload-download-reason';
    reason.textContent = reasonText;
    el.appendChild(reason);
  }

  // The visible reason is decorative for assistive tech, which gets the same
  // information from aria-disabled plus this label.
  el.setAttribute('aria-label', `${el.textContent?.trim() ?? ''} — ${reasonText}`);
}

export default function downloadButtonInteraction(): void {
  extend(Post.prototype, 'oncreate', function (this: InstanceType<typeof Post>) {
    const $targets = this.$('[data-fof-upload-download-uuid]');

    // Mark gated downloads so they read as deliberately locked rather than
    // broken. The element still renders — the requirement is that users without
    // permission can see a download exists.
    const canDownload = app.forum.attribute<boolean>('fof-upload.canDownload');
    const discussion = this.attrs.post.discussion();
    const canDownloadInTag = discussion?.attribute('canDownloadFiles') as boolean | undefined;

    const denied = !canDownload || canDownloadInTag === false;

    if (denied) {
      $targets.each((_: number, el: HTMLElement) => markDenied(el));
    }

    $targets.unbind('click').on('click', (e: JQuery.TriggeredEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Covers both the global permission and per-tag scoping (flarum/tags).
      // canDownloadInTag is only present when tags is enabled, so an undefined
      // value must not block the click.
      if (denied) {
        showDenialAlert(app.translator.trans('fof-upload.forum.states.unauthorized', {}, true));
        return;
      }

      const target = e.currentTarget as HTMLElement;
      let url = app.forum.attribute('apiUrl') + '/fof/download';
      url += '/' + encodeURIComponent(target.dataset.fofUploadDownloadUuid || '');
      url += '/' + encodeURIComponent(this.attrs.post.id() ?? '');
      url += '/' + encodeURIComponent(app.session.csrfToken);

      window.open(url);
    });
  });
}
