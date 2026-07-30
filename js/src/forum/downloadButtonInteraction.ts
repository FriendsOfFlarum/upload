import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Post from 'flarum/forum/components/Post';

export default function downloadButtonInteraction(): void {
  extend(Post.prototype, 'oncreate', function (this: InstanceType<typeof Post>) {
    const $targets = this.$('[data-fof-upload-download-uuid]');

    // Mark gated downloads so they read as deliberately unavailable rather than
    // broken. The element still renders — the client requirement is that users
    // without permission can see a download exists.
    const discussionForState = this.attrs.post.discussion();
    if ((discussionForState?.attribute('canDownloadFiles') as boolean | undefined) === false) {
      $targets.addClass('fof-upload-download-denied').attr('aria-disabled', 'true');
    }

    $targets.unbind('click').on('click', (e: JQuery.TriggeredEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!app.forum.attribute('fof-upload.canDownload')) {
        alert(app.translator.trans('fof-upload.forum.states.unauthorized'));
        return;
      }

      // Per-tag download scoping (flarum/tags). The attribute is only present
      // when tags is enabled, so an undefined value must not block the click.
      const discussion = this.attrs.post.discussion();
      const canDownloadFiles = discussion?.attribute('canDownloadFiles') as boolean | undefined;

      if (canDownloadFiles === false) {
        alert(app.translator.trans('fof-upload.forum.states.unauthorized_in_tag'));
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
