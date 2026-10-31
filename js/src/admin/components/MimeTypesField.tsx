import app from 'flarum/admin/app';
import Component, { type ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import Separator from 'flarum/common/components/Separator';
import extractText from 'flarum/common/utils/extractText';
import type Stream from 'flarum/common/utils/Stream';
import type Mithril from 'mithril';
import MimeTypeRow from './MimeTypeRow';
import { buildPattern, MIME_PRESETS } from '../utils/mimePatterns';

export interface MimeConfig {
  adapter: string;
  template: string;
  permission_label?: string;
  permission_slug?: string;
  [key: string]: unknown;
}

interface Row {
  id: number;
  pattern: string;
  config: MimeConfig;
}

export interface MimeTypesFieldAttrs extends ComponentAttrs {
  settingValue: Stream<string>;
  label?: Mithril.Children;
  help?: Mithril.Children;
  adapters: Record<string, string>;
  templates: Record<string, { name: string; description: string }>;
  defaultAdapter: string;
}

export function slugify(value: string): string {
  return value
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Rows carry client ids, so editing a pattern never moves its row, and the order is first match wins.
export default class MimeTypesField extends Component<MimeTypesFieldAttrs> {
  rows: Row[] = [];
  nextId = 1;
  source: string | null = null;

  oninit(vnode: Mithril.Vnode<MimeTypesFieldAttrs, this>) {
    super.oninit(vnode);

    this.load();
  }

  onbeforeupdate(vnode: Mithril.VnodeDOM<MimeTypesFieldAttrs, this>) {
    super.onbeforeupdate(vnode);

    // Changed outside this field, as by a reset.
    if (this.attrs.settingValue() !== this.source) this.load();
  }

  load(): void {
    this.source = this.attrs.settingValue();

    let parsed: Record<string, MimeConfig | string> = {};

    try {
      parsed = JSON.parse(this.source || '{}') ?? {};
    } catch {
      parsed = {};
    }

    this.rows = Object.entries(parsed).map(([pattern, config]) => ({
      id: this.nextId++,
      pattern,
      config: typeof config === 'object' && config !== null ? { ...config } : { adapter: String(config), template: 'file' },
    }));
  }

  write(): void {
    const rules: Record<string, MimeConfig> = {};

    // An empty or duplicate pattern stays on screen with its error and is left out until fixed.
    this.rows.forEach((row) => {
      if (row.pattern && !(row.pattern in rules)) rules[row.pattern] = row.config;
    });

    this.source = JSON.stringify(rules);
    this.attrs.settingValue(this.source);
  }

  view(): Mithril.Children {
    const t = (key: string) => app.translator.trans(`fof-upload.admin.labels.preferences.${key}`);

    return (
      <div className="Form-group MimeTypesField">
        {this.attrs.label ? <label>{this.attrs.label}</label> : null}
        {this.attrs.help ? <div className="helpText">{this.attrs.help}</div> : null}

        <div className="MimeTypesField-scroll">
          <table className="MimeTypesField-table">
            <thead>
              <tr>
                {['pattern', 'storage', 'display', 'permission'].map((column) => (
                  <th scope="col">{t(`mime_column_${column}`)}</th>
                ))}
                <th scope="col">
                  <span className="visually-hidden">{t('mime_column_actions')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.rows.map((row, index) => (
                <MimeTypeRow
                  key={row.id}
                  pattern={row.pattern}
                  adapter={row.config.adapter}
                  template={row.config.template}
                  permissionLabel={row.config.permission_label ?? ''}
                  adapterOptions={this.options(this.attrs.adapters, row.config.adapter)}
                  templateOptions={this.options(this.templateNames(), row.config.template)}
                  index={index}
                  total={this.rows.length}
                  error={this.error(row)}
                  onPatternChange={(pattern: string) => this.update(row, () => (row.pattern = pattern))}
                  onAdapterChange={(adapter: string) => this.update(row, () => (row.config.adapter = adapter))}
                  onTemplateChange={(template: string) => this.update(row, () => (row.config.template = template))}
                  onPermissionLabelChange={(label: string) => this.update(row, () => this.setPermission(row, label))}
                  onMove={(direction: -1 | 1) => this.move(index, direction)}
                  onRemove={() => this.remove(row)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.mime_order')}</p>

        <div className="MimeTypesField-tools">
          <Dropdown className="MimeTypesField-add" buttonClassName="Button" icon="fas fa-plus" label={t('mime_add_prompt')}>
            {this.presetItems()}
          </Dropdown>
          <Button className="Button" icon="fas fa-magnifying-glass" onclick={() => app.modal.show(() => import('./InspectMimeModal'))}>
            {app.translator.trans('fof-upload.admin.labels.inspect-mime')}
          </Button>
        </div>

        <details className="MimeTypesField-templates">
          <summary>{app.translator.trans('fof-upload.admin.help_texts.download_templates')}</summary>
          <dl>{Object.values(this.attrs.templates).map((template) => [<dt>{template.name}</dt>, <dd>{m.trust(template.description)}</dd>])}</dl>
        </details>
      </div>
    );
  }

  presetItems(): Mithril.Children[] {
    const present = (pattern: string) => this.rows.some((row) => row.pattern === pattern);

    return [
      ...MIME_PRESETS.map((preset) => {
        const pattern = buildPattern(preset.type, preset.subtypes);

        return (
          <Button disabled={present(pattern)} onclick={() => this.add(pattern, preset.template)}>
            {app.translator.trans(`fof-upload.admin.labels.mime_presets.${preset.labelKey}`)}
          </Button>
        );
      }),
      <Separator />,
      <Button onclick={() => this.add('', 'file')}>{app.translator.trans('fof-upload.admin.labels.preferences.mime_add_custom')}</Button>,
    ];
  }

  templateNames(): Record<string, string> {
    return Object.fromEntries(Object.entries(this.attrs.templates).map(([key, template]) => [key, template.name]));
  }

  // A saved choice that is no longer installed stays visible, rather than showing as blank.
  options(available: Record<string, string>, current: string): Record<string, string | { label: string; disabled: boolean }> {
    if (!current || current in available) return available;

    return {
      ...available,
      [current]: { label: extractText(app.translator.trans('fof-upload.admin.labels.preferences.not_available', { name: current })), disabled: true },
    };
  }

  error(row: Row): Mithril.Children {
    const t = (key: string) => app.translator.trans(`fof-upload.admin.labels.preferences.${key}`);

    if (!row.pattern.trim()) return t('mime_pattern_empty');

    if (this.rows.some((other) => other !== row && other.pattern === row.pattern && this.rows.indexOf(other) < this.rows.indexOf(row))) {
      return t('mime_pattern_duplicate');
    }

    // Matched on the server between / delimiters, so a bare slash ends the pattern.
    if (/(^|[^\\])\//.test(row.pattern)) return t('mime_pattern_slash');

    try {
      new RegExp(row.pattern);
    } catch {
      return t('mime_type_regex_invalid');
    }

    return null;
  }

  update(row: Row, change: () => void): void {
    change();
    this.write();
  }

  setPermission(row: Row, label: string): void {
    if (!label.trim()) {
      delete row.config.permission_label;
      delete row.config.permission_slug;

      return;
    }

    row.config.permission_label = label;
    // Fixed once given, so renaming a label keeps the groups already granted it.
    row.config.permission_slug ||= slugify(label) || slugify(row.pattern) || `rule-${row.id}`;
  }

  add(pattern: string, template: string): void {
    this.rows.push({ id: this.nextId++, pattern, config: { adapter: this.attrs.defaultAdapter, template } });
    this.write();
  }

  move(index: number, direction: -1 | 1): void {
    const target = index + direction;

    if (target < 0 || target >= this.rows.length) return;

    [this.rows[index], this.rows[target]] = [this.rows[target], this.rows[index]];
    this.write();
  }

  remove(row: Row): void {
    this.rows = this.rows.filter((other) => other !== row);
    this.write();
  }
}
