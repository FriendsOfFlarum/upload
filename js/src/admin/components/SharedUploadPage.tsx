import app from 'flarum/admin/app';
import AdminPage, { type AdminHeaderAttrs } from 'flarum/admin/components/AdminPage';
import Button from 'flarum/common/components/Button';
import Placeholder from 'flarum/common/components/Placeholder';
import type { IPageAttrs } from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import type File from '../../common/models/File';
import FileLibrary from '../../common/components/FileLibrary';
import FileListState from '../../common/states/FileListState';

export default class SharedUploadPage<CustomAttrs extends IPageAttrs = IPageAttrs> extends AdminPage<CustomAttrs> {
  fileState = new FileListState(true);

  headerInfo(): AdminHeaderAttrs {
    return {
      className: 'SharedUploadPage',
      icon: 'fas fa-file-upload',
      title: app.translator.trans('fof-upload.admin.shared-uploads.title'),
      description: app.translator.trans('fof-upload.admin.shared-uploads.description'),
    };
  }

  content(): Mithril.Children {
    return (
      <div className="SharedUploadPage-content">
        <p className="helpText">{app.translator.trans('fof-upload.admin.shared-uploads.introduction')}</p>
        <FileLibrary
          state={this.fileState.library!}
          mode="browse"
          actions={this.mainActionItems()}
          empty={() => <Placeholder text={app.translator.trans('fof-upload.admin.shared-uploads.no-files')} />}
        />
      </div>
    );
  }

  mainActionItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'refresh',
      <Button className="Button" icon="fas fa-sync" onclick={() => this.refresh()}>
        {app.translator.trans('fof-upload.admin.shared-uploads.refresh-button')}
      </Button>
    );

    items.add(
      'upload-new',
      <Button className="Button Button--primary" icon="fas fa-upload" onclick={() => this.showUploadModal()}>
        {app.translator.trans('fof-upload.admin.shared-uploads.upload-new-button')}
      </Button>
    );

    return items;
  }

  fileActionItems(file: File): ItemList<Mithril.Children> {
    return new ItemList<Mithril.Children>();
  }

  showUploadModal(): void {
    app.modal.show(() => import('../../common/components/UploadSharedFileModal'), {
      onUploadComplete: (files: File | File[]) => this.uploadComplete(files),
    });
  }

  uploadComplete(files: File | File[]): void {
    this.fileState.addToList(files);
  }

  // Keeps what is on screen while it reloads.
  refresh(): void {
    this.fileState.library?.revalidate();
  }

  onDelete(file: File): void {
    this.fileState.removeFromList(file);
  }
}
