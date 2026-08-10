import app from 'flarum/admin/app';
import Button from 'flarum/common/components/Button';
import saveSettings from 'flarum/admin/utils/saveSettings';
import Alert from 'flarum/common/components/Alert';
import Select from 'flarum/common/components/Select';
import Switch from 'flarum/common/components/Switch';
import Placeholder from 'flarum/common/components/Placeholder';
import UploadImageButton from './UploadImageButton';
import SettingsTabs, { type SettingsTab } from './SettingsTabs';
import MimeTypeRow from './MimeTypeRow';
import Tooltip from 'flarum/common/components/Tooltip';
import withAttr from 'flarum/common/utils/withAttr';
import Stream from 'flarum/common/utils/Stream';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import ItemList from 'flarum/common/utils/ItemList';
import Icon from 'flarum/common/components/Icon';
import Link from 'flarum/common/components/Link';
import type { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import type Mithril from 'mithril';
import { registerMimePermissions } from '../index';
import { bestUnitForKb, effectivePhpLimitKb, fromKb, humanizeKb, toKb, UNIT_TO_KB, type SizeUnit } from '../utils/fileSize';
import { detectProvider, findProvider, providerOptions } from '../utils/storageProviders';
import { buildPattern, MIME_PRESETS } from '../utils/mimePatterns';

type MimeConfig = {
  adapter: string;
  template: string;
  permission_label?: string;
  permission_slug?: string;
};

/**
 * Convert a human-readable permission label into a URL-safe slug.
 *
 * Steps:
 *  1. NFD-normalize so accented chars (ä, ö, ü, ñ, …) decompose into
 *     base letter + combining mark.
 *  2. Strip the combining marks (Unicode category Mn).
 *  3. Lowercase the result.
 *  4. Replace any run of non-alphanumeric characters with a single dash.
 *  5. Trim leading/trailing dashes.
 *
 * Examples:
 *   "Images"          → "images"
 *   "Vidéos & More"   → "videos-more"
 *
 * Note: ß does not decompose under NFD, so it is replaced explicitly first.
 */
function slugify(value: string): string {
  return value
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '') // strip combining marks (diacritics)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

type Values = Record<string, Stream<any>>;

/** Which tab each setting belongs to, for the per-tab unsaved-changes markers. */
const TAB_FIELDS: Record<string, string[]> = {
  files: ['maxFileSize', 'whitelistedClientExtensions', 'mimeTypes'],
  storage: [
    'cdnUrl',
    'imgurClientId',
    'awsS3Key',
    'awsS3Secret',
    'awsS3Bucket',
    'awsS3Region',
    'awsS3Endpoint',
    'awsS3ACL',
    'awsS3CustomUrl',
    'awsS3UsePathStyleEndpoint',
    'qiniuKey',
    'qiniuSecret',
    'qiniuBucket',
  ],
  images: [
    'mustResize',
    'resizeMaxWidth',
    'generateThumbnails',
    'thumbnailWebp',
    'thumbnailMaxWidth',
    'thumbnailQuality',
    'addsWatermarks',
    'watermarkPosition',
    'watermarkSizePercent',
    'watermarkOpacity',
    'watermarkPadding',
    'svgAnimateAllowed',
  ],
  advanced: ['composerButtonVisiblity', 'disableHotlinkProtection', 'disableDownloadLogging'],
};

export default class UploadPage extends ExtensionPage<ExtensionPageAttrs> {
  loading = false;
  successAlert: ReturnType<typeof app.alerts.show> | null = null;

  uploadS3SetByEnv = false;
  uploadLocalCdnSetByEnv = false;

  settingsPrefix = 'fof-upload';
  fields: string[] = [];
  checkboxes: string[] = [];
  objects: string[] = [];
  uploadMethodOptions: Record<string, string> = {};
  templateOptions: Record<string, { name: string; description: string }> = {};
  values: Values = {};
  defaultAdap = 'local';

  watermarkPositions: Record<string, string> = {};
  composerButtonVisiblityOptions: Record<string, string> = {};
  // Display-only unit for the "maximum file size" field. The setting itself
  // (this.values.maxFileSize) is always stored in kilobytes.
  maxFileSizeUnit!: Stream<SizeUnit>;
  /**
   * Selected S3 provider preset. Display-only: it drives placeholders and which
   * fields are relevant, and is derived from the saved endpoint on load rather
   * than being persisted as its own setting.
   */
  s3Provider!: Stream<string>;
  /**
   * Reveal storage services that are installed but neither configured nor used
   * by any file type, so a new one can be set up. They are hidden by default
   * because an installed adapter package is not the same thing as an adapter
   * the forum has anything to do with.
   */
  showAllAdapters = false;
  oninit(vnode: Mithril.Vnode<ExtensionPageAttrs, this>) {
    super.oninit(vnode);

    this.loading = false;
    this.uploadS3SetByEnv = !!app.data.uploadS3SetByEnv;
    this.uploadLocalCdnSetByEnv = !!app.data.uploadLocalCdnSetByEnv;

    this.fields = [
      'resizeMaxWidth',
      'thumbnailMaxWidth',
      'thumbnailQuality',
      'cdnUrl',
      'maxFileSize',
      'whitelistedClientExtensions',
      'composerButtonVisiblity',
      'watermark',
      'watermarkPosition',
      'watermarkSizePercent',
      'watermarkOpacity',
      'watermarkPadding',
      'imgurClientId',
      'awsS3Key',
      'awsS3Secret',
      'awsS3Bucket',
      'awsS3Region',
      'awsS3Endpoint',
      'awsS3ACL',
      'awsS3CustomUrl',
      'qiniuKey',
      'qiniuSecret',
      'qiniuBucket',
    ];

    this.checkboxes = [
      'mustResize',
      'generateThumbnails',
      'thumbnailWebp',
      'addsWatermarks',
      'disableHotlinkProtection',
      'disableDownloadLogging',
      'awsS3UsePathStyleEndpoint',
      'svgAnimateAllowed',
    ];

    this.objects = ['mimeTypes'];

    this.watermarkPositions = {
      'top-left': 'top-left',
      'top-right': 'top-right',
      'bottom-left': 'bottom-left',
      'bottom-right': 'bottom-right',
      center: 'center',
      left: 'left',
      top: 'top',
      right: 'right',
      bottom: 'bottom',
    };

    this.composerButtonVisiblityOptions = {
      both: app.translator.trans('fof-upload.admin.labels.composer_buttons.options.both') as string,
      'upload-btn': app.translator.trans('fof-upload.admin.labels.composer_buttons.options.upload-btn') as string,
      'media-btn': app.translator.trans('fof-upload.admin.labels.composer_buttons.options.media-btn') as string,
    };

    const settings = app.data.settings;
    const rawMethods = settings[this.addPrefix('availableUploadMethods')];
    const rawTemplates = settings[this.addPrefix('availableTemplates')];
    this.uploadMethodOptions = (
      typeof rawMethods === 'object' && rawMethods !== null ? rawMethods : typeof rawMethods === 'string' ? JSON.parse(rawMethods || '{}') : {}
    ) as Record<string, string>;
    this.templateOptions = (
      typeof rawTemplates === 'object' && rawTemplates !== null
        ? rawTemplates
        : typeof rawTemplates === 'string'
          ? JSON.parse(rawTemplates || '{}')
          : {}
    ) as Record<string, { name: string; description: string }>;

    this.fields.forEach((key) => (this.values[key] = Stream(settings[this.addPrefix(key)])));
    this.checkboxes.forEach((key) => (this.values[key] = Stream(settings[this.addPrefix(key)] === '1')));

    // Choose the friendliest unit that represents the stored KB value exactly.
    this.maxFileSizeUnit = Stream(bestUnitForKb(Number(this.values.maxFileSize()) || 0));
    this.objects.forEach((key) => {
      const val = settings[this.addPrefix(key)];
      this.values[key] = val ? Stream(JSON.parse(val)) : Stream();
    });

    this.s3Provider = Stream(detectProvider(this.values.awsS3Endpoint()));

    this.defaultAdap = Object.keys(this.uploadMethodOptions)[Object.keys(this.uploadMethodOptions).length - 1] || 'local';

    if (!this.values.mimeTypes() || Object.keys(this.values.mimeTypes()).length === 0) {
      this.values.mimeTypes = Stream({
        '^image\\/(jpeg|png|gif|webp|avif|bmp|tiff|svg\\+xml)$': {
          adapter: this.defaultAdap,
          template: 'image-preview',
          permission_label: 'Images',
          permission_slug: 'images',
        },
      });
    }
  }

  content(vnode: Mithril.VnodeDOM<ExtensionPageAttrs, this>) {
    const fileinfoAvailable = app.data.settings[this.addPrefix('fileinfo_available')] as unknown as boolean | undefined;

    return (
      <div className="UploadPage">
        <div className="UploadPage-container container">
          {fileinfoAvailable === false && (
            <Alert type="warning" dismissible={false}>
              {app.translator.trans('fof-upload.admin.warnings.fileinfo_missing')}
            </Alert>
          )}

          <form onsubmit={this.onsubmit.bind(this)}>
            <SettingsTabs tabs={this.tabs()} extensionId="fof-upload" />

            <div className="UploadPage-actions Form-group Form-controls">
              <Button type="submit" className="Button Button--primary" loading={this.loading} disabled={!this.changed()}>
                {app.translator.trans('core.admin.settings.submit_button')}
              </Button>
              {this.changed() && <span className="UploadPage-unsavedHint">{app.translator.trans('fof-upload.admin.tabs.unsaved_hint')}</span>}
            </div>
          </form>
        </div>
      </div>
    );
  }

  tabs(): SettingsTab[] {
    return [
      {
        key: 'files',
        icon: 'fas fa-file-arrow-up',
        label: app.translator.trans('fof-upload.admin.tabs.files'),
        dirty: this.tabChanged('files'),
        content: () => this.filesTab(),
      },
      {
        key: 'storage',
        icon: 'fas fa-database',
        label: app.translator.trans('fof-upload.admin.tabs.storage'),
        dirty: this.tabChanged('storage'),
        content: () => this.storageTab(),
      },
      {
        key: 'images',
        icon: 'fas fa-image',
        label: app.translator.trans('fof-upload.admin.tabs.images'),
        dirty: this.tabChanged('images'),
        content: () => this.imagesTab(),
      },
      {
        key: 'advanced',
        icon: 'fas fa-sliders',
        label: app.translator.trans('fof-upload.admin.tabs.advanced'),
        dirty: this.tabChanged('advanced'),
        content: () => this.advancedTab(),
      },
    ];
  }

  // ---------------------------------------------------------------------------
  // Tab: files & permissions
  // ---------------------------------------------------------------------------

  filesTab() {
    const maxPost = app.data.settings[this.addPrefix('php_ini.post_max_size')];
    const maxUpload = app.data.settings[this.addPrefix('php_ini.upload_max_filesize')];

    const maxFileSizeKb = Number(this.values.maxFileSize()) || 0;
    const maxFileSizeUnit = this.maxFileSizeUnit();
    const maxFileSizeInUnit = maxFileSizeKb ? fromKb(maxFileSizeKb, maxFileSizeUnit) : '';
    const phpLimitKb = effectivePhpLimitKb(maxPost, maxUpload);
    const exceedsPhpLimit = phpLimitKb != null && maxFileSizeKb > phpLimitKb;

    return (
      <div className="UploadPage-tabContent">
        {/*
          The mime mapping decides which adapter stores each file type and how it
          is rendered, so it leads the page. It used to sit below the file size
          field inside a fieldset labelled "General preferences", which buried the
          one section an admin actually has to understand.
        */}
        <fieldset className="Form-group">
          <legend>{app.translator.trans('fof-upload.admin.labels.preferences.mime_types')}</legend>
          <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.mime_types')}</p>

          {/* A real table: columns line up by definition, in every browser, with
              no per-row grid to keep in sync. */}
          <table className="UploadPage-mimeTypes">
            <thead>
              <tr className="UploadPage-mimeTypeHeader">
                <th>{this.columnHeader('pattern')}</th>
                <th>{this.columnHeader('storage')}</th>
                <th>{this.columnHeader('display')}</th>
                <th>{this.columnHeader('permission')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.values.mimeTypes()).map((mime, index, all) => {
                let config = this.values.mimeTypes()[mime] as MimeConfig | string;
                if (typeof config !== 'object') {
                  config = { adapter: config, template: 'file' };
                }
                const cfg = config as MimeConfig;

                return (
                  <MimeTypeRow
                    key={mime}
                    pattern={mime}
                    adapter={cfg.adapter}
                    template={cfg.template}
                    permissionLabel={cfg.permission_label ?? ''}
                    adapterOptions={this.uploadMethodOptions}
                    templateOptions={this.getTemplateOptionsForInput()}
                    index={index}
                    total={all.length}
                    onPatternChange={(next: string) => this.updateMimeTypeKey(mime, next)}
                    onAdapterChange={(next: string) => this.updateMimeTypeAdapter(mime, cfg, next)}
                    onTemplateChange={(next: string) => this.updateMimeTypeTemplate(mime, cfg, next)}
                    onPermissionLabelChange={(next: string) => this.updateMimeTypePermissionLabel(mime, cfg, next)}
                    onMove={(direction: -1 | 1) => this.moveMimeType(mime, direction)}
                    onRemove={() => this.deleteMimeType(mime)}
                  />
                );
              })}
            </tbody>
          </table>

          <p className="helpText UploadPage-orderNote">
            <Icon name="fas fa-circle-info" /> {app.translator.trans('fof-upload.admin.help_texts.mime_order')}
          </p>

          <div className="UploadPage-mimeTypeTools">
            <Select className="UploadPage-presetSelect" options={this.presetOptions()} value="" onchange={(key: string) => this.addPreset(key)} />
            <Button className="Button" icon="fas fa-magnifying-glass" onclick={() => app.modal.show(() => import('./InspectMimeModal'))}>
              {app.translator.trans('fof-upload.admin.labels.inspect-mime')}
            </Button>
          </div>

          <details className="UploadPage-templateHelp">
            <summary>{app.translator.trans('fof-upload.admin.help_texts.download_templates')}</summary>
            {this.templateOptionsDescriptions()}
          </details>
        </fieldset>

        <fieldset className="Form-group">
          <legend>{app.translator.trans('fof-upload.admin.labels.preferences.max_file_size')}</legend>
          <div className="UploadPage-maxFileSize">
            <input
              className="FormControl UploadPage-maxFileSize-value"
              type="number"
              min="0"
              step="any"
              value={maxFileSizeInUnit}
              oninput={withAttr('value', (v: string) => {
                const amount = parseFloat(v);
                this.values.maxFileSize(Number.isFinite(amount) ? toKb(amount, this.maxFileSizeUnit()) : '');
              })}
            />
            <Select
              className="UploadPage-maxFileSize-unit"
              options={Object.fromEntries(Object.keys(UNIT_TO_KB).map((u) => [u, u])) as Record<SizeUnit, string>}
              value={maxFileSizeUnit}
              onchange={(unit: SizeUnit) => this.maxFileSizeUnit(unit)}
            />
          </div>
          <p className="helpText">
            {app.translator.trans('fof-upload.admin.labels.preferences.max_file_size_equivalent', {
              value: humanizeKb(maxFileSizeKb),
              kb: maxFileSizeKb.toLocaleString(),
            })}
          </p>
          {exceedsPhpLimit ? (
            <Alert type="warning" dismissible={false}>
              {app.translator.trans('fof-upload.admin.warnings.max_file_size_exceeds_php', {
                limit: humanizeKb(phpLimitKb!),
                post: maxPost,
                upload: maxUpload,
              })}
            </Alert>
          ) : (
            <p className="helpText">
              {app.translator.trans('fof-upload.admin.labels.preferences.php_ini_values', {
                post: maxPost,
                upload: maxUpload,
              })}
            </p>
          )}
        </fieldset>

        <fieldset className="Form-group">
          <legend>{app.translator.trans('fof-upload.admin.labels.client_extension.title')}</legend>
          <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.client_extension')}</p>
          <input
            className="FormControl"
            placeholder={app.translator.trans('fof-upload.admin.labels.client_extension.placeholder') as string}
            value={this.values.whitelistedClientExtensions() ?? ''}
            oninput={withAttr('value', this.values.whitelistedClientExtensions)}
          />
        </fieldset>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Tab: storage
  // ---------------------------------------------------------------------------

  /**
   * Adapters whose section should be shown by default.
   *
   * Two reasons qualify an adapter: a file type routes to it, or it already has
   * credentials saved. The second matters because configuring storage before
   * pointing a file type at it is a perfectly normal order to work in — an admin
   * part-way through setting up S3 must not have the section disappear on them.
   */
  adaptersInUse(): Set<string> {
    const used = new Set<string>();

    Object.values((this.values.mimeTypes() ?? {}) as Record<string, MimeConfig | string>).forEach((config) => {
      const adapter = typeof config === 'object' ? config.adapter : config;
      if (adapter) used.add(adapter);
    });

    if (this.hasAnyValue(['awsS3Key', 'awsS3Secret', 'awsS3Bucket', 'awsS3Endpoint']) || this.uploadS3SetByEnv) {
      used.add('aws-s3');
    }

    if (this.hasAnyValue(['imgurClientId'])) {
      used.add('imgur');
    }

    if (this.hasAnyValue(['qiniuKey', 'qiniuSecret', 'qiniuBucket'])) {
      used.add('qiniu');
    }

    return used;
  }

  private hasAnyValue(keys: string[]): boolean {
    return keys.some((key) => {
      const value = this.values[key]?.();
      return typeof value === 'string' ? value.trim() !== '' : !!value;
    });
  }

  storageTab() {
    const inUse = this.adaptersInUse();
    const adapters = this.adaptorItems(inUse);
    const hidden = this.hiddenAdapterCount(inUse);

    return (
      <div className="UploadPage-tabContent">
        <p className="helpText UploadPage-storageIntro">{app.translator.trans('fof-upload.admin.help_texts.storage_intro')}</p>

        {this.uploadLocalCdnSetByEnv ? (
          <fieldset className="Form-group">
            <legend>{app.translator.trans('fof-upload.admin.labels.local.title')}</legend>
            <Placeholder text={app.translator.trans('fof-upload.admin.labels.configured_by_environment')} />
          </fieldset>
        ) : (
          <fieldset className="Form-group">
            <legend>{app.translator.trans('fof-upload.admin.labels.local.title')}</legend>
            <label>{app.translator.trans('fof-upload.admin.labels.local.cdn_url')}</label>
            <input
              className="FormControl"
              placeholder="https://cdn.example.com"
              value={this.values.cdnUrl() ?? ''}
              oninput={withAttr('value', this.values.cdnUrl)}
            />
            <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.local_cdn')}</p>
          </fieldset>
        )}

        {adapters.toArray()}

        {this.uninstalledAdapters()}

        {hidden > 0 && (
          <div className="UploadPage-addStorage">
            <Button
              className="Button"
              icon="fas fa-plus"
              onclick={() => {
                this.showAllAdapters = true;
                m.redraw();
              }}
            >
              {app.translator.trans('fof-upload.admin.labels.storage.configure_another', { count: hidden })}
            </Button>
            <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.storage_configure_another')}</p>
          </div>
        )}

        {this.showAllAdapters && (
          <Button
            className="Button Button--text UploadPage-hideUnused"
            icon="fas fa-eye-slash"
            onclick={() => {
              this.showAllAdapters = false;
              m.redraw();
            }}
          >
            {app.translator.trans('fof-upload.admin.labels.storage.hide_unused')}
          </Button>
        )}
      </div>
    );
  }

  /**
   * Pointer to the docs when a storage service is available but not installed.
   *
   * The adapters list is built from `class_exists()` checks on the backend, so a
   * service whose composer package is absent never appears anywhere on this page
   * — an admin had no way to discover S3 or Qiniu were even options. A single
   * link is enough to make that discoverable; the install commands belong in the
   * docs rather than permanently on screen.
   */
  uninstalledAdapters() {
    const anyMissing = ['aws-s3', 'qiniu'].some((key) => this.uploadMethodOptions[key] === undefined);

    if (!anyMissing) return null;

    return (
      <p className="helpText UploadPage-uninstalled">
        {app.translator.trans('fof-upload.admin.help_texts.storage_not_installed', {
          a: <Link href="https://github.com/FriendsOfFlarum/upload/blob/2.x/README.md#installing-storage-adapters" external={true} target="_blank" />,
        })}
      </p>
    );
  }

  /** How many installed adapters are currently hidden because nothing uses them. */
  hiddenAdapterCount(inUse: Set<string>): number {
    if (this.showAllAdapters) return 0;

    return ['imgur', 'qiniu', 'aws-s3'].filter((key) => this.uploadMethodOptions[key] !== undefined && !inUse.has(key)).length;
  }

  /**
   * Storage adapter credential sections.
   *
   * Only adapters a mime type actually routes to are shown. Previously every
   * installed adapter package rendered its credentials permanently, so a forum
   * with the S3 package installed but unused still had eight S3 fields on screen.
   */
  adaptorItems(inUse: Set<string>) {
    const items = new ItemList<Mithril.Children>();
    const visible = (key: string) => this.uploadMethodOptions[key] !== undefined && (this.showAllAdapters || inUse.has(key));

    if (visible('imgur')) {
      items.add(
        'imgur',
        <div className="UploadPage-adapter UploadPage-adapter--imgur">
          <fieldset className="Form-group">
            <legend>{app.translator.trans('fof-upload.admin.labels.imgur.title')}</legend>
            <p className="helpText">
              <Icon name="fas fa-exclamation-circle" />{' '}
              {app.translator.trans('fof-upload.admin.labels.imgur.tos', {
                a: <Link href="https://imgur.com/tos" external={true} target="_blank" />,
              })}
            </p>
            <label>{app.translator.trans('fof-upload.admin.labels.imgur.client_id')}</label>
            <input className="FormControl" value={this.values.imgurClientId() ?? ''} oninput={withAttr('value', this.values.imgurClientId)} />
          </fieldset>
        </div>,
        100
      );
    }

    if (visible('qiniu')) {
      items.add(
        'qiniu',
        <div className="UploadPage-adapter UploadPage-adapter--qiniu">
          <fieldset className="Form-group">
            <legend>{app.translator.trans('fof-upload.admin.labels.qiniu.title')}</legend>
            <label>{app.translator.trans('fof-upload.admin.labels.qiniu.key')}</label>
            <input className="FormControl" value={this.values.qiniuKey() ?? ''} oninput={withAttr('value', this.values.qiniuKey)} />
            <label>{app.translator.trans('fof-upload.admin.labels.qiniu.secret')}</label>
            <input
              className="FormControl"
              type="password"
              value={this.values.qiniuSecret() ?? ''}
              oninput={withAttr('value', this.values.qiniuSecret)}
            />
            <label>{app.translator.trans('fof-upload.admin.labels.qiniu.bucket')}</label>
            <input className="FormControl" value={this.values.qiniuBucket() ?? ''} oninput={withAttr('value', this.values.qiniuBucket)} />
          </fieldset>
        </div>,
        80
      );
    }

    if (visible('aws-s3')) {
      items.add('aws-s3', this.s3Section(), 60);
    }

    return items;
  }

  /**
   * S3 and S3-compatible storage.
   *
   * Previously split across "AWS S3 storage settings" and "Advanced S3 storage
   * settings", with nothing indicating that a non-AWS provider needs fields from
   * both. Now a single section led by a provider preset, which supplies the
   * endpoint format, path-style requirement and ACL support that an admin
   * otherwise had to know from the provider's own documentation.
   */
  s3Section() {
    if (this.uploadS3SetByEnv) {
      return (
        <div className="UploadPage-adapter UploadPage-adapter--aws">
          <fieldset className="Form-group">
            <legend>{app.translator.trans('fof-upload.admin.labels.aws-s3.title')}</legend>
            <Placeholder text={app.translator.trans('fof-upload.admin.labels.configured_by_environment')} />
          </fieldset>
        </div>
      );
    }

    const provider = findProvider(this.s3Provider());

    return (
      <div className="UploadPage-adapter UploadPage-adapter--aws">
        <fieldset className="Form-group">
          <legend>{app.translator.trans('fof-upload.admin.labels.aws-s3.title')}</legend>

          <div className="Form-group">
            <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.provider')}</label>
            <Select options={providerOptions()} value={this.s3Provider()} onchange={(key: string) => this.selectS3Provider(key)} />
            <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.s3_provider')}</p>
          </div>

          <div className="Form-group">
            <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.key')}</label>
            <input className="FormControl" value={this.values.awsS3Key() ?? ''} oninput={withAttr('value', this.values.awsS3Key)} />
            <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.secret')}</label>
            <input
              className="FormControl"
              type="password"
              value={this.values.awsS3Secret() ?? ''}
              oninput={withAttr('value', this.values.awsS3Secret)}
            />
            {provider.key === 'aws' && <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.s3_instance_profile')}</p>}
          </div>

          <div className="Form-group">
            <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.bucket')}</label>
            <input className="FormControl" value={this.values.awsS3Bucket() ?? ''} oninput={withAttr('value', this.values.awsS3Bucket)} />
          </div>

          {provider.needsRegion && (
            <div className="Form-group">
              <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.region')}</label>
              <input
                className="FormControl"
                placeholder={provider.key === 'aws' ? 'eu-west-2' : ''}
                value={this.values.awsS3Region() ?? ''}
                oninput={withAttr('value', this.values.awsS3Region)}
              />
            </div>
          )}

          {provider.key !== 'aws' && (
            <div className="Form-group">
              <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.endpoint')}</label>
              <input
                className="FormControl"
                placeholder={provider.endpointHint}
                value={this.values.awsS3Endpoint() ?? ''}
                oninput={withAttr('value', this.values.awsS3Endpoint)}
              />
              <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.s3_endpoint')}</p>
            </div>
          )}

          <div className="Form-group">
            <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.custom_url')}</label>
            <input
              className="FormControl"
              placeholder={provider.customUrlHint}
              value={this.values.awsS3CustomUrl() ?? ''}
              oninput={withAttr('value', this.values.awsS3CustomUrl)}
            />
            <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.custom_s3_url')}</p>
          </div>

          <details className="UploadPage-s3Advanced">
            <summary>{app.translator.trans('fof-upload.admin.labels.aws-s3.advanced_title')}</summary>

            <div className="Form-group">
              <Switch state={this.values.awsS3UsePathStyleEndpoint() || false} onchange={this.values.awsS3UsePathStyleEndpoint}>
                {app.translator.trans('fof-upload.admin.labels.aws-s3.use_path_style_endpoint')}
              </Switch>
              <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.s3_path_style')}</p>
            </div>

            <div className="Form-group">
              <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.acl')}</label>
              <input
                className="FormControl"
                value={this.values.awsS3ACL() ?? ''}
                oninput={withAttr('value', this.values.awsS3ACL)}
                disabled={!provider.supportsAcl}
              />
              <p className="helpText">
                {provider.supportsAcl
                  ? app.translator.trans('fof-upload.admin.help_texts.s3_acl')
                  : app.translator.trans('fof-upload.admin.help_texts.s3_acl_unsupported', { provider: provider.name })}
              </p>
            </div>
          </details>
        </fieldset>
      </div>
    );
  }

  /**
   * Apply a provider preset.
   *
   * Only fields the preset can meaningfully determine are touched — path-style
   * addressing, and clearing an ACL the provider would reject. Credentials,
   * bucket and endpoint stay as the admin entered them.
   */
  selectS3Provider(key: string) {
    this.s3Provider(key);

    const provider = findProvider(key);

    this.values.awsS3UsePathStyleEndpoint(provider.pathStyle);

    if (!provider.supportsAcl) {
      this.values.awsS3ACL('');
    }

    if (key === 'aws') {
      // AWS derives its endpoint from bucket + region; a stale custom endpoint
      // from another provider would override that and break URL generation.
      this.values.awsS3Endpoint('');
    }

    m.redraw();
  }

  // ---------------------------------------------------------------------------
  // Tab: images
  // ---------------------------------------------------------------------------

  imagesTab() {
    return (
      <div className="UploadPage-tabContent">
        <fieldset className="Form-group">
          <legend>{app.translator.trans('fof-upload.admin.labels.resize.title')}</legend>
          <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.resize')}</p>
          <div className="Form-group">
            <Switch state={this.values.mustResize() || false} onchange={this.values.mustResize}>
              {app.translator.trans('fof-upload.admin.labels.resize.toggle')}
            </Switch>
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('fof-upload.admin.labels.resize.max_width')}</label>
            <input
              className="FormControl"
              type="number"
              min="1"
              value={this.values.resizeMaxWidth()}
              oninput={withAttr('value', this.values.resizeMaxWidth)}
              disabled={!this.values.mustResize()}
            />
          </div>
        </fieldset>

        <fieldset className="Form-group">
          <legend>{app.translator.trans('fof-upload.admin.labels.thumbnails.title')}</legend>
          <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.thumbnails')}</p>
          <div className="Form-group">
            <Switch state={this.values.generateThumbnails() || false} onchange={this.values.generateThumbnails}>
              {app.translator.trans('fof-upload.admin.labels.thumbnails.toggle')}
            </Switch>
          </div>
          <div className="Form-group">
            <Switch state={this.values.thumbnailWebp() || false} onchange={this.values.thumbnailWebp} disabled={!this.values.generateThumbnails()}>
              {app.translator.trans('fof-upload.admin.labels.thumbnails.webp_toggle')}
            </Switch>
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('fof-upload.admin.labels.thumbnails.max_width')}</label>
            <input
              className="FormControl"
              type="number"
              min="100"
              max="4000"
              value={this.values.thumbnailMaxWidth()}
              oninput={withAttr('value', this.values.thumbnailMaxWidth)}
              disabled={!this.values.generateThumbnails()}
            />
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('fof-upload.admin.labels.thumbnails.quality')}</label>
            <input
              className="FormControl"
              type="number"
              min="1"
              max="100"
              value={this.values.thumbnailQuality()}
              oninput={withAttr('value', this.values.thumbnailQuality)}
              disabled={!this.values.generateThumbnails()}
            />
            <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.thumbnail_quality')}</p>
          </div>
        </fieldset>

        <fieldset className="Form-group">
          <legend>{app.translator.trans('fof-upload.admin.labels.watermark.title')}</legend>
          <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.watermark')}</p>
          <div className="Form-group">
            <Switch state={this.values.addsWatermarks() || false} onchange={this.values.addsWatermarks}>
              {app.translator.trans('fof-upload.admin.labels.watermark.toggle')}
            </Switch>
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('fof-upload.admin.labels.watermark.file')}</label>
            <UploadImageButton
              name="fof-watermark"
              path="fof/watermark"
              routePath="fof-watermark"
              value={app.data.settings['fof-watermark_path']}
              url={app.forum.attribute('fof-watermarkUrl')}
            />
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('fof-upload.admin.labels.watermark.position')}</label>
            <Select
              options={this.watermarkPositions}
              onchange={this.values.watermarkPosition}
              value={this.values.watermarkPosition() || 'bottom-right'}
              disabled={!this.values.addsWatermarks()}
            />
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('fof-upload.admin.labels.watermark.size_percent')}</label>
            <input
              className="FormControl"
              type="number"
              min="1"
              max="100"
              value={this.values.watermarkSizePercent()}
              oninput={withAttr('value', this.values.watermarkSizePercent)}
              disabled={!this.values.addsWatermarks()}
            />
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('fof-upload.admin.labels.watermark.opacity')}</label>
            <input
              className="FormControl"
              type="number"
              min="0"
              max="100"
              value={this.values.watermarkOpacity()}
              oninput={withAttr('value', this.values.watermarkOpacity)}
              disabled={!this.values.addsWatermarks()}
            />
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('fof-upload.admin.labels.watermark.padding')}</label>
            <input
              className="FormControl"
              type="number"
              min="0"
              value={this.values.watermarkPadding()}
              oninput={withAttr('value', this.values.watermarkPadding)}
              disabled={!this.values.addsWatermarks()}
            />
          </div>
        </fieldset>

        <fieldset className="Form-group">
          <legend>{app.translator.trans('fof-upload.admin.labels.svg-sanitizer.title')}</legend>
          <p className="helpText">{app.translator.trans('fof-upload.admin.labels.svg-sanitizer.help')}</p>
          <div className="Form-group">
            <Switch state={this.values.svgAnimateAllowed() || false} onchange={this.values.svgAnimateAllowed}>
              {app.translator.trans('fof-upload.admin.labels.svg-sanitizer.allow_animate')}
            </Switch>
            <p className="helpText">{app.translator.trans('fof-upload.admin.labels.svg-sanitizer.allow_animate_help')}</p>
          </div>
        </fieldset>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Tab: advanced
  // ---------------------------------------------------------------------------

  advancedTab() {
    return (
      <div className="UploadPage-tabContent">
        <fieldset className="Form-group UploadPage-composerButtons">
          <legend>{app.translator.trans('fof-upload.admin.labels.composer_buttons.title')}</legend>
          <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.composer_buttons')}</p>
          <Select
            options={this.composerButtonVisiblityOptions}
            onchange={this.values.composerButtonVisiblity}
            value={this.values.composerButtonVisiblity() || 'both'}
          />
        </fieldset>

        {/* Previously these two shared a single fieldset with two legends, which
            is invalid markup and read as one setting. */}
        <fieldset className="Form-group">
          <legend>{app.translator.trans('fof-upload.admin.labels.disable-hotlink-protection.title')}</legend>
          <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.disable-hotlink-protection')}</p>
          <div className="Form-group">
            <Switch state={this.values.disableHotlinkProtection() || false} onchange={this.values.disableHotlinkProtection}>
              {app.translator.trans('fof-upload.admin.labels.disable-hotlink-protection.toggle')}
            </Switch>
          </div>
        </fieldset>

        <fieldset className="Form-group">
          <legend>{app.translator.trans('fof-upload.admin.labels.disable-download-logging.title')}</legend>
          <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.disable-download-logging')}</p>
          <div className="Form-group">
            <Switch state={this.values.disableDownloadLogging() || false} onchange={this.values.disableDownloadLogging}>
              {app.translator.trans('fof-upload.admin.labels.disable-download-logging.toggle')}
            </Switch>
          </div>
        </fieldset>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Shared helpers
  // ---------------------------------------------------------------------------

  /** Column heading with a tooltip explaining what the column controls. */
  columnHeader(column: string) {
    return (
      <Tooltip text={app.translator.trans(`fof-upload.admin.labels.preferences.mime_column_${column}_help`, {}, true)}>
        <span className="UploadPage-columnHeader">{app.translator.trans(`fof-upload.admin.labels.preferences.mime_column_${column}`)}</span>
      </Tooltip>
    );
  }

  /** Options for the "add file types" picker: a prompt, the presets, then custom. */
  presetOptions(): Record<string, string> {
    const options: Record<string, string> = {
      '': app.translator.trans('fof-upload.admin.labels.preferences.mime_add_prompt', {}, true),
    };

    MIME_PRESETS.forEach((preset) => {
      options[preset.key] = app.translator.trans(`fof-upload.admin.labels.mime_presets.${preset.labelKey}`, {}, true);
    });

    options.custom = app.translator.trans('fof-upload.admin.labels.preferences.mime_add_custom', {}, true);

    return options;
  }

  /**
   * Add a row from a named preset.
   *
   * Authoring a regex from nothing is where a non-technical admin gets stuck, so
   * the presets cover the groupings forums actually ask for. "Custom" inserts an
   * empty row that opens straight into raw editing.
   */
  addPreset(key: string) {
    if (!key) return;

    const mimeTypes = this.values.mimeTypes();

    if (key === 'custom') {
      // A placeholder the admin then edits. Keyed uniquely so it cannot collide
      // with an existing row.
      let pattern = '^application\\/octet-stream$';
      let n = 2;
      while (mimeTypes[pattern] !== undefined) {
        pattern = `^application\\/octet-stream-${n++}$`;
      }

      mimeTypes[pattern] = { adapter: this.defaultAdap, template: 'file' };
      this.values.mimeTypes({ ...mimeTypes });
      m.redraw();

      return;
    }

    const preset = MIME_PRESETS.find((p) => p.key === key);
    if (!preset) return;

    const pattern = buildPattern(preset.type, preset.subtypes);

    // Adding a preset that is already present would silently replace its
    // adapter and template, so leave the existing row alone.
    if (mimeTypes[pattern] !== undefined) {
      m.redraw();

      return;
    }

    mimeTypes[pattern] = { adapter: this.defaultAdap, template: preset.template };
    this.values.mimeTypes({ ...mimeTypes });
    m.redraw();
  }

  /**
   * Move a row up or down.
   *
   * Order is significant: the backend matches with `->first()`, so the first
   * pattern that matches a file's mime type wins. Object key order survives the
   * JSON round trip on both sides, so rebuilding the object in a new order is
   * enough to change precedence.
   */
  moveMimeType(mime: string, direction: -1 | 1) {
    const mimeTypes = this.values.mimeTypes();
    const keys = Object.keys(mimeTypes);
    const from = keys.indexOf(mime);
    const to = from + direction;

    if (from === -1 || to < 0 || to >= keys.length) return;

    keys.splice(to, 0, ...keys.splice(from, 1));

    const reordered: Record<string, unknown> = {};
    keys.forEach((key) => (reordered[key] = mimeTypes[key]));

    this.values.mimeTypes(reordered);
    m.redraw();
  }

  getTemplateOptionsForInput(): Record<string, string> {
    const options: Record<string, string> = {};
    for (const option in this.templateOptions) {
      if (Object.prototype.hasOwnProperty.call(this.templateOptions, option)) {
        options[option] = this.templateOptions[option].name;
      }
    }
    return options;
  }

  templateOptionsDescriptions() {
    return (
      <ul className="UploadPage-templateList">
        {Object.keys(this.templateOptions).map((template) => (
          <li key={template}>
            <strong>{this.templateOptions[template].name}</strong>
            {/* m.trust, not dangerouslySetInnerHTML — the latter is React's API
                and silently rendered nothing here, so every description in this
                list showed up blank. */}
            {this.templateOptions[template].description ? <span> — {m.trust(this.templateOptions[template].description)}</span> : null}
          </li>
        ))}
      </ul>
    );
  }

  updateMimeTypeKey(mime: string, value: string) {
    if (value === mime) return;
    const mimeTypes = this.values.mimeTypes();
    mimeTypes[value] = mimeTypes[mime];
    delete mimeTypes[mime];
    this.values.mimeTypes({ ...mimeTypes });
    m.redraw();
  }

  updateMimeTypeAdapter(mime: string, config: MimeConfig, value: string) {
    config.adapter = value;
    const mimeTypes = this.values.mimeTypes();
    mimeTypes[mime] = config;
    this.values.mimeTypes({ ...mimeTypes });
    m.redraw();
  }

  updateMimeTypeTemplate(mime: string, config: MimeConfig, value: string) {
    config.template = value;
    const mimeTypes = this.values.mimeTypes();
    mimeTypes[mime] = config;
    this.values.mimeTypes({ ...mimeTypes });
    m.redraw();
  }

  updateMimeTypePermissionLabel(mime: string, config: MimeConfig, value: string) {
    config.permission_label = value || undefined;
    config.permission_slug = value ? slugify(value) : undefined;
    const mimeTypes = this.values.mimeTypes();
    mimeTypes[mime] = config;
    this.values.mimeTypes({ ...mimeTypes });
    m.redraw();
  }

  deleteMimeType(mime: string) {
    const mimeTypes = this.values.mimeTypes();
    delete mimeTypes[mime];
    this.values.mimeTypes({ ...mimeTypes });
    m.redraw();
  }

  /** Whether any setting belonging to the given tab differs from what is saved. */
  tabChanged(tab: string): boolean {
    return (TAB_FIELDS[tab] ?? []).some((key) => this.fieldChanged(key));
  }

  fieldChanged(key: string): boolean {
    if (this.objects.includes(key)) {
      return JSON.stringify(this.values[key]()) !== app.data.settings[this.addPrefix(key)];
    }

    if (this.checkboxes.includes(key)) {
      return this.values[key]() !== (app.data.settings[this.addPrefix(key)] === '1');
    }

    return this.values[key]?.() !== app.data.settings[this.addPrefix(key)];
  }

  changed(): boolean {
    const fieldsCheck = this.fields.some((key) => this.values[key]() !== app.data.settings[this.addPrefix(key)]);
    const checkboxesCheck = this.checkboxes.some((key) => this.values[key]() !== (app.data.settings[this.addPrefix(key)] === '1'));
    const objectsCheck = this.objects.some((key) => JSON.stringify(this.values[key]()) !== app.data.settings[this.addPrefix(key)]);
    return fieldsCheck || checkboxesCheck || objectsCheck;
  }

  onsubmit(e: Event) {
    e.preventDefault();
    if (this.loading) return;

    this.loading = true;
    app.alerts.dismiss(this.successAlert);

    const settings: Record<string, string | number | boolean> = {};
    this.fields.forEach((key) => (settings[this.addPrefix(key)] = this.values[key]()));
    this.checkboxes.forEach((key) => (settings[this.addPrefix(key)] = this.values[key]()));
    this.objects.forEach((key) => (settings[this.addPrefix(key)] = JSON.stringify(this.values[key]())));

    // Snapshot current mime permissions before the async save so the grid
    // can be updated immediately on success without waiting for a page reload.
    const mimePermsSnapshot = Object.values(this.values.mimeTypes() as Record<string, MimeConfig>)
      .filter((c) => c.permission_label && c.permission_slug)
      .map((c) => ({ label: c.permission_label!, slug: c.permission_slug! }));

    saveSettings(settings)
      .then(() => {
        this.successAlert = app.alerts.show(Alert, { type: 'success' }, app.translator.trans('core.admin.settings.saved_message'));
        registerMimePermissions(mimePermsSnapshot);
      })
      .catch(() => {})
      .then(() => {
        this.loading = false;
        m.redraw();
      });
  }

  addPrefix(key: string): string {
    return `${this.settingsPrefix}.${key}`;
  }

  isValidRegex(pattern: string): boolean {
    if (!pattern.trim()) return false;
    try {
      new RegExp(pattern);
      return true;
    } catch {
      return false;
    }
  }

  sanitizeMimeRegex(pattern: string): string {
    return pattern.replace(/\|\|+/g, '|').replace(/\|\)/g, ')').replace(/\(\|/g, '(').replace(/\|\$/g, '$').replace(/^\|/, '').replace(/\|$/, '');
  }
}
