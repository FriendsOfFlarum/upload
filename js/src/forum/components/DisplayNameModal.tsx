import app from 'flarum/forum/app';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import type Mithril from 'mithril';
import type File from '../../common/models/File';

export interface DisplayNameModalAttrs extends IInternalModalAttrs {
  files: File[];
  onsubmit: (displayNames: Record<string, string>) => void;
}

/**
 * Asks for optional display names before files are inserted into a post.
 *
 * Handles the whole batch in one modal: core's ModalManager closes any open
 * modal when a new one is shown, so prompting per file would drop all but the
 * last. Submitting without changing anything keeps the file names, so this stays
 * a no-op for anyone who does not care.
 */
export default class DisplayNameModal extends Modal<DisplayNameModalAttrs> {
  /** Keyed by file id, so order changes cannot mis-assign a name to a file. */
  displayNames: Record<string, string> = {};

  oninit(vnode: Mithril.Vnode<DisplayNameModalAttrs, this>) {
    super.oninit(vnode);

    this.attrs.files.forEach((file) => {
      this.displayNames[file.id()!] = file.baseName();
    });
  }

  className() {
    return 'Modal--small fof-upload-display-name-modal';
  }

  title() {
    return app.translator.trans(
      this.attrs.files.length === 1 ? 'fof-upload.forum.display_name.title' : 'fof-upload.forum.display_name.title_plural',
      { count: this.attrs.files.length }
    );
  }

  content() {
    return (
      <div className="Modal-body">
        <p className="helpText">{app.translator.trans('fof-upload.forum.display_name.help')}</p>

        {this.attrs.files.map((file, index) => {
          const id = file.id()!;

          return (
            <div className="Form-group" key={id}>
              <label htmlFor={`fof-upload-display-name-${id}`}>{file.baseName()}</label>
              <input
                id={`fof-upload-display-name-${id}`}
                className="FormControl"
                value={this.displayNames[id]}
                placeholder={file.baseName()}
                oninput={(e: InputEvent) => {
                  this.displayNames[id] = (e.target as HTMLInputElement).value;
                }}
                onkeydown={(e: KeyboardEvent) => {
                  // Enter submits only from a single-file prompt; with several
                  // inputs it would be too easy to submit while still typing.
                  if (e.key === 'Enter' && this.attrs.files.length === 1) {
                    e.preventDefault();
                    this.onsubmit();
                  }
                }}
                data-first={index === 0 ? 'true' : undefined}
              />
            </div>
          );
        })}

        <div className="Form-group fof-upload-display-name-actions">
          <Button className="Button Button--primary" onclick={() => this.onsubmit()}>
            {app.translator.trans('fof-upload.forum.display_name.insert')}
          </Button>
          <Button className="Button" onclick={() => this.useFileNames()}>
            {app.translator.trans('fof-upload.forum.display_name.use_file_name')}
          </Button>
        </div>
      </div>
    );
  }

  oncreate(vnode: Mithril.VnodeDOM<DisplayNameModalAttrs, this>) {
    super.oncreate(vnode);

    // Select the first pre-filled name so typing replaces it outright.
    const input = this.element.querySelector('input[data-first]') as HTMLInputElement | null;
    input?.focus();
    input?.select();
  }

  onsubmit() {
    this.attrs.onsubmit(this.displayNames);
    this.hide();
  }

  useFileNames() {
    // Empty strings fall back to the file name in applyDisplayName().
    const cleared: Record<string, string> = {};
    this.attrs.files.forEach((file) => {
      cleared[file.id()!] = '';
    });

    this.attrs.onsubmit(cleared);
    this.hide();
  }
}
