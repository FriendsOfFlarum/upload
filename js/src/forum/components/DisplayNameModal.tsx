import app from 'flarum/forum/app';
import FormModal, { type IFormModalAttrs } from 'flarum/common/components/FormModal';
import Button from 'flarum/common/components/Button';
import Form from 'flarum/common/components/Form';
import FormGroup from 'flarum/common/components/FormGroup';
import Stream from 'flarum/common/utils/Stream';
import type Mithril from 'mithril';
import type File from '../../common/models/File';

export interface DisplayNameModalAttrs extends IFormModalAttrs {
  files: File[];
  // Called once, after the modal has closed: with the names, or with none when it was dismissed.
  onsubmit: (displayNames: Record<string, string>) => void;
}

export default class DisplayNameModal extends FormModal<DisplayNameModalAttrs> {
  names: Record<string, Stream<string>> = {};
  chosen: Record<string, string> | null = null;

  oninit(vnode: Mithril.Vnode<DisplayNameModalAttrs, this>) {
    super.oninit(vnode);

    this.attrs.files.forEach((file) => (this.names[file.id()!] = Stream(file.baseName())));
  }

  className(): string {
    return 'DisplayNameModal fof-upload-display-name-modal Modal--small';
  }

  title(): Mithril.Children {
    return app.translator.trans(
      this.attrs.files.length === 1 ? 'fof-upload.forum.display_name.title' : 'fof-upload.forum.display_name.title_plural',
      { count: this.attrs.files.length }
    );
  }

  content(): Mithril.Children {
    return (
      <div className="Modal-body">
        <Form description={app.translator.trans('fof-upload.forum.display_name.help', {}, true)}>
          {this.attrs.files.map((file) => (
            <FormGroup key={file.id()} type="text" label={file.baseName()} stream={this.names[file.id()!]} placeholder={file.baseName()} />
          ))}

          <div className="Form-group Form-controls">
            <Button type="submit" className="Button Button--primary">
              {app.translator.trans('fof-upload.forum.display_name.insert')}
            </Button>
            <Button className="Button" onclick={() => this.useFileNames()}>
              {app.translator.trans('fof-upload.forum.display_name.use_file_name')}
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  onready(): void {
    const input = this.element.querySelector<HTMLInputElement>('input.FormControl');

    input?.focus();
    input?.select();
  }

  onsubmit(e: SubmitEvent): void {
    e.preventDefault();

    this.chosen = Object.fromEntries(Object.entries(this.names).map(([id, name]) => [id, name()]));
    this.hide();
  }

  // Empty names fall back to the file name in applyDisplayName().
  useFileNames(): void {
    this.chosen = {};
    this.hide();
  }

  onremove(vnode: Mithril.VnodeDOM<DisplayNameModalAttrs, this>) {
    super.onremove(vnode);

    this.attrs.onsubmit(this.chosen ?? {});
  }
}
