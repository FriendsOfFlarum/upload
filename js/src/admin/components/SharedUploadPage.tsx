import app from 'flarum/admin/app';
import AdminPage, { AdminHeaderAttrs } from 'flarum/admin/components/AdminPage';
import Button from 'flarum/common/components/Button';
import { IPageAttrs } from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import UploadSharedFileModal from '../../common/components/UploadSharedFileModal';
import File from 'src/common/models/File';
import SharedFileList from '../../common/components/SharedFileList';
import FileListState from '../../common/states/FileListState';

export default class SharedUploadPage<CustomAttrs extends IPageAttrs = IPageAttrs> extends AdminPage<CustomAttrs> {
  sharedUploads: File[] = [];
  currentPage: number = 1;
  fileState!: FileListState;

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    this.fileState = new FileListState(true);
  }

  headerInfo(): AdminHeaderAttrs {
    return {
      className: 'SharedUploadPage--header',
      icon: 'fas fa-file-upload',
      title: app.translator.trans('fof-upload.admin.shared-uploads.title'),
      description: app.translator.trans('fof-upload.admin.shared-uploads.description'),
    };
  }

  content(): Mithril.Children {
    return (
      <div className="SharedUploadPage--content">
        <p className="helpText">{app.translator.trans('fof-upload.admin.shared-uploads.introduction')}</p>
        <hr />
        <div className="SharedUploadPage--main-actions">{this.mainActionItems().toArray()}</div>
        <hr />
        <div className="SharedUploadPage--uploads">
          <SharedFileList user={app.session.user} selectable={false} fileState={this.fileState} onDelete={this.onDelete.bind(this)} />
        </div>
      </div>
    );
  }

  showUploadModal() {
    app.modal.show(UploadSharedFileModal, {
      onUploadComplete: (files: File | File[]) => {
        this.uploadComplete(files);
      },
    });
  }

  mainActionItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('refresh', <Button className="Button Button--icon" icon="fas fa-sync" onclick={() => this.refresh()} />);

    items.add(
      'upload-new',
      <Button className="Button" icon="fas fa-upload" onclick={() => this.showUploadModal()}>
        {app.translator.trans('fof-upload.admin.shared-uploads.upload-new-button')}
      </Button>
    );

    return items;
  }

  fileActionItems(file: File): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    return items;
  }

  uploadComplete(files: File | File[]) {
    console.log('upload complete', files);
    this.fileState.addToList(files);
  }

  refresh() {
    this.fileState.refresh();
  }

  onDelete(file: File) {
    this.fileState.removeFromList(file);
  }
}
