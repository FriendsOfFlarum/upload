import app from 'flarum/common/app';
import Component, { type ComponentAttrs } from 'flarum/common/Component';
import Badge from 'flarum/common/components/Badge';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import Icon from 'flarum/common/components/Icon';
import Separator from 'flarum/common/components/Separator';
import Tooltip from 'flarum/common/components/Tooltip';
import classList from 'flarum/common/utils/classList';
import extractText from 'flarum/common/utils/extractText';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import type File from '../models/File';
import mimeToIcon from '../mimeToIcon';
import { filePreview } from '../utils/filePreview';

export interface FileCardAttrs extends ComponentAttrs {
  file: File;
  mode?: 'pick' | 'browse';
  multiple?: boolean;
  // Shared by every radio in one single-select library.
  name?: string;
  selected?: boolean;
  selectable?: boolean;
  onToggle?: (file: File) => void;
  onRemoved?: (file: File, change: { deleted: boolean }) => void;
}

export default class FileCard<CustomAttrs extends FileCardAttrs = FileCardAttrs> extends Component<CustomAttrs> {
  busy = false;
  previewFailed = false;

  view() {
    const { file, mode = 'pick', selected = false, selectable = true } = this.attrs;
    const actions = this.actionItems();

    return (
      <div
        className={classList('FileCard', {
          'FileCard--selected': mode === 'pick' && selected,
          'FileCard--unavailable': mode === 'pick' && !selectable,
          'FileCard--busy': this.busy,
        })}
        aria-busy={this.busy ? 'true' : 'false'}
        data-id={file.id()}
      >
        {mode === 'pick' ? this.pickControl() : this.browseControl()}

        {actions.isEmpty() ? null : (
          <Dropdown
            className="FileCard-controls"
            buttonClassName="Button Button--icon"
            menuClassName="Dropdown-menu--right"
            icon="fas fa-ellipsis-h"
            accessibleToggleLabel={extractText(app.translator.trans('fof-upload.lib.file_list.actions_label', { fileName: file.baseName() }))}
            lazyDraw
          >
            {actions.toArray()}
          </Dropdown>
        )}
      </div>
    );
  }

  pickControl(): Mithril.Children {
    const { file, multiple = true, name, selected = false, selectable = true } = this.attrs;

    return (
      <label className="FileCard-body">
        <input
          className="FileCard-control FileCard-input"
          type={multiple ? 'checkbox' : 'radio'}
          name={multiple ? undefined : name}
          checked={selected}
          disabled={!selectable || this.busy}
          onchange={() => this.attrs.onToggle?.(file)}
        />
        {this.preview()}
        {this.details()}
      </label>
    );
  }

  browseControl(): Mithril.Children {
    const { file } = this.attrs;

    return (
      <a className="FileCard-control FileCard-body" href={file.url()} target="_blank" rel="noopener noreferrer">
        {this.preview()}
        {this.details()}
      </a>
    );
  }

  preview(): Mithril.Children {
    const { file } = this.attrs;
    const preview = this.previewFailed ? null : filePreview(file);

    return (
      <span className="FileCard-preview">
        {preview ? (
          <img
            className="FileCard-image"
            src={preview.src}
            alt=""
            loading="lazy"
            decoding="async"
            width={preview.width}
            height={preview.height}
            onerror={() => {
              this.previewFailed = true;
              m.redraw();
            }}
          />
        ) : (
          <Icon name={mimeToIcon(file.type() ?? '')} className="FileCard-icon" />
        )}
      </span>
    );
  }

  details(): Mithril.Children {
    const { file, mode = 'pick', selectable = true } = this.attrs;

    return (
      <span className="FileCard-details">
        <Tooltip text={file.baseName()}>
          <span className="FileCard-name">{file.baseName()}</span>
        </Tooltip>
        <span className="FileCard-meta">
          <span className="FileCard-size">{file.humanSize()}</span>
          {this.badges().toArray()}
        </span>
        {mode === 'pick' && !selectable ? (
          <span className="FileCard-reason helpText">{app.translator.trans('fof-upload.lib.file_list.unavailable_type')}</span>
        ) : null}
      </span>
    );
  }

  badges(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const { file } = this.attrs;

    if (file.isPrivateShared()) {
      items.add(
        'private',
        <Badge type="hidden" icon="fas fa-lock" label={extractText(app.translator.trans('fof-upload.lib.file_list.private_badge'))} />
      );
    } else if (file.hidden()) {
      items.add(
        'hidden',
        <Badge type="hidden" icon="fas fa-eye-slash" label={extractText(app.translator.trans('fof-upload.lib.file_list.hidden_badge'))} />
      );
    }

    return items;
  }

  actionItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const { file } = this.attrs;

    if (file.canHide()) {
      const [icon, label] = file.isShared()
        ? file.hidden()
          ? ['fas fa-lock-open', 'make_public']
          : ['fas fa-lock', 'make_private']
        : file.hidden()
          ? ['fas fa-eye', 'show']
          : ['fas fa-eye-slash', 'hide'];

      items.add(
        'hide-file',
        <Button icon={icon} disabled={this.busy} onclick={() => this.toggleHidden()}>
          {app.translator.trans(`fof-upload.lib.file_list.actions.${label}`)}
        </Button>,
        80
      );
    }

    if (file.canDelete()) {
      items.add('separator', <Separator />, 70);

      items.add(
        'delete-file',
        <Button icon="fas fa-trash-alt" disabled={this.busy} onclick={() => this.delete()}>
          {app.translator.trans('fof-upload.lib.file_list.actions.delete')}
        </Button>,
        60
      );
    }

    return items;
  }

  async toggleHidden(): Promise<void> {
    const { file } = this.attrs;

    if (this.busy) return;

    const prefix = file.isShared() ? 'fof-upload.lib.file_list.hide_shared_file' : 'fof-upload.lib.file_list.hide_file';
    const action = file.hidden() ? 'show' : 'hide';

    if (!confirm(extractText(app.translator.trans(`${prefix}.${action}_confirmation`, { fileName: file.baseName() })))) return;

    this.busy = true;
    m.redraw();

    try {
      const payload = await app.request<any>({
        method: 'PATCH',
        url: app.forum.attribute('apiUrl') + '/fof/upload/hide',
        body: { uuid: file.uuid() },
      });

      app.store.pushPayload(payload);
      app.alerts.show({ type: 'success' }, app.translator.trans(`${prefix}.${file.hidden() ? 'hide' : 'show'}_success`));

      if (!file.isShared() && file.hidden()) this.attrs.onRemoved?.(file, { deleted: false });
    } catch {
      // The request has already shown its error.
    } finally {
      this.busy = false;
      m.redraw();
    }
  }

  async delete(): Promise<void> {
    const { file } = this.attrs;

    if (this.busy) return;

    if (!confirm(extractText(app.translator.trans('fof-upload.lib.file_list.delete_confirmation', { fileName: file.baseName() })))) return;

    this.busy = true;
    m.redraw();

    try {
      await file.delete();

      this.attrs.onRemoved?.(file, { deleted: true });
    } catch {
      // The request has already shown its error.
    } finally {
      this.busy = false;
      m.redraw();
    }
  }
}
