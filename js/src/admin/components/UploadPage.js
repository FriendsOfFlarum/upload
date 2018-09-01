import Component from 'flarum/Component';
import Button from 'flarum/components/Button';
import saveSettings from 'flarum/utils/saveSettings';
import Alert from 'flarum/components/Alert';
import Select from 'flarum/components/Select';
import Switch from 'flarum/components/Switch';
import UploadImageButton from 'flarum/components/UploadImageButton';

export default class UploadPage extends Component {

  init() {
    // whether we are saving the settings or not right now
    this.loading = false;

    // the fields we need to watch and to save
    this.fields = [
      // image
      'resizeMaxWidth',
      'cdnUrl',
      'maxFileSize',
      'overrideAvatarUpload',
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
      // OVH
      'ovhUsername',
      'ovhPassword',
      'ovhTenantId',
      'ovhContainer',
      'ovhRegion',
    ];

    // the checkboxes we need to watch and to save.
    this.checkboxes = [
      'mustResize',
      'overrideAvatarUpload',
      'addsWatermarks',

      'disableHotlinkProtection',
      'disableDownloadLogging',
    ];

    // fields that are objects
    this.objects = [
      'mimeTypes'
    ];

    // watermark positions
    this.watermarkPositions = {
      'top-left': 'top-left',
      'top-right': 'top-right',
      'bottom-left': 'bottom-left',
      'bottom-right': 'bottom-right',
      'center': 'center',
      'left': 'left',
      'top': 'top',
      'right': 'right',
      'bottom': 'bottom'
    };

    // get the saved settings from the database
    const settings = app.data.settings;

    // our package prefix (to be added to every field and checkbox in the setting table)
    this.settingsPrefix = 'flagrow.upload';

    // Options for the Upload methods dropdown menu.
    this.uploadMethodOptions = settings[this.addPrefix('availableUploadMethods')] || {};
    // Options for the Template dropdown menu.
    this.templateOptions = settings[this.addPrefix('availableTemplates')] || {};

    // Contains current values.
    this.values = {};
    // bind the values of the fields and checkboxes to the getter/setter functions
    this.fields.forEach(key =>
      this.values[key] = m.prop(settings[this.addPrefix(key)])
    );
    this.checkboxes.forEach(key =>
      this.values[key] = m.prop(settings[this.addPrefix(key)] === '1')
    );
    this.objects.forEach(key =>
      this.values[key] = settings[this.addPrefix(key)] ? m.prop(JSON.parse(settings[this.addPrefix(
        key)])) : m.prop()
    );

    // Set a sane default in case no mimeTypes have been configured yet.
    this.values.mimeTypes() || (this.values.mimeTypes = m.prop({
      '^image\\/.*': {
        adapter: 'local',
        template: 'image-preview'
      }
    }));

    this.newMimeType = {
      regex: m.prop(''),
      adapter: m.prop('local'),
      template: m.prop('file')
    };
  }

