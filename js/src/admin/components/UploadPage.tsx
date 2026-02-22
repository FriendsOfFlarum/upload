import app from 'flarum/admin/app';
import Button from 'flarum/common/components/Button';
import saveSettings from 'flarum/admin/utils/saveSettings';
import Alert from 'flarum/common/components/Alert';
import Select from 'flarum/common/components/Select';
import Switch from 'flarum/common/components/Switch';
import Placeholder from 'flarum/common/components/Placeholder';
import UploadImageButton from './UploadImageButton';
import withAttr from 'flarum/common/utils/withAttr';
import Stream from 'flarum/common/utils/Stream';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import ItemList from 'flarum/common/utils/ItemList';
import Icon from 'flarum/common/components/Icon';
import Link from 'flarum/common/components/Link';
import type { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import type Mithril from 'mithril';
import { registerMimePermissions } from '../index';

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
 *   "Bilder (Größen)" → "bilder-grossen"   (ö→o, ß→ss via NFD doesn't work for ß,
 *                                            see note below)
 *   "Vidéos & More"   → "videos-more"
 *
 * Note: ß does not decompose under NFD; it becomes "ss" only under NFKD-like
 * mappings that browsers don't expose. We handle it with an explicit replacement
 * before normalizing.
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
  newMimeType!: {
    regex: Stream<string>;
    adapter: Stream<string>;
    template: Stream<string>;
    permission_label: Stream<string>;
  };

  oninit(vnode: Mithril.Vnode<ExtensionPageAttrs, this>) {
    super.oninit(vnode);

    this.loading = false;
    this.uploadS3SetByEnv = !!app.data.uploadS3SetByEnv;
    this.uploadLocalCdnSetByEnv = !!app.data.uploadLocalCdnSetByEnv;

    this.fields = [
      'resizeMaxWidth',
      'cdnUrl',
      'maxFileSize',
      'whitelistedClientExtensions',
      'composerButtonVisiblity',
      'watermark',
      'watermarkPosition',
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
    this.objects.forEach((key) => {
      const val = settings[this.addPrefix(key)];
      this.values[key] = val ? Stream(JSON.parse(val)) : Stream();
    });

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

    this.newMimeType = {
      regex: Stream(''),
      adapter: Stream(this.defaultAdap),
      template: Stream('file'),
      permission_label: Stream(''),
    };
  }

  content(vnode: Mithril.VnodeDOM<ExtensionPageAttrs, this>) {
    const maxPost = app.data.settings[this.addPrefix('php_ini.post_max_size')];
    const maxUpload = app.data.settings[this.addPrefix('php_ini.upload_max_filesize')];

    return (
      <div className="UploadPage">
        <div className="UploadPage-container container">
          <form
            className="Form"
            onsubmit={(e: Event) => {
              e.preventDefault();
              this.onsubmit(e);
            }}
          >
            <div className="Form-body">
              <fieldset className="Form-group">
                <legend>{app.translator.trans('fof-upload.admin.labels.preferences.title')}</legend>
                <div className="Form-group">
                  <label>{app.translator.trans('fof-upload.admin.labels.preferences.max_file_size')}</label>
                  <input
                    className="FormControl"
                    type="number"
                    min="0"
                    value={this.values.maxFileSize() ?? ''}
                    oninput={withAttr('value', this.values.maxFileSize)}
                  />
                  <p className="helpText">
                    {app.translator.trans('fof-upload.admin.labels.preferences.php_ini_values', {
                      post: maxPost,
                      upload: maxUpload,
                    })}
                  </p>
                </div>
                <div className="Form-group">
                  <label>{app.translator.trans('fof-upload.admin.labels.preferences.mime_types')}</label>
                  <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.mime_types')}</p>
                  <div className="UploadPage-mimeTypes">
                    {Object.keys(this.values.mimeTypes()).map((mime) => {
                      let config = this.values.mimeTypes()[mime] as MimeConfig | string;
                      if (typeof config !== 'object') {
                        config = { adapter: config, template: 'file' };
                      }
                      const isInvalidRegex = !this.isValidRegex(mime);
                      return (
                        <div key={mime} className={`UploadPage-mimeTypeRow ${isInvalidRegex ? 'UploadPage-mimeTypeRow--invalid' : ''}`}>
                          <input
                            className="FormControl UploadPage-mimeTypeInput"
                            value={mime}
                            oninput={withAttr('value', (v: string) => this.updateMimeTypeKey(mime, v))}
                            onblur={(e: FocusEvent) => {
                              const value = (e.target as HTMLInputElement).value;
                              const sanitized = this.sanitizeMimeRegex(value);
                              if (sanitized !== value) {
                                this.updateMimeTypeKey(value, sanitized);
                              }
                            }}
                            title={isInvalidRegex ? app.translator.trans('fof-upload.admin.labels.preferences.mime_type_regex_invalid') : undefined}
                          />
                          <Select
                            options={this.uploadMethodOptions}
                            onchange={(v: string) => this.updateMimeTypeAdapter(mime, config as MimeConfig, v)}
                            value={config.adapter || 'local'}
                          />
                          <Select
                            options={this.getTemplateOptionsForInput()}
                            onchange={(v: string) => this.updateMimeTypeTemplate(mime, config as MimeConfig, v)}
                            value={config.template || 'file'}
                          />
                          <input
                            className="FormControl UploadPage-mimeTypePermission"
                            placeholder={app.translator.trans('fof-upload.admin.labels.preferences.mime_type_permission_placeholder') as string}
                            value={(config as MimeConfig).permission_label ?? ''}
                            oninput={withAttr('value', (v: string) => this.updateMimeTypePermissionLabel(mime, config as MimeConfig, v))}
                          />
                          <Button type="button" className="Button Button--warning" onclick={() => this.deleteMimeType(mime)}>
                            ×
                          </Button>
                        </div>
                      );
                    })}
                    <div className="UploadPage-mimeTypeRow UploadPage-mimeTypeAdd">
                      <input
                        className="FormControl UploadPage-mimeTypeInput"
                        placeholder={app.translator.trans('fof-upload.admin.labels.preferences.mime_type_regex_placeholder')}
                        value={this.newMimeType.regex()}
                        oninput={withAttr('value', this.newMimeType.regex)}
                        onblur={() => {
                          const value = this.newMimeType.regex();
                          const sanitized = this.sanitizeMimeRegex(value);
                          if (sanitized !== value) {
                            this.newMimeType.regex(sanitized);
                            m.redraw();
                          }
                        }}
                      />
                      <Select
                        options={this.uploadMethodOptions}
                        className="UploadPage-mimeTypeSelect"
                        onchange={this.newMimeType.adapter}
                        value={this.newMimeType.adapter()}
                      />
                      <Select
                        options={this.getTemplateOptionsForInput()}
                        className="UploadPage-mimeTypeSelect"
                        onchange={this.newMimeType.template}
                        value={this.newMimeType.template()}
                      />
                      <input
                        className="FormControl UploadPage-mimeTypePermission"
                        placeholder={app.translator.trans('fof-upload.admin.labels.preferences.mime_type_permission_placeholder') as string}
                        value={this.newMimeType.permission_label()}
                        oninput={withAttr('value', this.newMimeType.permission_label)}
                      />
                      <Button type="button" className="Button Button--warning" onclick={() => this.addMimeType()}>
                        +
                      </Button>
                    </div>
                  </div>
                  <Button className="Button" onclick={() => app.modal.show(() => import('./InspectMimeModal'))}>
                    {app.translator.trans('fof-upload.admin.labels.inspect-mime')}
                  </Button>
                  <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.download_templates')}</p>
                  {this.templateOptionsDescriptions()}
                </div>
              </fieldset>

              <fieldset className="Form-group UploadPage-composerButtons">
                <legend>{app.translator.trans('fof-upload.admin.labels.composer_buttons.title')}</legend>
                <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.composer_buttons')}</p>
                <Select
                  options={this.composerButtonVisiblityOptions}
                  onchange={this.values.composerButtonVisiblity}
                  value={this.values.composerButtonVisiblity() || 'both'}
                />
              </fieldset>

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
                    min="0"
                    value={this.values.resizeMaxWidth() ?? 100}
                    oninput={withAttr('value', this.values.resizeMaxWidth)}
                    disabled={!this.values.mustResize()}
                  />
                </div>
              </fieldset>

              <fieldset className="Form-group">
                <legend>{app.translator.trans('fof-upload.admin.labels.client_extension.title')}</legend>
                <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.client_extension')}</p>
                <input
                  className="FormControl"
                  value={this.values.whitelistedClientExtensions() ?? ''}
                  oninput={withAttr('value', this.values.whitelistedClientExtensions)}
                />
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
                  <label>{app.translator.trans('fof-upload.admin.labels.watermark.position')}</label>
                  <Select
                    options={this.watermarkPositions}
                    onchange={this.values.watermarkPosition}
                    value={this.values.watermarkPosition() || 'bottom-right'}
                  />
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

              <fieldset className="Form-group">
                <legend>{app.translator.trans('fof-upload.admin.labels.disable-hotlink-protection.title')}</legend>
                <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.disable-hotlink-protection')}</p>
                <div className="Form-group">
                  <Switch state={this.values.disableHotlinkProtection() || false} onchange={this.values.disableHotlinkProtection}>
                    {app.translator.trans('fof-upload.admin.labels.disable-hotlink-protection.toggle')}
                  </Switch>
                </div>
                <legend>{app.translator.trans('fof-upload.admin.labels.disable-download-logging.title')}</legend>
                <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.disable-download-logging')}</p>
                <div className="Form-group">
                  <Switch state={this.values.disableDownloadLogging() || false} onchange={this.values.disableDownloadLogging}>
                    {app.translator.trans('fof-upload.admin.labels.disable-download-logging.toggle')}
                  </Switch>
                </div>
              </fieldset>

              {!this.uploadLocalCdnSetByEnv && (
                <fieldset className="Form-group">
                  <legend>{app.translator.trans('fof-upload.admin.labels.local.title')}</legend>
                  <label>{app.translator.trans('fof-upload.admin.labels.local.cdn_url')}</label>
                  <input className="FormControl" value={this.values.cdnUrl() ?? ''} oninput={withAttr('value', this.values.cdnUrl)} />
                </fieldset>
              )}

              {this.uploadLocalCdnSetByEnv && (
                <fieldset className="Form-group">
                  <legend>{app.translator.trans('fof-upload.admin.labels.local.title')}</legend>
                  <Placeholder text={app.translator.trans('fof-upload.admin.labels.configured_by_environment')} />
                </fieldset>
              )}

              {this.adaptorItems().toArray()}

              <div className="Form-group Form-controls">
                <Button type="submit" className="Button Button--primary" loading={this.loading} disabled={!this.changed()}>
                  {app.translator.trans('core.admin.settings.submit_button')}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  adaptorItems() {
    const items = new ItemList<Mithril.Children>();

    if (this.uploadMethodOptions['imgur'] !== undefined) {
      items.add(
        'imgur',
        <div className="UploadPage-adapter UploadPage-adapter--imgur">
          <fieldset className="Form-group">
            <legend>{app.translator.trans('fof-upload.admin.labels.imgur.title')}</legend>
            <p>
              <Icon name="fas fa-exclamation-circle" />
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

    if (this.uploadMethodOptions['qiniu'] !== undefined) {
      items.add(
        'qiniu',
        <div className="UploadPage-adapter UploadPage-adapter--qiniu">
          <fieldset className="Form-group">
            <legend>{app.translator.trans('fof-upload.admin.labels.qiniu.title')}</legend>
            <label>{app.translator.trans('fof-upload.admin.labels.qiniu.key')}</label>
            <input className="FormControl" value={this.values.qiniuKey() ?? ''} oninput={withAttr('value', this.values.qiniuKey)} />
            <label>{app.translator.trans('fof-upload.admin.labels.qiniu.secret')}</label>
            <input className="FormControl" value={this.values.qiniuSecret() ?? ''} oninput={withAttr('value', this.values.qiniuSecret)} />
            <label>{app.translator.trans('fof-upload.admin.labels.qiniu.bucket')}</label>
            <input className="FormControl" value={this.values.qiniuBucket() ?? ''} oninput={withAttr('value', this.values.qiniuBucket)} />
          </fieldset>
        </div>,
        80
      );
    }

    if (this.uploadMethodOptions['aws-s3'] !== undefined) {
      if (!this.uploadS3SetByEnv) {
        items.add(
          'aws-s3',
          <div className="UploadPage-adapter UploadPage-adapter--aws">
            <fieldset className="Form-group">
              <legend>{app.translator.trans('fof-upload.admin.labels.aws-s3.title')}</legend>
              <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.s3_instance_profile')}</p>
              <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.key')}</label>
              <input className="FormControl" value={this.values.awsS3Key() ?? ''} oninput={withAttr('value', this.values.awsS3Key)} />
              <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.secret')}</label>
              <input className="FormControl" value={this.values.awsS3Secret() ?? ''} oninput={withAttr('value', this.values.awsS3Secret)} />
              <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.bucket')}</label>
              <input className="FormControl" value={this.values.awsS3Bucket() ?? ''} oninput={withAttr('value', this.values.awsS3Bucket)} />
              <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.region')}</label>
              <input className="FormControl" value={this.values.awsS3Region() ?? ''} oninput={withAttr('value', this.values.awsS3Region)} />
            </fieldset>
            <fieldset className="Form-group">
              <legend>{app.translator.trans('fof-upload.admin.labels.aws-s3.advanced_title')}</legend>
              <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.s3_compatible_storage')}</p>
              <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.endpoint')}</label>
              <input className="FormControl" value={this.values.awsS3Endpoint() ?? ''} oninput={withAttr('value', this.values.awsS3Endpoint)} />
              <div className="Form-group">
                <Switch state={this.values.awsS3UsePathStyleEndpoint() || false} onchange={this.values.awsS3UsePathStyleEndpoint}>
                  {app.translator.trans('fof-upload.admin.labels.aws-s3.use_path_style_endpoint')}
                </Switch>
              </div>
              <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.acl')}</label>
              <input className="FormControl" value={this.values.awsS3ACL() ?? ''} oninput={withAttr('value', this.values.awsS3ACL)} />
              <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.s3_acl')}</p>
              <label>{app.translator.trans('fof-upload.admin.labels.aws-s3.custom_url')}</label>
              <input className="FormControl" value={this.values.awsS3CustomUrl() ?? ''} oninput={withAttr('value', this.values.awsS3CustomUrl)} />
              <p className="helpText">{app.translator.trans('fof-upload.admin.help_texts.custom_s3_url')}</p>
            </fieldset>
          </div>,
          60
        );
      } else {
        items.add(
          'aws-s3',
          <div className="UploadPage-adapter UploadPage-adapter--aws">
            <fieldset className="Form-group">
              <legend>{app.translator.trans('fof-upload.admin.labels.aws-s3.title')}</legend>
              <Placeholder text={app.translator.trans('fof-upload.admin.labels.configured_by_environment')} />
            </fieldset>
          </div>,
          60
        );
      }
    }

    return items;
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

  templateOptionsDescriptions() {
    return (
      <ul className="UploadPage-templateList">
        {Object.keys(this.templateOptions).map((template) => (
          <li key={template}>
            {this.templateOptions[template].name}: <span dangerouslySetInnerHTML={{ __html: this.templateOptions[template].description }} />
          </li>
        ))}
      </ul>
    );
  }

  addMimeType() {
    const regex = this.newMimeType.regex();
    if (!regex) return;

    const label = this.newMimeType.permission_label();
    const mimeTypes = this.values.mimeTypes();
    mimeTypes[regex] = {
      adapter: this.newMimeType.adapter(),
      template: this.newMimeType.template(),
      ...(label
        ? {
            permission_label: label,
            permission_slug: slugify(label),
          }
        : {}),
    };
    this.values.mimeTypes({ ...mimeTypes });

    this.newMimeType.regex('');
    this.newMimeType.adapter(this.defaultAdap);
    this.newMimeType.template('file');
    this.newMimeType.permission_label('');
    m.redraw();
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
