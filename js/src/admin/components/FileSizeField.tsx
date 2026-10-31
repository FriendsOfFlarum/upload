import app from 'flarum/admin/app';
import Component, { type ComponentAttrs } from 'flarum/common/Component';
import Alert from 'flarum/common/components/Alert';
import Select from 'flarum/common/components/Select';
import extractText from 'flarum/common/utils/extractText';
import type Stream from 'flarum/common/utils/Stream';
import type Mithril from 'mithril';
import { bestUnitForKb, effectivePhpLimitKb, fromKb, humanizeKb, toKb, UNIT_TO_KB, type SizeUnit } from '../utils/fileSize';

export interface FileSizeFieldAttrs extends ComponentAttrs {
  settingValue: Stream<string>;
  label?: Mithril.Children;
  help?: Mithril.Children;
  postMaxSize?: string;
  uploadMaxFilesize?: string;
}

let fields = 0;

// Stored in kilobytes, as Laravel's max rule reads it; typed and shown in any unit.
export default class FileSizeField extends Component<FileSizeFieldAttrs> {
  id = `fof-upload-file-size-${++fields}`;
  amount = '';
  unit: SizeUnit = 'KB';
  written: string | null = null;

  oninit(vnode: Mithril.Vnode<FileSizeFieldAttrs, this>) {
    super.oninit(vnode);

    this.load();
  }

  onbeforeupdate(vnode: Mithril.VnodeDOM<FileSizeFieldAttrs, this>) {
    super.onbeforeupdate(vnode);

    if (String(this.attrs.settingValue() ?? '') !== this.written) this.load();
  }

  load(): void {
    const kb = Number(this.attrs.settingValue()) || 0;

    this.written = String(this.attrs.settingValue() ?? '');
    this.unit = bestUnitForKb(kb);
    this.amount = kb ? String(fromKb(kb, this.unit)) : '';
  }

  write(): void {
    const amount = parseFloat(this.amount);

    // A cleared field resets to the default when saved.
    this.written = Number.isFinite(amount) ? String(toKb(amount, this.unit)) : '';
    this.attrs.settingValue(this.written);
  }

  view(): Mithril.Children {
    const kb = Number(this.attrs.settingValue()) || 0;
    const limit = effectivePhpLimitKb(this.attrs.postMaxSize, this.attrs.uploadMaxFilesize);
    const ini = { post: this.attrs.postMaxSize, upload: this.attrs.uploadMaxFilesize };

    return (
      <div className="Form-group FileSizeField">
        {this.attrs.label ? <label for={this.id}>{this.attrs.label}</label> : null}
        <div className="FileSizeField-controls">
          <input
            id={this.id}
            className="FormControl"
            type="number"
            min="0"
            step="any"
            value={this.amount}
            aria-describedby={`${this.id}-help`}
            oninput={(e: InputEvent) => {
              this.amount = (e.target as HTMLInputElement).value;
              this.write();
            }}
          />
          <Select
            options={Object.fromEntries(Object.keys(UNIT_TO_KB).map((unit) => [unit, unit]))}
            value={this.unit}
            aria-label={extractText(app.translator.trans('fof-upload.admin.labels.preferences.max_file_size_unit'))}
            onchange={(unit: SizeUnit) => {
              this.unit = unit;
              this.write();
            }}
          />
        </div>
        <p className="helpText" id={`${this.id}-help`}>
          {kb
            ? app.translator.trans('fof-upload.admin.labels.preferences.max_file_size_equivalent', { value: humanizeKb(kb), kb: kb.toLocaleString() })
            : null}
        </p>
        {limit != null && kb > limit ? (
          <Alert type="warning" dismissible={false}>
            {app.translator.trans('fof-upload.admin.warnings.max_file_size_exceeds_php', { limit: humanizeKb(limit), ...ini })}
          </Alert>
        ) : (
          <p className="helpText">{app.translator.trans('fof-upload.admin.labels.preferences.php_ini_values', ini)}</p>
        )}
      </div>
    );
  }
}
