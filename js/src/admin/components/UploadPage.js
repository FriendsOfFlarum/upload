import app from 'flarum/admin/app';
import Button from 'flarum/common/components/Button';
import saveSettings from 'flarum/admin/utils/saveSettings';
import Alert from 'flarum/common/components/Alert';
import Select from 'flarum/common/components/Select';
import Switch from 'flarum/common/components/Switch';
import UploadImageButton from './UploadImageButton';
import withAttr from 'flarum/common/utils/withAttr';
import Stream from 'flarum/common/utils/Stream';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import ItemList from 'flarum/common/utils/ItemList';
import InspectMimeModal from './InspectMimeModal';
import icon from 'flarum/common/helpers/icon';
import Link from 'flarum/common/components/Link';

/* global m */

export default class UploadPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);
    // whether we are saving the settings or not right now
    this.loading = false;

    // the fields we need to watch and to save
    this.fields = [
      // image
      'resizeMaxWidth',
      'cdnUrl',
      'maxFileSize',
      'whitelistedClientExtensions',
      'composerButtonVisiblity',
      // watermark
      'watermark',
      'watermarkPosition',
      // Imgur
      'imgurClientId',
      // AWS
      'awsS3Key',
      'awsS3Secret',
      'awsS3Bucket',
      'awsS3Region',
      'awsS3Endpoint',
      'awsS3ACL',
      'awsS3CustomUrl',
      // QIniu
      'qiniuKey',
      'qiniuSecret',
      'qiniuBucket',
    ];

    // the checkboxes we need to watch and to save.
    this.checkboxes = ['mustResize', 'addsWatermarks', 'disableHotlinkProtection', 'disableDownloadLogging', 'awsS3UsePathStyleEndpoint'];

    // fields that are objects
    this.objects = ['mimeTypes'];

    // watermark positions
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

    // Composer button options
    this.composerButtonVisiblityOptions = {
      both: app.translator.trans('fof-upload.admin.labels.composer_buttons.options.both'),
      'upload-btn': app.translator.trans('fof-upload.admin.labels.composer_buttons.options.upload-btn'),
      'media-btn': app.translator.trans('fof-upload.admin.labels.composer_buttons.options.media-btn'),
    };

    // get the saved settings from the database
    const settings = app.data.settings;

    // our package prefix (to be added to every field and checkbox in the setting table)
    this.settingsPrefix = 'fof-upload';

    // Options for the Upload methods dropdown menu.
    this.uploadMethodOptions = settings[this.addPrefix('availableUploadMethods')] || {};
    // Options for the Template dropdown menu.
    this.templateOptions = settings[this.addPrefix('availableTemplates')] || {};
    // Contains current values.
    this.values = {};
    // bind the values of the fields and checkboxes to the getter/setter functions
    this.fields.forEach((key) => (this.values[key] = Stream(settings[this.addPrefix(key)])));
    this.checkboxes.forEach((key) => (this.values[key] = Stream(settings[this.addPrefix(key)] === '1')));
    this.objects.forEach((key) => (this.values[key] = settings[this.addPrefix(key)] ? Stream(JSON.parse(settings[this.addPrefix(key)])) : Stream()));

    // Set a sane default in case no mimeTypes have been configured yet.
    // Since 'local' (or others) can now be disabled, pick the last entry in the object for default
    this.defaultAdap = Object.keys(this.uploadMethodOptions)[Object.keys(this.uploadMethodOptions).length - 1];
    this.values.mimeTypes() ||
      (this.values.mimeTypes = Stream({
        '^image\\/(jpeg|png|gif|webp|avif|bmp|tiff|svg\\+xml)$': {
          adapter: this.defaultAdap,
          template: 'image-preview',
        },
      }));

    this.newMimeType = {
      regex: Stream(''),
      adapter: Stream(this.defaultAdap),
      template: Stream('file'),
    };
  }

  /**
   * Show the actual ImageUploadPage.
   *
   * @returns {*}
   */
  content() {
    const max_post = app.data.settings[this.addPrefix('php_ini.post_max_size')];
    const max_upload = app.data.settings[this.addPrefix('php_ini.upload_max_filesize')];
    return [
      m('.UploadPage', [
        m('.container', [
          m(
            'form',
            {
              onsubmit: this.onsubmit.bind(this),
            },
            [
              m('fieldset', [
                m('legend', app.translator.trans('fof-upload.admin.labels.preferences.title')),
                m('label', app.translator.trans('fof-upload.admin.labels.preferences.max_file_size')),
                m('input.FormControl', {
                  value: this.values.maxFileSize(),
                  oninput: withAttr('value', this.values.maxFileSize),
                  type: 'number',
                  min: '0',
                }),
                m(
                  '.helpText',
                  app.translator.trans('fof-upload.admin.labels.preferences.php_ini_values', {
                    post: max_post,
                    upload: max_upload,
                  })
                ),
                m('label', app.translator.trans('fof-upload.admin.labels.preferences.mime_types')),
                m(
                  '.MimeTypes--Container',
                  Object.keys(this.values.mimeTypes()).map((mime) => {
                    let config = this.values.mimeTypes()[mime];
                    // Compatibility for older versions.
                    if (typeof config !== 'object') {
                      config = {
                        adapter: config,
                        template: 'file',
                      };
                    }

                    return m('div', [
                      m('input.FormControl.MimeTypes', {
                        value: mime,
                        oninput: withAttr('value', this.updateMimeTypeKey.bind(this, mime)),
                      }),
                      Select.component({
                        options: this.uploadMethodOptions,
                        onchange: this.updateMimeTypeAdapter.bind(this, mime, config),
                        value: config.adapter || 'local',
                      }),
                      Select.component({
                        options: this.getTemplateOptionsForInput(),
                        onchange: this.updateMimeTypeTemplate.bind(this, mime, config),
                        value: config.template || 'local',
                      }),
                      Button.component(
                        {
                          type: 'button',
                          className: 'Button Button--warning',
                          onclick: this.deleteMimeType.bind(this, mime),
                        },
                        'x'
                      ),
                    ]);
                  }),
                  m('br'),
                  m('div', [
                    m('input.FormControl.MimeTypes.add-MimeType-key', {
                      value: this.newMimeType.regex(),
                      oninput: withAttr('value', this.newMimeType.regex),
                    }),
                    Select.component({
                      options: this.uploadMethodOptions,
                      className: 'add-MimeType-value',
                      oninput: withAttr('value', this.newMimeType.adapter),
                      value: this.newMimeType.adapter(),
                    }),
                    Select.component({
                      options: this.getTemplateOptionsForInput(),
                      className: 'add-MimeType-value',
                      oninput: withAttr('value', this.newMimeType.template),
                      value: this.newMimeType.template(),
                    }),
                    Button.component(
                      {
                        type: 'button',
                        className: 'Button Button--warning',
                        onclick: this.addMimeType.bind(this),
                      },
                      '+'
                    ),
                  ])
                ),
                m('.helpText', app.translator.trans('fof-upload.admin.help_texts.mime_types')),
                Button.component(
                  {
                    className: 'Button',
                    onclick() {
                      app.modal.show(InspectMimeModal);
                    },
                  },
                  app.translator.trans('fof-upload.admin.labels.inspect-mime')
                ),
                m('.helpText', app.translator.trans('fof-upload.admin.help_texts.download_templates')),
                this.templateOptionsDescriptions(),
              ]),
              m('fieldset.composerButtons', [
                m('legend', app.translator.trans('fof-upload.admin.labels.composer_buttons.title')),
                m('.helpText', app.translator.trans('fof-upload.admin.help_texts.composer_buttons')),
                m('div', [
                  Select.component({
                    options: this.composerButtonVisiblityOptions,
                    onchange: this.values.composerButtonVisiblity,
                    value: this.values.composerButtonVisiblity() || 'both',
                  }),
                ]),
              ]),
              m('fieldset', [
                m('legend', app.translator.trans('fof-upload.admin.labels.resize.title')),
                m('.helpText', app.translator.trans('fof-upload.admin.help_texts.resize')),
                Switch.component(
                  {
                    state: this.values.mustResize() || false,
                    onchange: this.values.mustResize,
                  },
                  app.translator.trans('fof-upload.admin.labels.resize.toggle')
                ),
                m('label', app.translator.trans('fof-upload.admin.labels.resize.max_width')),
                m('input', {
                  className: 'FormControl',
                  value: this.values.resizeMaxWidth() || 100,
                  oninput: withAttr('value', this.values.resizeMaxWidth),
                  disabled: !this.values.mustResize(),
                  type: 'number',
                  min: '0',
                }),
              ]),
              m('fieldset', [
                m('legend', app.translator.trans('fof-upload.admin.labels.client_extension.title')),
                m('.helpText', app.translator.trans('fof-upload.admin.help_texts.client_extension')),
                m('input', {
                  className: 'FormControl',
                  value: this.values.whitelistedClientExtensions() || '',
                  oninput: withAttr('value', this.values.whitelistedClientExtensions),
                }),
              ]),
              m('fieldset', [
                m('legend', app.translator.trans('fof-upload.admin.labels.watermark.title')),
                m('.helpText', app.translator.trans('fof-upload.admin.help_texts.watermark')),
                Switch.component(
                  {
                    state: this.values.addsWatermarks() || false,
                    onchange: this.values.addsWatermarks,
                  },
                  app.translator.trans('fof-upload.admin.labels.watermark.toggle')
                ),
                m('label', app.translator.trans('fof-upload.admin.labels.watermark.position')),
                m('div', [
                  Select.component({
                    options: this.watermarkPositions,
                    onchange: this.values.watermarkPosition,
                    value: this.values.watermarkPosition() || 'bottom-right',
                  }),
                ]),
                m('label', {}, app.translator.trans('fof-upload.admin.labels.watermark.file')),
                UploadImageButton.component({
                  name: 'fof-watermark',
                  path: 'fof/watermark',
                }),
              ]),
              m('fieldset', [
                m('legend', app.translator.trans('fof-upload.admin.labels.disable-hotlink-protection.title')),
                m('.helpText', app.translator.trans('fof-upload.admin.help_texts.disable-hotlink-protection')),
                Switch.component(
                  {
                    state: this.values.disableHotlinkProtection() || false,
                    onchange: this.values.disableHotlinkProtection,
                  },
                  app.translator.trans('fof-upload.admin.labels.disable-hotlink-protection.toggle')
                ),
                m('legend', app.translator.trans('fof-upload.admin.labels.disable-download-logging.title')),
                m('.helpText', app.translator.trans('fof-upload.admin.help_texts.disable-download-logging')),
                Switch.component(
                  {
                    state: this.values.disableDownloadLogging() || false,
                    onchange: this.values.disableDownloadLogging,
                  },
                  app.translator.trans('fof-upload.admin.labels.disable-download-logging.toggle')
                ),
              ]),
              m('fieldset', [
                m('legend', app.translator.trans('fof-upload.admin.labels.local.title')),
                m('label', app.translator.trans('fof-upload.admin.labels.local.cdn_url')),
                m('input.FormControl', {
                  value: this.values.cdnUrl() || '',
                  oninput: withAttr('value', this.values.cdnUrl),
                }),
              ]),

              this.adaptorItems().toArray(),

              Button.component(
                {
                  type: 'submit',
                  className: 'Button Button--primary',
                  loading: this.loading,
                  disabled: !this.changed(),
                },
                app.translator.trans('core.admin.settings.submit_button')
              ),
            ]
          ),
        ]),
      ]),
    ];
  }

  adaptorItems() {
    const items = new ItemList();

    if (this.uploadMethodOptions['imgur'] !== undefined) {
      items.add(
        'imgur',
        <div className="imgur">
          <fieldset>
            <legend>{app.translator.trans('fof-upload.admin.labels.imgur.title')}</legend>
            <p>
              {icon('fas fa-exclamation-circle')}{' '}
              {app.translator.trans('fof-upload.admin.labels.imgur.tos', {
                a: <Link href="https://imgur.com/tos" external={true} target="_blank" />,
              })}
            </p>
            <label>{app.translator.trans('fof-upload.admin.labels.imgur.client_id')}</label>
            <input className="FormControl" value={this.values.imgurClientId() || ''} oninput={withAttr('value', this.values.imgurClientId)} />
          </fieldset>
        </div>,
        100
      );
    }

    if (this.uploadMethodOptions['qiniu'] !== undefined) {
      items.add(
        'qiniu',
        m('.qiniu', [
          m('fieldset', [
            m('legend', app.translator.trans('fof-upload.admin.labels.qiniu.title')),
            m('label', app.translator.trans('fof-upload.admin.labels.qiniu.key')),
            m('input.FormControl', {
              value: this.values.qiniuKey() || '',
              oninput: withAttr('value', this.values.qiniuKey),
            }),
            m('label', {}, app.translator.trans('fof-upload.admin.labels.qiniu.secret')),
            m('input.FormControl', {
              value: this.values.qiniuSecret() || '',
              oninput: withAttr('value', this.values.qiniuSecret),
            }),
            m('label', {}, app.translator.trans('fof-upload.admin.labels.qiniu.bucket')),
            m('input.FormControl', {
              value: this.values.qiniuBucket() || '',
              oninput: withAttr('value', this.values.qiniuBucket),
            }),
          ]),
        ]),
        80
      );
    }

    if (this.uploadMethodOptions['aws-s3'] !== undefined) {
      items.add(
        'aws-s3',
        m('.aws', [
          m('fieldset', [
            m('legend', app.translator.trans('fof-upload.admin.labels.aws-s3.title')),
            m('.helpText', app.translator.trans('fof-upload.admin.help_texts.s3_instance_profile')),
            m('label', app.translator.trans('fof-upload.admin.labels.aws-s3.key')),
            m('input.FormControl', {
              value: this.values.awsS3Key() || '',
              oninput: withAttr('value', this.values.awsS3Key),
            }),
            m('label', app.translator.trans('fof-upload.admin.labels.aws-s3.secret')),
            m('input.FormControl', {
              value: this.values.awsS3Secret() || '',
              oninput: withAttr('value', this.values.awsS3Secret),
            }),
            m('label', app.translator.trans('fof-upload.admin.labels.aws-s3.bucket')),
            m('input.FormControl', {
              value: this.values.awsS3Bucket() || '',
              oninput: withAttr('value', this.values.awsS3Bucket),
            }),
            m('label', app.translator.trans('fof-upload.admin.labels.aws-s3.region')),
            m('input.FormControl', {
              value: this.values.awsS3Region() || '',
              oninput: withAttr('value', this.values.awsS3Region),
            }),
          ]),
          m('fieldset', [
            m('legend', app.translator.trans('fof-upload.admin.labels.aws-s3.advanced_title')),
            m('.helpText', app.translator.trans('fof-upload.admin.help_texts.s3_compatible_storage')),
            m('label', app.translator.trans('fof-upload.admin.labels.aws-s3.endpoint')),
            m('input.FormControl', {
              value: this.values.awsS3Endpoint() || '',
              oninput: withAttr('value', this.values.awsS3Endpoint),
            }),
            Switch.component(
              {
                state: this.values.awsS3UsePathStyleEndpoint() || false,
                onchange: this.values.awsS3UsePathStyleEndpoint,
              },
              app.translator.trans('fof-upload.admin.labels.aws-s3.use_path_style_endpoint')
            ),
            m('label', app.translator.trans('fof-upload.admin.labels.aws-s3.acl')),
            m('input.FormControl', {
              value: this.values.awsS3ACL() || '',
              oninput: withAttr('value', this.values.awsS3ACL),
            }),
            m('.helpText', app.translator.trans('fof-upload.admin.help_texts.s3_acl')),
            m('label', app.translator.trans('fof-upload.admin.labels.aws-s3.custom_url')),
            m('input.FormControl', {
              value: this.values.awsS3CustomUrl() || '',
              oninput: withAttr('value', this.values.awsS3CustomUrl),
            }),
            m('.helpText', app.translator.trans('fof-upload.admin.help_texts.custom_s3_url')),
          ]),
        ]),
        60
      );
    }

    return items;
  }

  getTemplateOptionsForInput() {
    const options = {};

    for (let option in this.templateOptions) {
      if (!this.templateOptions.hasOwnProperty(option)) {
        continue;
      }

      options[option] = this.templateOptions[option].name;
    }

    return options;
  }

  updateMimeTypeKey(mime, value) {
    this.values.mimeTypes()[value] = this.values.mimeTypes()[mime];

    this.deleteMimeType(mime);
  }

  updateMimeTypeAdapter(mime, config, value) {
    config.adapter = value;
    this.values.mimeTypes()[mime] = config;
  }

  updateMimeTypeTemplate(mime, config, value) {
    config.template = value;
    this.values.mimeTypes()[mime] = config;
  }

  deleteMimeType(mime) {
    delete this.values.mimeTypes()[mime];
  }

  templateOptionsDescriptions() {
    const children = [];

    for (let template in this.templateOptions) {
      if (!this.templateOptions.hasOwnProperty(template)) {
        continue;
      }

      children.push(
        <li>
          {this.templateOptions[template].name}: {m.trust(this.templateOptions[template].description)}
        </li>
      );
    }

    return m('ul', children);
  }

  addMimeType() {
    this.values.mimeTypes()[this.newMimeType.regex()] = {
      adapter: this.newMimeType.adapter(),
      template: this.newMimeType.template(),
    };

    this.newMimeType.regex('');
    this.newMimeType.adapter('local');
    this.newMimeType.template('file');
  }

  /**
   * Checks if the values of the fields and checkboxes are different from
   * the ones stored in the database
   *
   * @returns boolean
   */
  changed() {
    const fieldsCheck = this.fields.some((key) => this.values[key]() !== app.data.settings[this.addPrefix(key)]);
    const checkboxesCheck = this.checkboxes.some((key) => this.values[key]() !== (app.data.settings[this.addPrefix(key)] === '1'));
    const objectsCheck = this.objects.some((key) => JSON.stringify(this.values[key]()) !== app.data.settings[this.addPrefix(key)]);

    return fieldsCheck || checkboxesCheck || objectsCheck;
  }

  /**
   * Saves the settings to the database and redraw the page
   *
   * @param e
   */
  onsubmit(e) {
    // prevent the usual form submit behaviour
    e.preventDefault();

    // if the page is already saving, do nothing
    if (this.loading) return;

    // prevents multiple savings
    this.loading = true;

    // remove previous success popup
    app.alerts.dismiss(this.successAlert);

    const settings = {};

    // gets all the values from the form
    this.fields.forEach((key) => (settings[this.addPrefix(key)] = this.values[key]()));
    this.checkboxes.forEach((key) => (settings[this.addPrefix(key)] = this.values[key]()));
    this.objects.forEach((key) => (settings[this.addPrefix(key)] = JSON.stringify(this.values[key]())));

    // actually saves everything in the database
    saveSettings(settings)
      .then(() => {
        // on success, show popup
        this.successAlert = app.alerts.show(Alert, { type: 'success' }, app.translator.trans('core.admin.settings.saved_message'));
      })
      .catch(() => {})
      .then(() => {
        // return to the initial state and redraw the page
        this.loading = false;
        m.redraw();
      });
  }

  /**
   * Adds the prefix `this.settingsPrefix` at the beginning of `key`
   *
   * @returns string
   */
  addPrefix(key) {
    return this.settingsPrefix + '.' + key;
  }
}
