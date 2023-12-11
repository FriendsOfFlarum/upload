import app from 'flarum/forum/app';
import UserPage from 'flarum/forum/components/UserPage';
import UserFileList from '../../common/components/UserFileList';
import type Mithril from 'mithril';
import User from 'flarum/common/models/User';

export default class UploadsUserPage extends UserPage {
  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    this.user = null;

    this.loadUser(m.route.param('username'));
  }

  content() {
    if (app.session.user && (app.session.user.viewOthersMediaLibrary() || this.user === app.session.user)) {
      return (
        this.user &&
        UserFileList.component({
          user: this.user,
          selectable: false,
          downloadOnClick: true,
        })
      );
    } else {
      return null;
    }
  }

  show(user: User) {
    super.show(user);
    this.user = user;
  }
}
