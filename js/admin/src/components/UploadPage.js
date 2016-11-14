import Component from "flarum/Component";
import Button from "flarum/components/Button";
import saveSettings from "flarum/utils/saveSettings";
import Alert from "flarum/components/Alert";
import Select from "flarum/components/Select";
import Switch from "flarum/components/Switch";
import UploadImageButton from "flarum/components/UploadImageButton";

export default class UploadPage extends Component {

    init() {
        // whether we are saving the settings or not right now
        this.loading = false;

        // the fields we need to watch and to save
        this.fields = [
            'availableUploadMethods',
            'mimeTypesAllowed',
            'uploadMethod',
            // image
            'resizeMaxWidth',
            'cdnUrl',
            'maxFileSize',
            'overrideAvatarUpload',
            // watermark
            'addsWatermarks',
            'watermark',
            'watermarkPosition',
            // Imgur
            'imgurClientId',
            // AWS
            'awsS3Key',
            'awsS3Secret',
            'awsS3Bucket',
            'awsS3Region',
        ];

        // the checkboxes we need to watch and to save.
        this.checkboxes = [
            'mustResize',
            'overrideAvatarUpload'
        ];

        // watermark positions
        this.watermarkPositions = {
            'top-right': 'top-left',
            'top-right': 'top-right',
            'bottom-left': 'bottom-left',
            'bottom-right': 'bottom-right',
            'center': 'center',
            'left': 'left',
            'top': 'top',
            'right': 'right',
            'bottom': 'bottom'
        };

        // options for the dropdown menu
        this.uploadMethodOptions = {};

        this.values = {};

        // our package prefix (to be added to every field and checkbox in the setting table)
        this.settingsPrefix = 'flagrow.upload';

        // get the saved settings from the database
        const settings = app.data.settings;

        // set the upload methods
        this.uploadMethodOptions = settings[this.addPrefix('availableUploadMethods')];
        // bind the values of the fields and checkboxes to the getter/setter functions
        this.fields.forEach(key => this.values[key] = m.prop(settings[this.addPrefix(key)]));
        this.checkboxes.forEach(key => this.values[key] = m.prop(settings[this.addPrefix(key)] === '1'));
    }

    /**
     * Show the actual ImageUploadPage.
     *
     * @returns {*}
     */
    view() {
        return [
            m('div', {className: 'UploadPage'}, [
                m('div', {className: 'container'}, [
                    m('form', {onsubmit: this.onsubmit.bind(this)}, [
                        m('fieldset', {}, [
                            m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.upload_method')),
                            m('div', {className: 'helpText'}, app.translator.trans('flagrow-upload.admin.help_texts.upload_method')),
                            m('div', {}, [
                                Select.component({
                                    options: this.uploadMethodOptions,
                                    onchange: this.values.uploadMethod,
                                    value: this.values.uploadMethod() || 'local'
                                }),
                            ]),
                            // m('div', {className: 'helpText'}, app.translator.trans('flagrow-upload.admin.help_texts.override_avatar_upload')),
                            // Switch.component({
                            //     state: this.values.overrideAvatarUpload() || false,
                            //     children: app.translator.trans('flagrow-upload.admin.labels.override_avatar_upload'),
                            //     onchange: this.values.overrideAvatarUpload
                            // }),
                        ]),
                        m('fieldset', {className: 'UploadPage-preferences'}, [
                            m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.title')),
                            m('label', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.max_file_size')),
                            m('input', {
                                className: 'FormControl',
                                value: this.values.maxFileSize() || 2048,
                                oninput: m.withAttr('value', this.values.maxFileSize)
                            }),
                            m('label', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.mime_types_allowed')),
                            m('input', {
                                className: 'FormControl',
                                value: this.values.mimeTypesAllowed() || "(image|audio|video)\\/.*",
                                oninput: m.withAttr('value', this.values.mimeTypesAllowed)
                            }),
                        ]),
                        m('fieldset', {className: 'UploadPage-resize'}, [
                            m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.resize.title')),
                            m('div', {className: 'helpText'}, app.translator.trans('flagrow-upload.admin.help_texts.resize')),
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
                        m('fieldset', {className: 'UploadPage-watermark'}, [
                            m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.watermark.title')),
                            m('div', {className: 'helpText'}, app.translator.trans('flagrow-upload.admin.help_texts.watermark')),
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
                            <UploadImageButton name="flagrow/watermark"/>
                        ]),
                        m('fieldset', {
                            className: 'UploadPage-local',
                            style: {display: (this.values.uploadMethod() === 'local' ? "block" : "none")}
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
                            style: {display: (this.values.uploadMethod() === 'imgur' ? "block" : "none")}
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
                            style: {display: (this.values.uploadMethod() === 'aws-s3' ? "block" : "none")}
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

    /**
     * Checks if the values of the fields and checkboxes are different from
     * the ones stored in the database
     *
     * @returns bool
     */
    changed() {
        var fieldsCheck = this.fields.some(key => this.values[key]() !== app.data.settings[this.addPrefix(key)]);
        var checkboxesCheck = this.checkboxes.some(key => this.values[key]() !== (app.data.settings[this.addPrefix(key)] == '1'));
        return fieldsCheck || checkboxesCheck;
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
        app.alerts.dismiss(this.successAlert);

        const settings = {};

        // gets all the values from the form
        this.fields.forEach(key => settings[this.addPrefix(key)] = this.values[key]());
        this.checkboxes.forEach(key => settings[this.addPrefix(key)] = this.values[key]());

        // actually saves everything in the database
        saveSettings(settings)
            .then(() => {
                // on succes, show an alert
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
