import app from 'flarum/admin/app';
import AdminPage, { AdminHeaderAttrs } from 'flarum/admin/components/AdminPage';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import { IPageAttrs } from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import UploadSharedFileModal from '../../common/components/UploadSharedFileModal';
import File from 'src/common/models/File';
import UploadedFile from '../../common/components/UploadedFile';

export default class SharedUploadPage<CustomAttrs extends IPageAttrs = IPageAttrs> extends AdminPage<CustomAttrs> {
  sharedUploads: File[] = [];
  currentPage: number = 1;

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    this.loadSharedUploads();
  }

  headerInfo(): AdminHeaderAttrs {
    return {
      className: 'SharedUploadPage--header',
      icon: 'fas fa-file-upload',
      title: app.translator.trans('fof-upload.admin.shared-uploads.title'),
      description: app.translator.trans('fof-upload.admin.shared-uploads.description'),
    };
  }

  loadSharedUploads(page: number = 1) {
    this.loading = true;

    app.store
      .find<File[]>('fof/upload/shared-files')
      .then((results) => {
        this.sharedUploads = results;
      })
      .catch(() => {})
      .then(() => {
        this.loading = false;
        m.redraw();
      });
  }

  content(): Mithril.Children {
    return (
      <div className="SharedUploadPage--content">
        <p className="helpText">{app.translator.trans('fof-upload.admin.shared-uploads.introduction')}</p>
        <hr />
        <div className="SharedUploadPage--main-actions">{this.mainActionItems().toArray()}</div>
        <hr />
        <div className="SharedUploadPage--uploads">
          {this.loading && <LoadingIndicator />}
          {!this.loading && this.sharedUploads.length === 0 && <p>{app.translator.trans('fof-upload.admin.shared-uploads.no-files')}</p>}
          {!this.loading &&
            this.sharedUploads.map((file: File) => {
              return <UploadedFile file={file} />;
            })}
        </div>
      </div>
    );
  }

  mainActionItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('refresh', <Button className="Button Button--icon" icon="fas fa-sync" onclick={() => this.loadSharedUploads(this.currentPage)} />);

    items.add(
      'upload-new',
      <Button className="Button" icon="fas fa-upload" onclick={() => app.modal.show(UploadSharedFileModal)}>
        {app.translator.trans('fof-upload.admin.shared-uploads.upload-new-button')}
      </Button>
    );

    return items;
  }

  fileActionItems(file: File): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    return items;
  }
}
