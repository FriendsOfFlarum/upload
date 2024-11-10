import UserPage from 'flarum/forum/components/UserPage';
import type Mithril from 'mithril';
import User from 'flarum/common/models/User';
import FileListState from '../../common/states/FileListState';
import type File from '../../common/models/File';
export default class UploadsUserPage extends UserPage {
    fileState: FileListState;
    oninit(vnode: Mithril.Vnode<this>): void;
    content(): any;
    onDelete(file: File): void;
    show(user: User): void;
}
