import app from 'flarum/app';
import {extend} from 'flarum/extend';
import Post from 'flarum/components/Post';

/* global $ */

export default function () {
    extend(Post.prototype, 'config', function (isInitialized) {
        if (isInitialized) return;

        this.$('[data-fof-upload-download-uuid]').unbind('click').on('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!app.forum.attribute('fof-upload.canDownload')) {
                alert(app.translator.trans('fof-upload.forum.states.unauthorized'));
                return;
            }

            let url = app.forum.attribute('apiUrl') + '/fof/download';

            url += '/' + e.currentTarget.dataset.fofUploadDownloadUuid;
            url += '/' + this.props.post.id();
            url += '/' + app.session.csrfToken;

            window.open(url);
        });
    });
}
