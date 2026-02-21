import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Post from 'flarum/forum/components/Post';

export default function downloadButtonInteraction(): void {
  extend(Post.prototype, 'oncreate', function (this: InstanceType<typeof Post>) {
    this.$('[data-fof-upload-download-uuid]')
      .unbind('click')
      .on('click', (e: JQuery.TriggeredEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!app.forum.attribute('fof-upload.canDownload')) {
          alert(app.translator.trans('fof-upload.forum.states.unauthorized'));
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
