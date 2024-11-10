import app from 'flarum/forum/app';
import UserPage from 'flarum/forum/components/UserPage';
import UserFileList from '../../common/components/UserFileList';
import type Mithril from 'mithril';
import User from 'flarum/common/models/User';
import FileListState from '../../common/states/FileListState';

import type File from '../../common/models/File';

export default class UploadsUserPage extends UserPage {
  fileState!: FileListState;

  oninit(vnode: Mithril.Vnode<this>) {
    super.oninit(vnode);

    this.user = null;
    this.fileState = new FileListState();

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
          fileState: this.fileState,
          onDelete: this.onDelete.bind(this),
        })
      );
    } else {
      return null;
    }
  }

  onDelete(file: File) {
    this.fileState.removeFromList(file);
  }

  show(user: User) {
    super.show(user);
    this.user = user;
  }
}
