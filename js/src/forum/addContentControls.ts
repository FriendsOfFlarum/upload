import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import AbstractPost from 'flarum/forum/components/AbstractPost';
import extractText from 'flarum/common/utils/extractText';
import type Discussion from 'flarum/common/models/Discussion';
import type Post from 'flarum/common/models/Post';

const TRIGGER = '[data-fof-upload-download-uuid]';

let expandable = 0;
const handled = new WeakSet<Event>();

function postOf(component: AbstractPost): Post | null {
  return ((component.attrs as { post?: Post }).post as Post | undefined) ?? null;
}

// Rendered HTML is the same for everyone, so who may download is applied here.
function access(component: AbstractPost): { denied: boolean; guest: boolean } {
  const discussion = postOf(component)?.discussion() as Discussion | undefined;
  // Only present with flarum/tags, so undefined must not block anything.
  const inTag = discussion?.attribute<boolean | undefined>('canDownloadFiles');

  return {
    denied: !app.forum.attribute('fof-upload.canDownload') || inTag === false,
    guest: !app.session.user,
  };
}

export function applyAccess(component: AbstractPost): void {
  const { denied, guest } = access(component);
  const reason = denied
    ? extractText(app.translator.trans(guest ? 'fof-upload.forum.states.login_to_download' : 'fof-upload.forum.states.permission_required'))
    : '';

  component.element.querySelectorAll<HTMLElement>(TRIGGER).forEach((trigger) => {
    const control = trigger.matches('button') ? trigger : (trigger.querySelector<HTMLElement>('.fof-upload-download-button') ?? trigger);
    const locked = denied && !guest;

    trigger.classList.toggle('fof-upload-download-denied', denied);
    control.classList.toggle('disabled', locked);

    if (locked) {
      control.setAttribute('aria-disabled', 'true');
    } else {
      control.removeAttribute('aria-disabled');
    }

    trigger.querySelectorAll('.fof-upload-download-reason').forEach((slot) => (slot.textContent = reason));
  });
}

function download(component: AbstractPost, uuid: string): void {
  const { denied, guest } = access(component);

  if (denied) {
    if (guest) app.modal.show(() => import('flarum/forum/components/LogInModal'));

    return;
  }

  const post = postOf(component);
  let url = app.forum.attribute('apiUrl') + '/fof/download/' + encodeURIComponent(uuid);

  // A message has no post, so it uses the route without hotlink protection.
  if (post?.id()) {
    url += '/' + encodeURIComponent(post.id()!) + '/' + encodeURIComponent(app.session.csrfToken);
  }

  window.open(url);
}

function setExpanded(figure: HTMLElement, toggle: HTMLElement, expanded: boolean): void {
  figure.dataset.expanded = String(expanded);
  toggle.setAttribute('aria-expanded', String(expanded));
}

async function toggleText(toggle: HTMLButtonElement): Promise<void> {
  const figure = toggle.closest<HTMLElement>('.FofUpload-TextPreview');
  const full = figure?.querySelector<HTMLElement>('.FofUpload-TextPreviewFull');
  const error = figure?.querySelector<HTMLElement>('.FofUpload-TextPreviewError');

  if (!figure || !full || figure.dataset.loading === 'true') return;

  full.id ||= `fof-upload-text-preview-${++expandable}`;
  toggle.setAttribute('aria-controls', full.id);

  if (full.dataset.loaded) {
    setExpanded(figure, toggle, figure.dataset.expanded !== 'true');

    return;
  }

  figure.dataset.loading = 'true';
  toggle.setAttribute('aria-busy', 'true');

  try {
    const response = await fetch(toggle.dataset.url!);

    if (!response.ok) throw new Error(String(response.status));

    const pre = document.createElement('pre');
    const code = document.createElement('code');

    code.textContent = await response.text();
    pre.appendChild(code);
    full.replaceChildren(pre);
    full.dataset.loaded = 'true';

    figure.dataset.error = 'false';
    if (error) error.textContent = '';

    setExpanded(figure, toggle, true);
  } catch {
    figure.dataset.error = 'true';
    if (error) error.textContent = extractText(app.translator.trans('fof-upload.forum.text_preview.error'));
  } finally {
    figure.dataset.loading = 'false';
    toggle.removeAttribute('aria-busy');
  }
}

export function onClick(component: AbstractPost, e: MouseEvent): void {
  const target = e.target as HTMLElement;

  // While editing, the body is the composer preview. A post shown inside another post handles its own clicks first.
  if (component.element.classList.contains('editing') || handled.has(e)) return;

  const toggle = target.closest<HTMLButtonElement>('.FofUpload-TextPreviewToggle');

  if (toggle && component.element.contains(toggle)) {
    handled.add(e);
    toggleText(toggle);

    return;
  }

  const trigger = target.closest<HTMLElement>(TRIGGER);

  if (!trigger || !component.element.contains(trigger)) return;

  // A link inside a download, such as a lightbox's, does its own thing.
  const link = target.closest('a');

  if (link && trigger.contains(link)) return;

  handled.add(e);
  e.preventDefault();
  download(component, trigger.dataset.fofUploadDownloadUuid ?? '');
}

export default function addContentControls(): void {
  extend(AbstractPost.prototype, 'oncreate', function (this: AbstractPost) {
    this.element.addEventListener('click', (e) => onClick(this, e as MouseEvent));
    applyAccess(this);
  });

  // An edit replaces the rendered body, so its downloads are marked again.
  extend(AbstractPost.prototype, 'onupdate', function (this: AbstractPost) {
    applyAccess(this);
  });
}
