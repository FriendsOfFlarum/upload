import AdminPage, { AdminHeaderAttrs } from 'flarum/admin/components/AdminPage';
import { IPageAttrs } from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import File from 'src/common/models/File';
import FileListState from '../../common/states/FileListState';
export default class SharedUploadPage<CustomAttrs extends IPageAttrs = IPageAttrs> extends AdminPage<CustomAttrs> {
    sharedUploads: File[];
    currentPage: number;
    fileState: FileListState;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    headerInfo(): AdminHeaderAttrs;
    content(): Mithril.Children;
    showUploadModal(): void;
    mainActionItems(): ItemList<Mithril.Children>;
    fileActionItems(file: File): ItemList<Mithril.Children>;
    uploadComplete(files: File | File[]): void;
    refresh(): void;
    onDelete(file: File): void;
}
