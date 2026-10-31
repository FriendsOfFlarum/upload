import { jest } from '@jest/globals';
import app from 'flarum/forum/app';
import { bootstrapForum } from '../bootstrap';
import { applyAccess, onClick } from '../../src/forum/addContentControls';

beforeAll(() => bootstrapForum());

afterEach(() => {
  jest.restoreAllMocks();
  app.forum.pushAttributes({ 'fof-upload.canDownload': true });
});

const FILE = `
  <div class="ButtonGroup" data-fof-upload-download-uuid="file-1">
    <button type="button" class="Button fof-upload-download-button">
      <span class="Button-label"><span class="fof-upload-download-label">a.pdf</span><span class="Button-helperText fof-upload-download-reason"></span></span>
    </button>
  </div>
  <div class="fof-download row" data-fof-upload-download-uuid="image-1">
    <figure><a class="lightbox" href="https://example.com/full.png"><img src="https://example.com/t.png"></a>
      <figcaption><button type="button" class="Button fof-upload-download-button"><span class="fof-upload-download-reason"></span></button></figcaption>
    </figure>
  </div>
  <figure class="FofUpload-TextPreview" data-loading="false" data-expanded="false">
    <div class="FofUpload-TextPreviewFull"></div>
    <p class="FofUpload-TextPreviewError" role="status"></p>
    <button type="button" class="FofUpload-TextPreviewToggle" aria-expanded="false" data-url="https://example.com/notes.txt"></button>
    <button type="button" class="FofUpload-TextPreviewDownload" data-fof-upload-download-uuid="text-1"><span class="fof-upload-download-reason"></span></button>
  </figure>`;

function post({ canDownloadFiles }: { canDownloadFiles?: boolean } = {}) {
  const element = document.createElement('article');
  element.innerHTML = FILE;

  const discussion = { attribute: (key: string) => (key === 'canDownloadFiles' ? canDownloadFiles : undefined) };
  const model = { id: () => '42', discussion: () => discussion };

  return { element, attrs: { post: model } } as any;
}

function message() {
  const element = document.createElement('article');
  element.innerHTML = FILE;

  return { element, attrs: { message: {} } } as any;
}

const click = (component: any, selector: string) => {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'target', { value: component.element.querySelector(selector) });
  onClick(component, event);

  return event;
};

describe('downloads in posts', () => {
  it('open the post-scoped route, with the CSRF token for hotlink protection', () => {
    const open = jest.spyOn(window, 'open').mockReturnValue(null);

    click(post(), '[data-fof-upload-download-uuid="file-1"] .fof-upload-download-label');

    expect(open).toHaveBeenCalledWith('https://example.com/api/fof/download/file-1/42/token');
  });

  it('in a private message use the route without a post', () => {
    const open = jest.spyOn(window, 'open').mockReturnValue(null);

    click(message(), '.FofUpload-TextPreviewDownload');

    expect(open).toHaveBeenCalledWith('https://example.com/api/fof/download/text-1');
  });

  it('open once when the post is shown inside another post', () => {
    const open = jest.spyOn(window, 'open').mockReturnValue(null);
    const inner = post();
    const outer = post();
    outer.element.appendChild(inner.element);

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { value: inner.element.querySelector('[data-fof-upload-download-uuid="file-1"] button') });
    onClick(inner, event);
    onClick(outer, event);

    expect(open).toHaveBeenCalledTimes(1);
  });

  it('leave a link inside a download, such as a lightbox, to do its own thing', () => {
    const open = jest.spyOn(window, 'open').mockReturnValue(null);

    const event = click(post(), '.lightbox img');

    expect(open).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it('say why they are locked to a member without permission, and do nothing', () => {
    app.forum.pushAttributes({ 'fof-upload.canDownload': false });
    const open = jest.spyOn(window, 'open').mockReturnValue(null);
    const component = post();

    applyAccess(component);
    click(component, '[data-fof-upload-download-uuid="file-1"] button');

    const button = component.element.querySelector('[data-fof-upload-download-uuid="file-1"] button');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(component.element.querySelector('.fof-upload-download-reason').textContent).toBe('Permission required');
    expect(open).not.toHaveBeenCalled();
  });

  it('are locked in a tag the member may read but not download from', () => {
    const component = post({ canDownloadFiles: false });

    applyAccess(component);

    expect(component.element.querySelector('.FofUpload-TextPreviewDownload').getAttribute('aria-disabled')).toBe('true');
  });

  it('ask a guest to log in rather than locking', () => {
    app.forum.pushAttributes({ 'fof-upload.canDownload': false });
    const session = app.session.user;
    app.session.user = null;
    const show = jest.spyOn(app.modal, 'show').mockResolvedValue(undefined);
    const component = post();

    try {
      applyAccess(component);
      click(component, '[data-fof-upload-download-uuid="file-1"] button');

      expect(component.element.querySelector('[data-fof-upload-download-uuid="file-1"] button').getAttribute('aria-disabled')).toBeNull();
      expect(component.element.querySelector('.fof-upload-download-reason').textContent).toBe('Log in to download');
      expect(show).toHaveBeenCalledTimes(1);
    } finally {
      app.session.user = session;
    }
  });

  it('are unlocked again when access comes back, as after logging in', () => {
    const component = post();
    app.forum.pushAttributes({ 'fof-upload.canDownload': false });
    applyAccess(component);

    app.forum.pushAttributes({ 'fof-upload.canDownload': true });
    applyAccess(component);

    expect(component.element.querySelector('.fof-upload-download-button').getAttribute('aria-disabled')).toBeNull();
    expect(component.element.querySelector('.fof-upload-download-reason').textContent).toBe('');
  });
});

describe('text previews', () => {
  it('expand by fetching the whole file once, then toggle without fetching again', async () => {
    const fetch = jest.fn(async () => ({ ok: true, text: async () => 'the <whole> file' }));
    (global as any).fetch = fetch;
    const component = post();

    click(component, '.FofUpload-TextPreviewToggle');
    await new Promise((resolve) => setTimeout(resolve));

    const figure = component.element.querySelector('.FofUpload-TextPreview');
    const toggle = component.element.querySelector('.FofUpload-TextPreviewToggle');
    expect(figure.dataset.expanded).toBe('true');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-controls')).toBe(component.element.querySelector('.FofUpload-TextPreviewFull').id);
    expect(component.element.querySelector('.FofUpload-TextPreviewFull code').textContent).toBe('the <whole> file');

    click(component, '.FofUpload-TextPreviewToggle');
    expect(figure.dataset.expanded).toBe('false');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('say so when the file cannot be fetched, and can be tried again', async () => {
    (global as any).fetch = jest.fn(async () => ({ ok: false, status: 404 }));
    const component = post();

    click(component, '.FofUpload-TextPreviewToggle');
    await new Promise((resolve) => setTimeout(resolve));

    const figure = component.element.querySelector('.FofUpload-TextPreview');
    expect(figure.dataset.error).toBe('true');
    expect(figure.dataset.loading).toBe('false');
    expect(component.element.querySelector('.FofUpload-TextPreviewError').textContent).toContain('Error previewing file');
  });
});
