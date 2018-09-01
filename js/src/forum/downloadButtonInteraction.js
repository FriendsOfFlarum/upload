import {extend} from "flarum/extend";
import Post from 'flarum/components/Post';

export default function () {
    extend(Post.prototype, 'config', function (isInitialized) {
        if (isInitialized) return;

        this.$('.flagrow-download-button[data-uuid]').unbind('click').on('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            let url = app.forum.attribute('apiUrl') + '/flagrow/download';

            url += '/' + $(e.currentTarget).attr('data-uuid');
            url += '/' + this.props.post.id();
            url += '/' + app.session.csrfToken;

            window.open(url);
        })
    })
}
