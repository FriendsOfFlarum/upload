import app from 'flarum/admin/app';
import ExtensionPage, { type ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import Alert from 'flarum/common/components/Alert';
import Button from 'flarum/common/components/Button';
import FieldSet from 'flarum/common/components/FieldSet';
import Form from 'flarum/common/components/Form';
import FormGroup from 'flarum/common/components/FormGroup';
import Link from 'flarum/common/components/Link';
import extractText from 'flarum/common/utils/extractText';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import type Mithril from 'mithril';
import SettingsTabs, { type SettingsTab } from './SettingsTabs';
import type { MimeConfig } from './MimeTypesField';
import { syncMimePermissions, type MimePermission } from '../mimePermissions';
import { detectProvider, findProvider, providerOptions } from '../utils/storageProviders';

const PREFIX = 'fof-upload.';

export const TAB_SETTINGS: Record<string, string[]> = {
  files: ['mimeTypes', 'maxFileSize', 'whitelistedClientExtensions'],
  storage: [
    'cdnUrl',
    'imgurClientId',
    'awsS3Key',
    'awsS3Secret',
    'awsS3Bucket',
    'awsS3Region',
    'awsS3Endpoint',
    'awsS3CustomUrl',
    'awsS3UsePathStyleEndpoint',
    'awsS3ACL',
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

function parseJsonSetting<T>(value: unknown, fallback: T): T {
  if (value && typeof value === 'object') return value as T;

  try {
    return (JSON.parse(String(value || '')) as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export function mimePermissionsOf(mimeTypes: string): MimePermission[] {
  return Object.values(parseJsonSetting<Record<string, MimeConfig | string>>(mimeTypes, {}))
    .filter((config): config is MimeConfig => typeof config === 'object' && !!config.permission_label && !!config.permission_slug)
    .map((config) => ({ label: config.permission_label!, slug: config.permission_slug! }));
}

export default class UploadPage extends ExtensionPage<ExtensionPageAttrs> {
  activeTab = 'files';
  showAllAdapters = false;
  uploadMethodOptions: Record<string, string> = {};
  templateOptions: Record<string, { name: string; description: string }> = {};
  s3Provider!: Stream<string>;
  uploadS3SetByEnv = false;
  uploadLocalCdnSetByEnv = false;

  oninit(vnode: Mithril.Vnode<ExtensionPageAttrs, this>) {
    super.oninit(vnode);

    const requested = m.route.param('page');
    this.activeTab = requested && requested in TAB_SETTINGS ? requested : 'files';

    this.uploadS3SetByEnv = !!app.data.uploadS3SetByEnv;
    this.uploadLocalCdnSetByEnv = !!app.data.uploadLocalCdnSetByEnv;
    this.uploadMethodOptions = parseJsonSetting(app.data.settings[PREFIX + 'availableUploadMethods'], {});
    this.templateOptions = parseJsonSetting(app.data.settings[PREFIX + 'availableTemplates'], {});
    this.s3Provider = Stream(detectProvider(app.data.settings[PREFIX + 'awsS3Endpoint']));

    // Registered up front, so the reset lists every setting and a tab not yet opened still counts.
    Object.values(TAB_SETTINGS)
      .flat()
      .forEach((key) => this.setting(PREFIX + key, '', key));
  }

  content(): JSX.Element {
    const fileinfoAvailable = app.data.settings[PREFIX + 'fileinfo_available'] as unknown as boolean | undefined;

    return (
      <div className="ExtensionPage-settings UploadPage">
        <div className="container">
          {fileinfoAvailable === false ? (
            <Alert type="warning" dismissible={false}>
              {app.translator.trans('fof-upload.admin.warnings.fileinfo_missing')}
            </Alert>
          ) : null}

          <Form>
            <SettingsTabs tabs={this.tabs()} active={this.activeTab} onchange={(key: string) => (this.activeTab = key)} />

            <div className="Form-group Form-controls">
              {this.submitButton()}
              {this.resetButton()}
            </div>
          </Form>
        </div>
      </div>
    );
  }

  tabs(): SettingsTab[] {
    const dirty = Object.keys(this.dirty());
    const content: Record<string, () => Mithril.Children> = {
      files: () => this.filesTab(),
      storage: () => this.storageTab(),
      images: () => this.imagesTab(),
      advanced: () => this.advancedTab(),
    };

    return Object.keys(TAB_SETTINGS).map((key) => ({
      key,
      label: app.translator.trans(`fof-upload.admin.tabs.${key}`),
      dirty: TAB_SETTINGS[key].filter((setting) => dirty.includes(PREFIX + setting)).length,
      content: content[key],
    }));
  }

  filesTab(): Mithril.Children {
    return [
      this.fieldSet('fof-upload.admin.labels.preferences.mime_types', 'fof-upload.admin.help_texts.mime_types', [
        this.buildSettingComponent({
          type: 'fof-upload.mime-types',
          setting: PREFIX + 'mimeTypes',
          adapters: this.uploadMethodOptions,
          templates: this.templateOptions,
          defaultAdapter: Object.keys(this.uploadMethodOptions).pop() ?? 'local',
        }),
      ]),
      this.fieldSet('fof-upload.admin.labels.preferences.limits', null, [
        this.buildSettingComponent({
          type: 'fof-upload.file-size',
          setting: PREFIX + 'maxFileSize',
          label: app.translator.trans('fof-upload.admin.labels.preferences.max_file_size'),
          postMaxSize: app.data.settings[PREFIX + 'php_ini.post_max_size'],
          uploadMaxFilesize: app.data.settings[PREFIX + 'php_ini.upload_max_filesize'],
        }),
        this.buildSettingComponent({
          type: 'text',
          setting: PREFIX + 'whitelistedClientExtensions',
          label: app.translator.trans('fof-upload.admin.labels.client_extension.title'),
          help: app.translator.trans('fof-upload.admin.help_texts.client_extension'),
          placeholder: extractText(app.translator.trans('fof-upload.admin.labels.client_extension.placeholder')),
        }),
      ]),
    ];
  }

  storageTab(): Mithril.Children {
    const inUse = this.adaptersInUse();
    const hidden = this.hiddenAdapterCount(inUse);

    return [
      <p className="helpText UploadPage-intro">{app.translator.trans('fof-upload.admin.help_texts.storage_intro')}</p>,
      this.fieldSet(
        'fof-upload.admin.labels.local.title',
        null,
        this.uploadLocalCdnSetByEnv
          ? [this.configuredByEnvironment()]
          : [
              this.buildSettingComponent({
                type: 'url',
                setting: PREFIX + 'cdnUrl',
                label: app.translator.trans('fof-upload.admin.labels.local.cdn_url'),
                help: app.translator.trans('fof-upload.admin.help_texts.local_cdn'),
                placeholder: 'https://cdn.example.com',
              }),
            ]
      ),
      this.adaptorItems(inUse).toArray(),
      this.uninstalledAdapters(),
      hidden > 0 ? (
        <div className="Form-group UploadPage-moreStorage">
          <Button className="Button" icon="fas fa-plus" onclick={() => (this.showAllAdapters = true)}>
            {app.translator.trans('fof-upload.admin.labels.storage.configure_another', { count: hidden })}
          </Button>
          <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.storage_configure_another')}</p>
        </div>
      ) : null,
      this.showAllAdapters ? (
        <Button className="Button Button--link" icon="fas fa-eye-slash" onclick={() => (this.showAllAdapters = false)}>
          {app.translator.trans('fof-upload.admin.labels.storage.hide_unused')}
        </Button>
      ) : null,
    ];
  }

  // Shown when a file type routes to the service or it holds credentials, so a section never vanishes mid-setup.
  adaptersInUse(): Set<string> {
    const used = new Set<string>();
    const value = (key: string) => String(this.setting(PREFIX + key)() ?? '').trim() || String(app.data.settings[PREFIX + key] ?? '').trim();

    Object.values(parseJsonSetting<Record<string, MimeConfig | string>>(this.setting(PREFIX + 'mimeTypes')(), {})).forEach((config) => {
      const adapter = typeof config === 'object' ? config.adapter : config;
      if (adapter) used.add(adapter);
    });

    if (this.uploadS3SetByEnv || ['awsS3Key', 'awsS3Secret', 'awsS3Bucket', 'awsS3Endpoint'].some(value)) used.add('aws-s3');
    if (value('imgurClientId')) used.add('imgur');
    if (['qiniuKey', 'qiniuSecret', 'qiniuBucket'].some(value)) used.add('qiniu');

    return used;
  }

  hiddenAdapterCount(inUse: Set<string>): number {
    if (this.showAllAdapters) return 0;

    return ['qiniu', 'aws-s3'].filter((key) => this.uploadMethodOptions[key] !== undefined && !inUse.has(key)).length;
  }

  adaptorItems(inUse: Set<string>): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const visible = (key: string) => this.uploadMethodOptions[key] !== undefined && (this.showAllAdapters || inUse.has(key));

    // Imgur no longer issues client IDs, so only forums that already have one see it.
    if (this.uploadMethodOptions.imgur !== undefined && inUse.has('imgur')) {
      items.add(
        'imgur',
        this.fieldSet(
          'fof-upload.admin.labels.imgur.title',
          null,
          [
            <Alert type="warning" dismissible={false} className="UploadPage-deprecated">
              {app.translator.trans('fof-upload.admin.labels.imgur.deprecated')}
            </Alert>,
            this.buildSettingComponent({
              type: 'text',
              setting: PREFIX + 'imgurClientId',
              label: app.translator.trans('fof-upload.admin.labels.imgur.client_id'),
              help: app.translator.trans('fof-upload.admin.labels.imgur.tos', {
                a: <Link href="https://imgur.com/tos" external={true} target="_blank" />,
              }),
            }),
          ],
          'UploadPage-adapter UploadPage-adapter--imgur'
        ),
        100
      );
    }

    if (visible('qiniu')) {
      items.add(
        'qiniu',
        this.fieldSet(
          'fof-upload.admin.labels.qiniu.title',
          null,
          [
            this.buildSettingComponent({
              type: 'text',
              setting: PREFIX + 'qiniuKey',
              label: app.translator.trans('fof-upload.admin.labels.qiniu.key'),
            }),
            this.buildSettingComponent({
              type: 'password',
              setting: PREFIX + 'qiniuSecret',
              label: app.translator.trans('fof-upload.admin.labels.qiniu.secret'),
            }),
            this.buildSettingComponent({
              type: 'text',
              setting: PREFIX + 'qiniuBucket',
              label: app.translator.trans('fof-upload.admin.labels.qiniu.bucket'),
            }),
          ],
          'UploadPage-adapter UploadPage-adapter--qiniu'
        ),
        80
      );
    }

    if (visible('aws-s3')) {
      items.add('aws-s3', this.s3Section(), 60);
    }

    return items;
  }

  s3Section(): Mithril.Children {
    if (this.uploadS3SetByEnv) {
      return this.fieldSet(
        'fof-upload.admin.labels.aws-s3.title',
        null,
        [this.configuredByEnvironment()],
        'UploadPage-adapter UploadPage-adapter--aws'
      );
    }

    const provider = findProvider(this.s3Provider());
    const endpoint = this.setting(PREFIX + 'awsS3Endpoint')();
    const providerStream = (value?: string) => {
      if (value !== undefined) this.selectS3Provider(value);

      return this.s3Provider();
    };

    return [
      this.fieldSet(
        'fof-upload.admin.labels.aws-s3.title',
        'fof-upload.admin.help_texts.s3_provider',
        [
          // Not a setting of its own: it is read from the endpoint and fills in what the provider decides.
          <FormGroup
            type="select"
            label={app.translator.trans('fof-upload.admin.labels.aws-s3.provider')}
            options={providerOptions()}
            stream={providerStream}
          />,
          this.buildSettingComponent({
            type: 'text',
            setting: PREFIX + 'awsS3Key',
            label: app.translator.trans('fof-upload.admin.labels.aws-s3.key'),
          }),
          this.buildSettingComponent({
            type: 'password',
            setting: PREFIX + 'awsS3Secret',
            label: app.translator.trans('fof-upload.admin.labels.aws-s3.secret'),
            help: provider.key === 'aws' ? app.translator.trans('fof-upload.admin.help_texts.s3_instance_profile') : undefined,
          }),
          this.buildSettingComponent({
            type: 'text',
            setting: PREFIX + 'awsS3Bucket',
            label: app.translator.trans('fof-upload.admin.labels.aws-s3.bucket'),
          }),
          provider.needsRegion
            ? this.buildSettingComponent({
                type: 'text',
                setting: PREFIX + 'awsS3Region',
                label: app.translator.trans('fof-upload.admin.labels.aws-s3.region'),
                placeholder: provider.key === 'aws' ? 'eu-west-2' : '',
              })
            : null,
          provider.key !== 'aws' || endpoint
            ? this.buildSettingComponent({
                type: 'url',
                setting: PREFIX + 'awsS3Endpoint',
                label: app.translator.trans('fof-upload.admin.labels.aws-s3.endpoint'),
                help: app.translator.trans('fof-upload.admin.help_texts.s3_endpoint'),
                placeholder: provider.endpointHint,
              })
            : null,
          this.buildSettingComponent({
            type: 'url',
            setting: PREFIX + 'awsS3CustomUrl',
            label: app.translator.trans('fof-upload.admin.labels.aws-s3.custom_url'),
            help: app.translator.trans('fof-upload.admin.help_texts.custom_s3_url'),
            placeholder: provider.customUrlHint,
          }),
        ],
        'UploadPage-adapter UploadPage-adapter--aws'
      ),
      this.fieldSet('fof-upload.admin.labels.aws-s3.advanced_title', null, [
        this.buildSettingComponent({
          type: 'switch',
          setting: PREFIX + 'awsS3UsePathStyleEndpoint',
          label: app.translator.trans('fof-upload.admin.labels.aws-s3.use_path_style_endpoint'),
          help: app.translator.trans('fof-upload.admin.help_texts.s3_path_style'),
        }),
        this.buildSettingComponent({
          type: 'text',
          setting: PREFIX + 'awsS3ACL',
          label: app.translator.trans('fof-upload.admin.labels.aws-s3.acl'),
          disabled: !provider.supportsAcl,
          help: provider.supportsAcl
            ? app.translator.trans('fof-upload.admin.help_texts.s3_acl')
            : app.translator.trans('fof-upload.admin.help_texts.s3_acl_unsupported', { provider: provider.name }),
        }),
      ]),
    ];
  }

  // Only what the provider determines changes; credentials, bucket and endpoint stay as typed.
  selectS3Provider(key: string): void {
    const provider = findProvider(key);

    this.s3Provider(key);
    this.setting(PREFIX + 'awsS3UsePathStyleEndpoint')(provider.pathStyle as unknown as string);

    if (!provider.supportsAcl) this.setting(PREFIX + 'awsS3ACL')('');

    // AWS builds its endpoint from bucket and region; one left from another provider would override it.
    if (key === 'aws') this.setting(PREFIX + 'awsS3Endpoint')('');
  }

  uninstalledAdapters(): Mithril.Children {
    if (['aws-s3', 'qiniu'].every((key) => this.uploadMethodOptions[key] !== undefined)) return null;

    return (
      <p className="helpText UploadPage-uninstalled">
        {app.translator.trans('fof-upload.admin.help_texts.storage_not_installed', {
          a: <Link href="https://github.com/FriendsOfFlarum/upload/blob/2.x/README.md#installing-storage-adapters" external={true} target="_blank" />,
        })}
      </p>
    );
  }

  imagesTab(): Mithril.Children {
    const on = (key: string) => {
      const value = this.setting(PREFIX + key)() as unknown;

      return !!value && value !== '0';
    };
    const number = (key: string, label: string, attrs: Record<string, unknown> = {}) =>
      this.buildSettingComponent({ type: 'number', setting: PREFIX + key, label: app.translator.trans(label), ...attrs });

    return [
      this.fieldSet('fof-upload.admin.labels.resize.title', 'fof-upload.admin.help_texts.resize', [
        this.buildSettingComponent({
          type: 'switch',
          setting: PREFIX + 'mustResize',
          label: app.translator.trans('fof-upload.admin.labels.resize.toggle'),
        }),
        on('mustResize') ? number('resizeMaxWidth', 'fof-upload.admin.labels.resize.max_width', { min: 1 }) : null,
      ]),
      this.fieldSet('fof-upload.admin.labels.thumbnails.title', 'fof-upload.admin.help_texts.thumbnails', [
        this.buildSettingComponent({
          type: 'switch',
          setting: PREFIX + 'generateThumbnails',
          label: app.translator.trans('fof-upload.admin.labels.thumbnails.toggle'),
        }),
        ...(on('generateThumbnails')
          ? [
              this.buildSettingComponent({
                type: 'switch',
                setting: PREFIX + 'thumbnailWebp',
                label: app.translator.trans('fof-upload.admin.labels.thumbnails.webp_toggle'),
              }),
              number('thumbnailMaxWidth', 'fof-upload.admin.labels.thumbnails.max_width', { min: 100, max: 4000 }),
              number('thumbnailQuality', 'fof-upload.admin.labels.thumbnails.quality', {
                min: 1,
                max: 100,
                help: app.translator.trans('fof-upload.admin.help_texts.thumbnail_quality'),
              }),
            ]
          : []),
      ]),
      this.fieldSet('fof-upload.admin.labels.watermark.title', 'fof-upload.admin.help_texts.watermark', [
        this.buildSettingComponent({
          type: 'switch',
          setting: PREFIX + 'addsWatermarks',
          label: app.translator.trans('fof-upload.admin.labels.watermark.toggle'),
        }),
        ...(on('addsWatermarks')
          ? [
              // Stored by its own endpoint rather than by Save, so it is read here, never tracked as a change.
              <FormGroup
                type="image-upload"
                stream={() => app.data.settings['fof-watermark_path']}
                name="fof-watermark"
                routePath="fof/watermark"
                url={app.forum.attribute('fof-watermarkUrl')}
                label={app.translator.trans('fof-upload.admin.labels.watermark.file')}
                // Uploading reloads the page, which would drop unsaved changes.
                disabled={this.isChanged() > 0}
                help={this.isChanged() ? app.translator.trans('fof-upload.admin.help_texts.watermark_save_first') : undefined}
              />,
              this.buildSettingComponent({
                type: 'select',
                setting: PREFIX + 'watermarkPosition',
                label: app.translator.trans('fof-upload.admin.labels.watermark.position'),
                options: Object.fromEntries(
                  ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'].map((position) => [
                    position,
                    extractText(app.translator.trans(`fof-upload.admin.labels.watermark.positions.${position}`)),
                  ])
                ),
              }),
              number('watermarkSizePercent', 'fof-upload.admin.labels.watermark.size_percent', { min: 1, max: 100 }),
              number('watermarkOpacity', 'fof-upload.admin.labels.watermark.opacity', { min: 0, max: 100 }),
              number('watermarkPadding', 'fof-upload.admin.labels.watermark.padding', { min: 0 }),
            ]
          : []),
      ]),
      this.fieldSet('fof-upload.admin.labels.svg-sanitizer.title', 'fof-upload.admin.labels.svg-sanitizer.help', [
        this.buildSettingComponent({
          type: 'switch',
          setting: PREFIX + 'svgAnimateAllowed',
          label: app.translator.trans('fof-upload.admin.labels.svg-sanitizer.allow_animate'),
          help: app.translator.trans('fof-upload.admin.labels.svg-sanitizer.allow_animate_help'),
        }),
      ]),
    ];
  }

  advancedTab(): Mithril.Children {
    return [
      this.fieldSet('fof-upload.admin.labels.composer.title', null, [
        this.buildSettingComponent({
          type: 'select',
          setting: PREFIX + 'composerButtonVisiblity',
          label: app.translator.trans('fof-upload.admin.labels.composer_buttons.title'),
          help: app.translator.trans('fof-upload.admin.help_texts.composer_buttons'),
          options: {
            both: extractText(app.translator.trans('fof-upload.admin.labels.composer_buttons.options.both')),
            'upload-btn': extractText(app.translator.trans('fof-upload.admin.labels.composer_buttons.options.upload-btn')),
            'media-btn': extractText(app.translator.trans('fof-upload.admin.labels.composer_buttons.options.media-btn')),
          },
        }),
      ]),
      this.fieldSet('fof-upload.admin.labels.downloads.title', null, [
        this.buildSettingComponent({
          type: 'switch',
          setting: PREFIX + 'disableHotlinkProtection',
          label: app.translator.trans('fof-upload.admin.labels.disable-hotlink-protection.title'),
          help: app.translator.trans('fof-upload.admin.help_texts.disable-hotlink-protection'),
        }),
        this.buildSettingComponent({
          type: 'switch',
          setting: PREFIX + 'disableDownloadLogging',
          label: app.translator.trans('fof-upload.admin.labels.disable-download-logging.title'),
          help: app.translator.trans('fof-upload.admin.help_texts.disable-download-logging'),
        }),
      ]),
    ];
  }

  onsaved(): void {
    const previous = mimePermissionsOf(this.savedMimeTypes);

    super.onsaved();

    syncMimePermissions(previous, mimePermissionsOf(this.setting(PREFIX + 'mimeTypes')()));
  }

  saveSettings(e: any) {
    this.savedMimeTypes = app.data.settings[PREFIX + 'mimeTypes'] ?? '';

    return super.saveSettings(e);
  }

  protected savedMimeTypes = '';

  protected fieldSet(label: string, description: string | null, children: Mithril.Children, className?: string): Mithril.Children {
    return (
      <FieldSet
        className={['FieldSet--form', className].filter(Boolean).join(' ')}
        label={extractText(app.translator.trans(label))}
        description={description ? extractText(app.translator.trans(description)) : undefined}
      >
        {children}
      </FieldSet>
    );
  }

  protected configuredByEnvironment(): Mithril.Children {
    return <p className="helpText">{app.translator.trans('fof-upload.admin.labels.configured_by_environment')}</p>;
  }
}
