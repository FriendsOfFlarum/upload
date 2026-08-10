import app from 'flarum/admin/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Select from 'flarum/common/components/Select';
import Tooltip from 'flarum/common/components/Tooltip';
import withAttr from 'flarum/common/utils/withAttr';
import type Mithril from 'mithril';
import { buildPattern, isValidSubtype, parsePattern, suggestedSubtypes } from '../utils/mimePatterns';

export interface MimeTypeRowAttrs extends ComponentAttrs {
  pattern: string;
  adapter: string;
  template: string;
  permissionLabel: string;
  adapterOptions: Record<string, string>;
  templateOptions: Record<string, string>;
  /** Position in the list, used for the first-match-wins ordering controls. */
  index: number;
  total: number;
  onPatternChange: (next: string) => void;
  onAdapterChange: (next: string) => void;
  onTemplateChange: (next: string) => void;
  onPermissionLabelChange: (next: string) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}

/**
 * One file-type mapping.
 *
 * A stored pattern is a regex, which most admins should never have to read. When
 * it decomposes cleanly (see mimePatterns) the row shows the media type plus a
 * chip per subtype; when it does not, the raw pattern is shown in a text input
 * exactly as before, so nothing an admin wrote by hand is ever reinterpreted.
 *
 * "Edit pattern" switches any row to the raw input regardless, so a technical
 * admin is never boxed in by the friendly view.
 */
export default class MimeTypeRow extends Component<MimeTypeRowAttrs> {
  /** Raw-regex editing, either forced by the admin or because the pattern is advanced. */
  editingRaw = false;
  /** Open state of the "add subtype" control. */
  addingSubtype = false;
  newSubtype = '';

  view(vnode: Mithril.Vnode<MimeTypeRowAttrs, this>) {
    const { pattern, index, total } = this.attrs;
    const parsed = parsePattern(pattern);
    const showRaw = this.editingRaw || !parsed.friendly;

    return (
      <tr className="UploadPage-mimeTypeRow">
        <td className="UploadPage-mimeTypeCell UploadPage-mimeTypeCell--pattern">
          {showRaw ? this.rawPatternInput(parsed.friendly) : this.chipEditor(parsed.type, parsed.subtypes)}
        </td>

        <td className="UploadPage-mimeTypeCell">
          <Select options={this.attrs.adapterOptions} value={this.attrs.adapter || 'local'} onchange={(v: string) => this.attrs.onAdapterChange(v)} />
        </td>

        <td className="UploadPage-mimeTypeCell">
          <Select
            options={this.attrs.templateOptions}
            value={this.attrs.template || 'file'}
            onchange={(v: string) => this.attrs.onTemplateChange(v)}
          />
        </td>

        <td className="UploadPage-mimeTypeCell">
          <input
            className="FormControl"
            placeholder={app.translator.trans('fof-upload.admin.labels.preferences.mime_type_permission_placeholder', {}, true)}
            value={this.attrs.permissionLabel}
            oninput={withAttr('value', (v: string) => this.attrs.onPermissionLabelChange(v))}
          />
        </td>

        <td className="UploadPage-mimeTypeCell UploadPage-mimeTypeActions">
          <Tooltip text={app.translator.trans('fof-upload.admin.labels.preferences.mime_move_up', {}, true)}>
            <Button
              type="button"
              className="Button Button--icon Button--text"
              icon="fas fa-chevron-up"
              disabled={index === 0}
              aria-label={app.translator.trans('fof-upload.admin.labels.preferences.mime_move_up', {}, true)}
              onclick={() => this.attrs.onMove(-1)}
            />
          </Tooltip>
          <Tooltip text={app.translator.trans('fof-upload.admin.labels.preferences.mime_move_down', {}, true)}>
            <Button
              type="button"
              className="Button Button--icon Button--text"
              icon="fas fa-chevron-down"
              disabled={index === total - 1}
              aria-label={app.translator.trans('fof-upload.admin.labels.preferences.mime_move_down', {}, true)}
              onclick={() => this.attrs.onMove(1)}
            />
          </Tooltip>
          <Tooltip text={app.translator.trans('fof-upload.admin.labels.preferences.mime_type_remove', {}, true)}>
            <Button
              type="button"
              className="Button Button--icon Button--text UploadPage-mimeTypeRemove"
              icon="fas fa-trash"
              aria-label={app.translator.trans('fof-upload.admin.labels.preferences.mime_type_remove', {}, true)}
              onclick={() => this.attrs.onRemove()}
            />
          </Tooltip>
        </td>
      </tr>
    );
  }

