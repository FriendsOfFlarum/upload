import UserPage from 'flarum/forum/components/UserPage';
import type Mithril from 'mithril';
import User from 'flarum/common/models/User';
export default class UploadsUserPage extends UserPage {
    oninit(vnode: Mithril.Vnode): void;
    content(): any;
    show(user: User): void;
}
