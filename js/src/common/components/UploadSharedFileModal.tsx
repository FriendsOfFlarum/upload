import app from 'flarum/common/app';
import FormModal, { type IFormModalAttrs } from 'flarum/common/components/FormModal';
import Button from 'flarum/common/components/Button';
import Form from 'flarum/common/components/Form';
import FormGroup from 'flarum/common/components/FormGroup';
import Icon from 'flarum/common/components/Icon';
import Stream from 'flarum/common/utils/Stream';
import extractText from 'flarum/common/utils/extractText';
import type Mithril from 'mithril';
import type File from '../models/File';
import mimeToIcon from '../mimeToIcon';
import FileDropTarget from '../utils/FileDropTarget';
import uploadFile from '../utils/uploadFile';

type NativeFile = globalThis.File;

interface QueuedFile {
  file: NativeFile;
  preview: string | null;
}

export interface UploadSharedFileModalAttrs extends IFormModalAttrs {
  // Files dropped on the shared library before this opened.
  files?: NativeFile[];
  onUploadComplete: (files: File | File[]) => void;
}

export default class UploadSharedFileModal extends FormModal<UploadSharedFileModalAttrs> {
  queue: QueuedFile[] = [];
  hidden = Stream(false);
  dropTarget: FileDropTarget | null = null;
  closed = false;

  oninit(vnode: Mithril.Vnode<UploadSharedFileModalAttrs, this>) {
    super.oninit(vnode);

    this.add(this.attrs.files ?? []);
  }

  oncreate(vnode: Mithril.VnodeDOM<UploadSharedFileModalAttrs, this>) {
    super.oncreate(vnode);

    const zone = this.element.querySelector('.UploadSharedFileModal-dropzone');

    if (zone) this.dropTarget = new FileDropTarget((files) => this.add(Array.from(files)), zone);
  }

  onremove(vnode: Mithril.VnodeDOM<UploadSharedFileModalAttrs, this>) {
    super.onremove(vnode);

    this.closed = true;
    this.dropTarget?.unload();
    this.queue.forEach((queued) => queued.preview && URL.revokeObjectURL(queued.preview));
  }

  className(): string {
    return 'UploadSharedFileModal Modal--medium';
  }

  title(): Mithril.Children {
    return app.translator.trans('fof-upload.lib.upload-shared-file-modal.title');
  }

  content(): Mithril.Children {
    return (
      <div className="Modal-body">
        <Form>
          <label className="UploadSharedFileModal-dropzone">
            <Icon name="fas fa-cloud-upload-alt" />
            <span>{app.translator.trans('fof-upload.lib.upload-shared-file-modal.dropzone')}</span>
            <input className="visually-hidden" type="file" multiple disabled={this.loading} onchange={(e: Event) => this.chosen(e)} />
          </label>

          {this.queue.length ? (
            <ul className="UploadSharedFileModal-files">
              {this.queue.map((queued) => (
                <li key={queued.preview ?? queued.file.name + queued.file.lastModified} className="UploadSharedFileModal-file">
                  {queued.preview ? <img src={queued.preview} alt="" /> : <Icon name={mimeToIcon(queued.file.type)} />}
                  <span className="UploadSharedFileModal-fileName">{queued.file.name}</span>
                  <Button
                    className="Button Button--icon Button--link"
                    icon="fas fa-times"
                    disabled={this.loading}
                    aria-label={extractText(app.translator.trans('fof-upload.lib.upload-shared-file-modal.remove', { fileName: queued.file.name }))}
                    onclick={() => this.remove(queued)}
                  />
                </li>
              ))}
            </ul>
          ) : null}

          <FormGroup
            type="switch"
            label={app.translator.trans('fof-upload.lib.upload-shared-file-modal.hide-from-media-gallery')}
            stream={this.hidden}
          />

          <div className="Form-group Form-controls">
            <Button type="submit" className="Button Button--primary" loading={this.loading} disabled={!this.queue.length}>
              {app.translator.trans('fof-upload.lib.upload-shared-file-modal.upload')}
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  chosen(e: Event): void {
    const input = e.target as HTMLInputElement;

    this.add(Array.from(input.files ?? []));
    input.value = '';
  }

  add(files: NativeFile[]): void {
    this.queue.push(...files.map((file) => ({ file, preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null })));
  }

  remove(queued: QueuedFile): void {
    if (queued.preview) URL.revokeObjectURL(queued.preview);

    this.queue = this.queue.filter((item) => item !== queued);
  }

  async onsubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    if (!this.queue.length || this.loading) return;

    this.loading = true;
    m.redraw();

    const uploaded: File[] = [];

    // Files that fail stay listed, so they can be removed or tried again.
    for (const queued of [...this.queue]) {
      try {
        uploaded.push(await uploadFile(queued.file, { shared: true, hidden: this.hidden() }));
        this.remove(queued);
      } catch {
        // uploadFile has already said which file failed and why.
      }
    }

    this.loading = false;

    if (uploaded.length) this.attrs.onUploadComplete(uploaded);

    // Closed during the uploads, hiding now would close whichever modal is on top instead.
    if (!this.queue.length && !this.closed) {
      this.hide();
    }

    m.redraw();
  }
}