  /**
   * Raw regex input, for advanced patterns and for anyone who prefers it.
   *
   * `canReturnToChips` is false when the pattern cannot be represented as chips,
   * in which case there is nothing to switch back to and the toggle is replaced
   * by an explanation.
   */
  rawPatternInput(canReturnToChips: boolean) {
    return (
      <div className="UploadPage-patternRaw">
        <input
          className="FormControl UploadPage-mimeTypeInput"
          value={this.attrs.pattern}
          spellcheck={false}
          oninput={withAttr('value', (v: string) => this.attrs.onPatternChange(v))}
        />
        <div className="UploadPage-patternMeta">
          {canReturnToChips || parsePattern(this.attrs.pattern).friendly ? (
            <Button
              type="button"
              className="Button Button--text UploadPage-patternToggle"
              icon="fas fa-list"
              onclick={() => {
                this.editingRaw = false;
                m.redraw();
              }}
            >
              {app.translator.trans('fof-upload.admin.labels.preferences.mime_use_simple')}
            </Button>
          ) : (
            <span className="UploadPage-patternAdvanced">{app.translator.trans('fof-upload.admin.labels.preferences.mime_advanced_pattern')}</span>
          )}
        </div>
      </div>
    );
  }

  /** Media type plus one removable chip per subtype. */
  chipEditor(type: string, subtypes: string[]) {
    const suggestions = suggestedSubtypes(type, subtypes);

    return (
      <div className="UploadPage-patternChips">
        <span className="UploadPage-mimeTypeName">{type}/</span>

        {subtypes.map((subtype) => (
          <span className="UploadPage-chip" key={subtype}>
            {subtype}
            <button
              type="button"
              className="UploadPage-chipRemove"
              aria-label={app.translator.trans('fof-upload.admin.labels.preferences.mime_remove_subtype', { subtype }, true)}
              // The last chip cannot go: an empty subtype list has no valid
              // pattern, and silently deleting the row would be worse.
              disabled={subtypes.length === 1}
              onclick={() =>
                this.attrs.onPatternChange(
                  buildPattern(
                    type,
                    subtypes.filter((s) => s !== subtype)
                  )
                )
              }
            >
              ×
            </button>
          </span>
        ))}

        {this.addingSubtype ? (
          <span className="UploadPage-chipAdd">
            <input
              className="FormControl UploadPage-chipInput"
              list={`fof-upload-subtypes-${type}`}
              placeholder={app.translator.trans('fof-upload.admin.labels.preferences.mime_add_subtype_placeholder', {}, true)}
              value={this.newSubtype}
              oninput={withAttr('value', (v: string) => {
                this.newSubtype = v;
              })}
              onkeydown={(e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  this.commitSubtype(type, subtypes);
                }
                if (e.key === 'Escape') {
                  this.addingSubtype = false;
                  this.newSubtype = '';
                  m.redraw();
                }
              }}
              onblur={() => this.commitSubtype(type, subtypes)}
              oncreate={(vnode: Mithril.VnodeDOM) => (vnode.dom as HTMLInputElement).focus()}
            />
            <datalist id={`fof-upload-subtypes-${type}`}>
              {suggestions.map((s) => (
                <option value={s} key={s} />
              ))}
            </datalist>
          </span>
        ) : (
          <button
            type="button"
            className="UploadPage-chipAddButton"
            aria-label={app.translator.trans('fof-upload.admin.labels.preferences.mime_add_subtype', {}, true)}
            onclick={() => {
              this.addingSubtype = true;
              m.redraw();
            }}
          >
            +
          </button>
        )}

        <Button
          type="button"
          className="Button Button--text UploadPage-patternToggle"
          icon="fas fa-code"
          onclick={() => {
            this.editingRaw = true;
            m.redraw();
          }}
        >
          {app.translator.trans('fof-upload.admin.labels.preferences.mime_edit_pattern')}
        </Button>
      </div>
    );
  }

  commitSubtype(type: string, subtypes: string[]) {
    const value = this.newSubtype.trim();

    this.addingSubtype = false;
    this.newSubtype = '';

    // Silently ignore duplicates and anything the chip model cannot round-trip,
    // rather than producing a pattern that means something unexpected.
    if (!value || !isValidSubtype(value) || subtypes.includes(value)) {
      m.redraw();

      return;
    }

    this.attrs.onPatternChange(buildPattern(type, [...subtypes, value]));
    m.redraw();
  }
}
