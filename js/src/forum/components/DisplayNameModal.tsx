import app from 'flarum/forum/app';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import type Mithril from 'mithril';
import type File from '../../common/models/File';

export interface DisplayNameModalAttrs extends IInternalModalAttrs {
  file: File;
  onsubmit: (displayName: string) => void;
}

/**
 * Asks for an optional display name before a file is inserted into a post.
 *
 * Only shown for templates that render a visible label (see
 * supportsDisplayName). Submitting without changing anything keeps the file
 * name, so this stays a no-op for anyone who does not care.
 */
export default class DisplayNameModal extends Modal<DisplayNameModalAttrs> {
  displayName!: Stream<string>;

  oninit(vnode: Mithril.Vnode<DisplayNameModalAttrs, this>) {
    super.oninit(vnode);

    this.displayName = Stream(this.attrs.file.baseName());
  }

  className() {
    return 'Modal--small fof-upload-display-name-modal';
  }

  title() {
    return app.translator.trans('fof-upload.forum.display_name.title');
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form-group">
          <label htmlFor="fof-upload-display-name">{app.translator.trans('fof-upload.forum.display_name.label')}</label>
          <input
            id="fof-upload-display-name"
            className="FormControl"
            bidi={this.displayName}
            placeholder={this.attrs.file.baseName()}
            onkeydown={(e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                this.onsubmit();
              }
            }}
          />
          <p className="helpText">{app.translator.trans('fof-upload.forum.display_name.help')}</p>
        </div>

        <div className="Form-group fof-upload-display-name-actions">
          <Button className="Button Button--primary" onclick={() => this.onsubmit()}>
            {app.translator.trans('fof-upload.forum.display_name.insert')}
          </Button>
          <Button className="Button" onclick={() => this.useFileName()}>
            {app.translator.trans('fof-upload.forum.display_name.use_file_name')}
          </Button>
        </div>
      </div>
    );
  }

  oncreate(vnode: Mithril.VnodeDOM<DisplayNameModalAttrs, this>) {
    super.oncreate(vnode);

    // Select the pre-filled file name so typing replaces it outright.
    const input = this.element.querySelector('#fof-upload-display-name') as HTMLInputElement | null;
    input?.focus();
    input?.select();
  }

  onsubmit() {
    this.attrs.onsubmit(this.displayName());
    this.hide();
  }

  useFileName() {
    this.attrs.onsubmit('');
    this.hide();
  }
}
