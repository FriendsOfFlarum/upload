import app from 'flarum/admin/app';
import Component, { type ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Select from 'flarum/common/components/Select';
import Tooltip from 'flarum/common/components/Tooltip';
import extractText from 'flarum/common/utils/extractText';
import withAttr from 'flarum/common/utils/withAttr';
import type Mithril from 'mithril';
import { buildPattern, isValidSubtype, parsePattern, suggestedSubtypes } from '../utils/mimePatterns';

type SelectOptions = Record<string, string | { label: string; disabled?: boolean }>;

export interface MimeTypeRowAttrs extends ComponentAttrs {
  pattern: string;
  adapter: string;
  template: string;
  permissionLabel: string;
  adapterOptions: SelectOptions;
  templateOptions: SelectOptions;
  index: number;
  total: number;
  error?: Mithril.Children;
  onPatternChange: (next: string) => void;
  onAdapterChange: (next: string) => void;
  onTemplateChange: (next: string) => void;
  onPermissionLabelChange: (next: string) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}

export default class MimeTypeRow extends Component<MimeTypeRowAttrs> {
  editingRaw = false;
  addingSubtype = false;
  newSubtype = '';
  subtypeError: Mithril.Children = null;

  view(): Mithril.Children {
    const { pattern, index, total, error } = this.attrs;
    const parsed = parsePattern(pattern);
    const showRaw = this.editingRaw || !parsed.friendly;
    const t = (key: string, params = {}) => extractText(app.translator.trans(`fof-upload.admin.labels.preferences.${key}`, params));

    return (
      <tr className="MimeTypeRow">
        <td className="MimeTypeRow-pattern">
          {showRaw ? this.rawEditor(parsed.friendly) : this.chipEditor(parsed.type, parsed.subtypes)}
          {error ? <p className="ValidationError">{error}</p> : null}
        </td>
        <td>
          <Select
            options={this.attrs.adapterOptions}
            value={this.attrs.adapter}
            onchange={(value: string) => this.attrs.onAdapterChange(value)}
            aria-label={t('mime_column_storage')}
          />
        </td>
        <td>
          <Select
            options={this.attrs.templateOptions}
            value={this.attrs.template}
            onchange={(value: string) => this.attrs.onTemplateChange(value)}
            aria-label={t('mime_column_display')}
          />
        </td>
        <td className="MimeTypeRow-permission">
          <input
            className="FormControl"
            placeholder={t('mime_type_permission_placeholder')}
            aria-label={t('mime_column_permission')}
            value={this.attrs.permissionLabel}
            oninput={withAttr('value', (value: string) => this.attrs.onPermissionLabelChange(value))}
          />
        </td>
        <td className="MimeTypeRow-actions">
          <Tooltip text={t('mime_move_up')}>
            <Button
              className="Button Button--icon Button--flat"
              icon="fas fa-chevron-up"
              disabled={index === 0}
              onclick={() => this.attrs.onMove(-1)}
            />
          </Tooltip>
          <Tooltip text={t('mime_move_down')}>
            <Button
              className="Button Button--icon Button--flat"
              icon="fas fa-chevron-down"
              disabled={index === total - 1}
              onclick={() => this.attrs.onMove(1)}
            />
          </Tooltip>
          <Tooltip text={t('mime_type_remove')}>
            <Button className="Button Button--icon Button--flat" icon="fas fa-trash-alt" onclick={() => this.attrs.onRemove()} />
          </Tooltip>
        </td>
      </tr>
    );
  }

  rawEditor(friendly: boolean): Mithril.Children {
    const { pattern, error } = this.attrs;

    return (
      <div className="MimeTypeRow-raw">
        <input
          className="FormControl"
          value={pattern}
          spellcheck={false}
          aria-invalid={error ? 'true' : undefined}
          aria-label={extractText(app.translator.trans('fof-upload.admin.labels.preferences.mime_column_pattern'))}
          placeholder={extractText(app.translator.trans('fof-upload.admin.labels.preferences.mime_type_regex_placeholder'))}
          oninput={withAttr('value', (value: string) => this.attrs.onPatternChange(value))}
        />
        {friendly ? (
          <Button className="Button Button--link" icon="fas fa-list" onclick={() => (this.editingRaw = false)}>
            {app.translator.trans('fof-upload.admin.labels.preferences.mime_use_simple')}
          </Button>
        ) : (
          <span className="helpText">{app.translator.trans('fof-upload.admin.labels.preferences.mime_advanced_pattern')}</span>
        )}
      </div>
    );
  }

  chipEditor(type: string, subtypes: string[]): Mithril.Children {
    return (
      <div className="MimeTypeRow-chips">
        <span className="MimeTypeRow-type">{type}/</span>
        <span className="Pill-list">
          {subtypes.map((subtype) => (
            <span className="Pill" key={subtype}>
              <span className="Pill-content">{subtype}</span>
              {/* The last subtype cannot go: a rule needs at least one. */}
              {subtypes.length > 1 ? (
                <Button
                  className="Button Button--icon"
                  icon="fas fa-times"
                  aria-label={extractText(app.translator.trans('fof-upload.admin.labels.preferences.mime_remove_subtype', { subtype }))}
                  onclick={() =>
                    this.attrs.onPatternChange(
                      buildPattern(
                        type,
                        subtypes.filter((s) => s !== subtype)
                      )
                    )
                  }
                />
              ) : null}
            </span>
          ))}
        </span>
        {this.addingSubtype ? this.subtypeInput(type, subtypes) : null}
        {this.addingSubtype ? null : this.iconButton('fas fa-plus', 'mime_add_subtype', () => (this.addingSubtype = true))}
        {this.iconButton('fas fa-code', 'mime_edit_pattern', () => (this.editingRaw = true))}
        {this.subtypeError ? <p className="ValidationError">{this.subtypeError}</p> : null}
      </div>
    );
  }

  iconButton(icon: string, key: string, onclick: () => void): Mithril.Children {
    const label = extractText(app.translator.trans(`fof-upload.admin.labels.preferences.${key}`));

    return (
      <Tooltip text={label}>
        <Button className="Button Button--icon Button--flat" icon={icon} aria-label={label} onclick={onclick} />
      </Tooltip>
    );
  }

  subtypeInput(type: string, subtypes: string[]): Mithril.Children {
    const listId = `fof-upload-subtypes-${type}-${this.attrs.index}`;

    return (
      <span className="MimeTypeRow-addSubtype">
        <input
          className="FormControl"
          list={listId}
          aria-label={extractText(app.translator.trans('fof-upload.admin.labels.preferences.mime_add_subtype'))}
          placeholder={extractText(app.translator.trans('fof-upload.admin.labels.preferences.mime_add_subtype_placeholder'))}
          value={this.newSubtype}
          oninput={withAttr('value', (value: string) => {
            this.newSubtype = value;
            this.subtypeError = null;
          })}
          onkeydown={(e: KeyboardEvent) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              this.commitSubtype(type, subtypes);
            } else if (e.key === 'Escape') {
              e.preventDefault();
              this.closeSubtypeInput();
            }
          }}
          oncreate={(vnode: Mithril.VnodeDOM) => (vnode.dom as HTMLInputElement).focus()}
        />
        <datalist id={listId}>
          {suggestedSubtypes(type, subtypes).map((suggestion) => (
            <option value={suggestion} key={suggestion} />
          ))}
        </datalist>
        <Button className="Button" onclick={() => this.commitSubtype(type, subtypes)}>
          {app.translator.trans('fof-upload.admin.labels.preferences.mime_add_subtype_confirm')}
        </Button>
        <Button className="Button Button--link" onclick={() => this.closeSubtypeInput()}>
          {app.translator.trans('fof-upload.admin.labels.preferences.mime_cancel')}
        </Button>
      </span>
    );
  }

  commitSubtype(type: string, subtypes: string[]): void {
    const value = this.newSubtype.trim();

    if (!value) return this.closeSubtypeInput();

    if (!isValidSubtype(value)) {
      this.subtypeError = app.translator.trans('fof-upload.admin.labels.preferences.mime_subtype_invalid', { subtype: value });

      return;
    }

    if (subtypes.includes(value)) {
      this.subtypeError = app.translator.trans('fof-upload.admin.labels.preferences.mime_subtype_duplicate', { subtype: value });

      return;
    }

    this.attrs.onPatternChange(buildPattern(type, [...subtypes, value]));
    this.closeSubtypeInput();
  }

  closeSubtypeInput(): void {
    this.addingSubtype = false;
    this.newSubtype = '';
    this.subtypeError = null;
  }
}
