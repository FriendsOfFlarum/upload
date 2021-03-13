import UserPage from 'flarum/components/UserPage';
import UserFileList from './UserFileList';

export default class UploadsUserPage extends UserPage {
    oninit(vnode) {
        super.oninit(vnode);

        this.user = null;

        this.loadUser(m.route.param('username'));
    }

    content() {
        if (this.user !== app.session.user && !app.forum.attribute('fof-upload.canViewUserUploads')) return null;

        return (
            this.user &&
            UserFileList.component({
                user: this.user,
                selectable: false,
                downloadOnClick: true,
            })
        );
    }

    show(user) {
        super.show(user);
        this.user = user;
    }
}