  /**
   * Show the actual ImageUploadPage.
   *
   * @returns {*}
   */
  view() {
    return [
      m('div', { className: 'UploadPage' }, [
        m('div', { className: 'container' }, [
          m('form', { onsubmit: this.onsubmit.bind(this) }, [
            m('fieldset', { className: 'UploadPage-preferences' }, [
              m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.title')),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.max_file_size')),
              m('input', {
                className: 'FormControl',
                value: this.values.maxFileSize() || 2048,
                oninput: m.withAttr('value', this.values.maxFileSize)
              }),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.mime_types')),
              m('div', { className: 'MimeTypes--Container' },
                Object.keys(this.values.mimeTypes())
                  .map(mime => {
                    let config = this.values.mimeTypes()[mime];
                    // Compatibility for older versions.
                    if (typeof config !== 'object') {
                      config = {
                        adapter: config,
                        template: 'file'
                      };
                    }

                    return m('div', {}, [
                      m('input', {
                        className: 'FormControl MimeTypes',
                        value: mime,
                        oninput: m.withAttr('value', this.updateMimeTypeKey.bind(this, mime))
                      }),
                      Select.component({
                        options: this.uploadMethodOptions,
                        onchange: this.updateMimeTypeAdapter.bind(this, mime, config),
                        value: config.adapter || 'local'
                      }),
                      Select.component({
                        options: this.getTemplateOptionsForInput(),
                        onchange: this.updateMimeTypeTemplate.bind(this, mime, config),
                        value: config.template || 'local'
                      }),
                      Button.component({
                        type: 'button',
                        className: 'Button Button--warning',
                        children: 'x',
                        onclick: this.deleteMimeType.bind(this, mime)
                      }),
                    ]);
                  }),
                m('br'),
                m('div', {}, [
                  m('input', {
                    className: 'FormControl MimeTypes add-MimeType-key',
                    value: this.newMimeType.regex(),
                    oninput: m.withAttr('value', this.newMimeType.regex)
                  }),
                  Select.component({
                    options: this.uploadMethodOptions,
                    className: 'add-MimeType-value',
                    oninput: m.withAttr('value', this.newMimeType.adapter),
                    value: this.newMimeType.adapter()
                  }),
                  Select.component({
                    options: this.getTemplateOptionsForInput(),
                    className: 'add-MimeType-value',
                    oninput: m.withAttr('value', this.newMimeType.template),
                    value: this.newMimeType.template()
                  }),
                  Button.component({
                    type: 'button',
                    className: 'Button Button--warning',
                    children: '+',
                    onclick: this.addMimeType.bind(this)
                  }),
                ])
              ),
              m('div', { className: 'helpText' }, app.translator.trans('flagrow-upload.admin.help_texts.mime_types')),
              m('div', { className: 'helpText' }, app.translator.trans('flagrow-upload.admin.help_texts.download_templates')),
              this.templateOptionsDescriptions()
            ]),
            m('fieldset', { className: 'UploadPage-resize' }, [
              m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.resize.title')),
              m('div', { className: 'helpText' }, app.translator.trans('flagrow-upload.admin.help_texts.resize')),
              Switch.component({
                state: this.values.mustResize() || false,
                children: app.translator.trans('flagrow-upload.admin.labels.resize.toggle'),
                onchange: this.values.mustResize
              }),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.resize.max_width')),
              m('input', {
                className: 'FormControl',
                value: this.values.resizeMaxWidth() || 100,
                oninput: m.withAttr('value', this.values.resizeMaxWidth),
                disabled: !this.values.mustResize()
              }),
            ]),
            m('fieldset', { className: 'UploadPage-watermark' }, [
              m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.watermark.title')),
              m('div', { className: 'helpText' }, app.translator.trans('flagrow-upload.admin.help_texts.watermark')),
              Switch.component({
                state: this.values.addsWatermarks() || false,
                children: app.translator.trans('flagrow-upload.admin.labels.watermark.toggle'),
                onchange: this.values.addsWatermarks
              }),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.watermark.position')),
              m('div', {}, [
                Select.component({
                  options: this.watermarkPositions,
                  onchange: this.values.watermarkPosition,
                  value: this.values.watermarkPosition() || 'bottom-right'
                }),
              ]),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.watermark.file')),
              <UploadImageButton name="flagrow/watermark" />
            ]),
            m('fieldset', { className: 'UploadPage-downloading' }, [
              m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.disable-hotlink-protection.title')),
              m('div',
                { className: 'helpText' },
                app.translator.trans('flagrow-upload.admin.help_texts.disable-hotlink-protection')),
              Switch.component({
                state: this.values.disableHotlinkProtection() || false,
                children: app.translator.trans(
                  'flagrow-upload.admin.labels.disable-hotlink-protection.toggle'),
                onchange: this.values.disableHotlinkProtection
              }),
              m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.disable-download-logging.title')),
              m('div',
                { className: 'helpText' },
                app.translator.trans('flagrow-upload.admin.help_texts.disable-download-logging')),
              Switch.component({
                state: this.values.disableDownloadLogging() || false,
                children: app.translator.trans(
                  'flagrow-upload.admin.labels.disable-download-logging.toggle'),
                onchange: this.values.disableDownloadLogging
              }),
            ]),
            m('fieldset', {
              className: 'UploadPage-local',
            }, [
              m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.local.title')),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.local.cdn_url')),
              m('input', {
                className: 'FormControl',
                value: this.values.cdnUrl() || '',
                oninput: m.withAttr('value', this.values.cdnUrl)
              }),
            ]),
            m('fieldset', {
              className: 'UploadPage-imgur',
            }, [
              m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.imgur.title')),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.imgur.client_id')),
              m('input', {
                className: 'FormControl',
                value: this.values.imgurClientId() || '',
                oninput: m.withAttr('value', this.values.imgurClientId)
              }),
            ]),
            m('fieldset', {
              className: 'UploadPage-aws-s3',
            }, [
              m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.title')),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.key')),
              m('input', {
                className: 'FormControl',
                value: this.values.awsS3Key() || '',
                oninput: m.withAttr('value', this.values.awsS3Key)
              }),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.secret')),
              m('input', {
                className: 'FormControl',
                value: this.values.awsS3Secret() || '',
                oninput: m.withAttr('value', this.values.awsS3Secret)
              }),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.bucket')),
              m('input', {
                className: 'FormControl',
                value: this.values.awsS3Bucket() || '',
                oninput: m.withAttr('value', this.values.awsS3Bucket)
              }),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.region')),
              m('input', {
                className: 'FormControl',
                value: this.values.awsS3Region() || '',
                oninput: m.withAttr('value', this.values.awsS3Region)
              }),
            ]),
            m('fieldset', {
              className: 'UploadPage-ovh-svfs'
            }, [
              m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.title')),
              m('label',
                {},
                app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.container')),
              m('input', {
                className: 'FormControl',
                value: this.values.ovhContainer() || '',
                oninput: m.withAttr('value', this.values.ovhContainer)
              }),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.tenantid')),
              m('input', {
                className: 'FormControl',
                value: this.values.ovhTenantId() || '',
                oninput: m.withAttr('value', this.values.ovhTenantId)
              }),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.username')),
              m('input', {
                className: 'FormControl',
                value: this.values.ovhUsername() || '',
                oninput: m.withAttr('value', this.values.ovhUsername)
              }),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.password')),
              m('input', {
                className: 'FormControl',
                value: this.values.ovhPassword() || '',
                oninput: m.withAttr('value', this.values.ovhPassword)
              }),
              m('label', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.region')),
              m('input', {
                className: 'FormControl',
                value: this.values.ovhRegion() || '',
                oninput: m.withAttr('value', this.values.ovhRegion)
              }),
            ]),
            Button.component({
              type: 'submit',
              className: 'Button Button--primary',
              children: app.translator.trans('flagrow-upload.admin.buttons.save'),
              loading: this.loading,
              disabled: !this.changed()
            }),
          ])
        ])
      ])
    ];
  }

  getTemplateOptionsForInput() {
    let options = [];

    for (let option in this.templateOptions) {
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
      children.push(m('li', this.templateOptions[template].name + ": " + this.templateOptions[template].description));
    }

    return m('ul', children);
  }

  addMimeType() {
    this.values.mimeTypes()[this.newMimeType.regex()] = {
      adapter: this.newMimeType.adapter(),
      template: this.newMimeType.template()
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
    var fieldsCheck = this.fields.some(
      key => this.values[key]() !== app.data.settings[this.addPrefix(key)]);
    var checkboxesCheck = this.checkboxes.some(
      key => this.values[key]() !== (app.data.settings[this.addPrefix(key)] == '1'));
    var objectsCheck = this.objects.some(
      key => JSON.stringify(this.values[key]()) !== (app.data.settings[this.addPrefix(key)]));
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
    this.fields.forEach(key => settings[this.addPrefix(key)] = this.values[key]());
    this.checkboxes.forEach(key => settings[this.addPrefix(key)] = this.values[key]());
    this.objects.forEach(key => settings[this.addPrefix(key)] = JSON.stringify(this.values[key]()));

    // actually saves everything in the database
    saveSettings(settings)
      .then(() => {
        // on success, show popup
        app.alerts.show(this.successAlert = new Alert({
          type: 'success',
          children: app.translator.trans('core.admin.basics.saved_message')
        }));
      })
      .catch(() => {
      })
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
