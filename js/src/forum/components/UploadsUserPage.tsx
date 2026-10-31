import app from 'flarum/forum/app';
import UserPage, { type IUserPageAttrs } from 'flarum/forum/components/UserPage';
import Placeholder from 'flarum/common/components/Placeholder';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';
import FileLibrary from '../../common/components/FileLibrary';
import FileLibraryState from '../../common/states/FileLibraryState';

interface SessionUser extends User {
  viewOthersMediaLibrary(): boolean;
}

export default class UploadsUserPage<CustomAttrs extends IUserPageAttrs = IUserPageAttrs> extends UserPage<CustomAttrs> {
  library: FileLibraryState | null = null;

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    this.loadUser(m.route.param('username'));
  }

  show(user: User): void {
    super.show(user);

    if (this.library?.user !== user) this.library = new FileLibraryState('user', user);
  }

  content(): Mithril.Children {
    if (!this.user || !this.library) return null;

    if (!this.canView(this.user)) {
      return <Placeholder text={app.translator.trans('fof-upload.forum.user_uploads.no_permission')} />;
    }

    return (
      <div className="UploadsUserPage">
        <FileLibrary state={this.library} mode="browse" />
      </div>
    );
  }

  canView(user: User): boolean {
    const viewer = app.session.user as SessionUser | null;

    return !!viewer && (viewer === user || viewer.viewOthersMediaLibrary());
  }
}
