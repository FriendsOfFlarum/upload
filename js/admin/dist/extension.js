"use strict";

System.register("flagrow/upload/addUploadPane", ["flarum/extend", "flarum/components/AdminNav", "flarum/components/AdminLinkButton", "flagrow/upload/components/UploadPage"], function (_export, _context) {
    "use strict";

    var extend, AdminNav, AdminLinkButton, UploadPage;

    _export("default", function () {
        // create the route
        app.routes['flagrow-upload'] = { path: '/flagrow/upload', component: UploadPage.component() };

        // bind the route we created to the three dots settings button
        app.extensionSettings['flagrow-upload'] = function () {
            return m.route(app.route('flagrow-upload'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            // add the Image Upload tab to the admin navigation menu
            items.add('flagrow-upload', AdminLinkButton.component({
                href: app.route('flagrow-upload'),
                icon: 'file-o',
                children: 'File Upload',
                description: app.translator.trans('flagrow-upload.admin.help_texts.description')
            }));
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav.default;
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton.default;
        }, function (_flagrowUploadComponentsUploadPage) {
            UploadPage = _flagrowUploadComponentsUploadPage.default;
        }],
        execute: function () {}
    };
});;
"use strict";

System.register("flagrow/upload/components/UploadPage", ["flarum/Component", "flarum/components/Button", "flarum/utils/saveSettings", "flarum/components/Alert", "flarum/components/Select", "flarum/components/Switch", "flarum/components/UploadImageButton"], function (_export, _context) {
    "use strict";

    var Component, Button, saveSettings, Alert, Select, Switch, UploadImageButton, UploadPage;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumUtilsSaveSettings) {
            saveSettings = _flarumUtilsSaveSettings.default;
        }, function (_flarumComponentsAlert) {
            Alert = _flarumComponentsAlert.default;
        }, function (_flarumComponentsSelect) {
            Select = _flarumComponentsSelect.default;
        }, function (_flarumComponentsSwitch) {
            Switch = _flarumComponentsSwitch.default;
        }, function (_flarumComponentsUploadImageButton) {
            UploadImageButton = _flarumComponentsUploadImageButton.default;
        }],
        execute: function () {
            UploadPage = function (_Component) {
                babelHelpers.inherits(UploadPage, _Component);

                function UploadPage() {
                    babelHelpers.classCallCheck(this, UploadPage);
                    return babelHelpers.possibleConstructorReturn(this, (UploadPage.__proto__ || Object.getPrototypeOf(UploadPage)).apply(this, arguments));
                }

                babelHelpers.createClass(UploadPage, [{
                    key: "init",
                    value: function init() {
                        var _watermarkPositions,
                            _this2 = this;

                        // whether we are saving the settings or not right now
                        this.loading = false;

                        // the fields we need to watch and to save
                        this.fields = ['availableUploadMethods', 'mimeTypesAllowed', 'uploadMethod',
                            // image
                            'resizeMaxWidth', 'cdnUrl', 'maxFileSize', 'overrideAvatarUpload',
                            // watermark
                            'addsWatermarks', 'watermark', 'watermarkPosition',
                        // Imgur
                        'imgurClientId',
                        // AWS
                        'awsS3Key', 'awsS3Secret', 'awsS3Bucket', 'awsS3Region'];

                        // the checkboxes we need to watch and to save.
                        this.checkboxes = ['mustResize', 'overrideAvatarUpload'];

                        // watermark positions
                        this.watermarkPositions = (_watermarkPositions = {
                            'top-right': 'top-left'
                        }, babelHelpers.defineProperty(_watermarkPositions, "top-right", 'top-right'), babelHelpers.defineProperty(_watermarkPositions, 'bottom-left', 'bottom-left'), babelHelpers.defineProperty(_watermarkPositions, 'bottom-right', 'bottom-right'), babelHelpers.defineProperty(_watermarkPositions, 'center', 'center'), babelHelpers.defineProperty(_watermarkPositions, 'left', 'left'), babelHelpers.defineProperty(_watermarkPositions, 'top', 'top'), babelHelpers.defineProperty(_watermarkPositions, 'right', 'right'), babelHelpers.defineProperty(_watermarkPositions, 'bottom', 'bottom'), _watermarkPositions);

                        // options for the dropdown menu
                        this.uploadMethodOptions = {};

                        this.values = {};

                        // our package prefix (to be added to every field and checkbox in the setting table)
                        this.settingsPrefix = 'flagrow.upload';

                        // get the saved settings from the database
                        var settings = app.data.settings;

                        // set the upload methods
                        this.uploadMethodOptions = settings[this.addPrefix('availableUploadMethods')];
                        // bind the values of the fields and checkboxes to the getter/setter functions
                        this.fields.forEach(function (key) {
                            return _this2.values[key] = m.prop(settings[_this2.addPrefix(key)]);
                        });
                        this.checkboxes.forEach(function (key) {
                            return _this2.values[key] = m.prop(settings[_this2.addPrefix(key)] === '1');
                        });
                    }
                }, {
                    key: "view",
                    value: function view() {
                        return [m('div', {className: 'UploadPage'}, [m('div', {className: 'container'}, [m('form', {onsubmit: this.onsubmit.bind(this)}, [m('fieldset', {}, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.upload_method')), m('div', {className: 'helpText'}, app.translator.trans('flagrow-upload.admin.help_texts.upload_method')), m('div', {}, [Select.component({
                            options: this.uploadMethodOptions,
                            onchange: this.values.uploadMethod,
                            value: this.values.uploadMethod() || 'local'
                        })])]), m('fieldset', {className: 'UploadPage-preferences'}, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.title')), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.max_file_size')), m('input', {
                            className: 'FormControl',
                            value: this.values.maxFileSize() || 2048,
                            oninput: m.withAttr('value', this.values.maxFileSize)
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.mime_types_allowed')), m('input', {
                            className: 'FormControl',
                            value: this.values.mimeTypesAllowed() || "(image|audio|video)\\/.*",
                            oninput: m.withAttr('value', this.values.mimeTypesAllowed)
                        })]), m('fieldset', {className: 'UploadPage-resize'}, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.resize.title')), m('div', {className: 'helpText'}, app.translator.trans('flagrow-upload.admin.help_texts.resize')), Switch.component({
                            state: this.values.mustResize() || false,
                            children: app.translator.trans('flagrow-upload.admin.labels.resize.toggle'),
                            onchange: this.values.mustResize
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.resize.max_width')), m('input', {
                            className: 'FormControl',
                            value: this.values.resizeMaxWidth() || 100,
                            oninput: m.withAttr('value', this.values.resizeMaxWidth),
                            disabled: !this.values.mustResize()
                        })]), m('fieldset', {className: 'UploadPage-watermark'}, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.watermark.title')), m('div', {className: 'helpText'}, app.translator.trans('flagrow-upload.admin.help_texts.watermark')), Switch.component({
                            state: this.values.addsWatermarks() || false,
                            children: app.translator.trans('flagrow-upload.admin.labels.watermark.toggle'),
                            onchange: this.values.addsWatermarks
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.watermark.position')), m('div', {}, [Select.component({
                            options: this.watermarkPositions,
                            onchange: this.values.watermarkPosition,
                            value: this.values.watermarkPosition() || 'bottom-right'
                        })]), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.watermark.file')), m(UploadImageButton, {name: "flagrow/watermark"})]), m('fieldset', {
                            className: 'UploadPage-local',
                            style: { display: this.values.uploadMethod() === 'local' ? "block" : "none" }
                        }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.local.title')), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.local.cdn_url')), m('input', {
                            className: 'FormControl',
                            value: this.values.cdnUrl() || '',
                            oninput: m.withAttr('value', this.values.cdnUrl)
                        })]), m('fieldset', {
                            className: 'UploadPage-imgur',
                            style: { display: this.values.uploadMethod() === 'imgur' ? "block" : "none" }
                        }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.imgur.title')), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.imgur.client_id')), m('input', {
                            className: 'FormControl',
                            value: this.values.imgurClientId() || '',
                            oninput: m.withAttr('value', this.values.imgurClientId)
                        })]), m('fieldset', {
                            className: 'UploadPage-aws-s3',
                            style: { display: this.values.uploadMethod() === 'aws-s3' ? "block" : "none" }
                        }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.title')), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.key')), m('input', {
                            className: 'FormControl',
                            value: this.values.awsS3Key() || '',
                            oninput: m.withAttr('value', this.values.awsS3Key)
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.secret')), m('input', {
                            className: 'FormControl',
                            value: this.values.awsS3Secret() || '',
                            oninput: m.withAttr('value', this.values.awsS3Secret)
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.bucket')), m('input', {
                            className: 'FormControl',
                            value: this.values.awsS3Bucket() || '',
                            oninput: m.withAttr('value', this.values.awsS3Bucket)
                        }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.aws-s3.region')), m('input', {
                            className: 'FormControl',
                            value: this.values.awsS3Region() || '',
                            oninput: m.withAttr('value', this.values.awsS3Region)
                        })]), Button.component({
                            type: 'submit',
                            className: 'Button Button--primary',
                            children: app.translator.trans('flagrow-upload.admin.buttons.save'),
                            loading: this.loading,
                            disabled: !this.changed()
                        })])])])];
                    }
                }, {
                    key: "changed",
                    value: function changed() {
                        var _this3 = this;

                        var fieldsCheck = this.fields.some(function (key) {
                            return _this3.values[key]() !== app.data.settings[_this3.addPrefix(key)];
                        });
                        var checkboxesCheck = this.checkboxes.some(function (key) {
                            return _this3.values[key]() !== (app.data.settings[_this3.addPrefix(key)] == '1');
                        });
                        return fieldsCheck || checkboxesCheck;
                    }
                }, {
                    key: "onsubmit",
                    value: function onsubmit(e) {
                        var _this4 = this;

                        // prevent the usual form submit behaviour
                        e.preventDefault();

                        // if the page is already saving, do nothing
                        if (this.loading) return;

                        // prevents multiple savings
                        this.loading = true;
                        app.alerts.dismiss(this.successAlert);

                        var settings = {};

                        // gets all the values from the form
                        this.fields.forEach(function (key) {
                            return settings[_this4.addPrefix(key)] = _this4.values[key]();
                        });
                        this.checkboxes.forEach(function (key) {
                            return settings[_this4.addPrefix(key)] = _this4.values[key]();
                        });

                        // actually saves everything in the database
                        saveSettings(settings).then(function () {
                            // on succes, show an alert
                            app.alerts.show(_this4.successAlert = new Alert({
                                type: 'success',
                                children: app.translator.trans('core.admin.basics.saved_message')
                            }));
                        }).catch(function () {}).then(function () {
                            // return to the initial state and redraw the page
                            _this4.loading = false;
                            m.redraw();
                        });
                    }
                }, {
                    key: "addPrefix",
                    value: function addPrefix(key) {
                        return this.settingsPrefix + '.' + key;
                    }
                }]);
                return UploadPage;
            }(Component);

            _export("default", UploadPage);
        }
    };
});;
"use strict";

System.register("flagrow/upload/main", ["flarum/extend", "flarum/app", "flarum/components/PermissionGrid", "flagrow/upload/addUploadPane"], function (_export, _context) {
    "use strict";

    var extend, app, PermissionGrid, addUploadPane;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }, function (_flagrowUploadAddUploadPane) {
            addUploadPane = _flagrowUploadAddUploadPane.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-upload', function (app) {
                // add the admin pane
                addUploadPane();

                // add the permission option to the relative pane
                extend(PermissionGrid.prototype, 'startItems', function (items) {
                    items.add('upload', {
                        icon: 'file-o',
                        label: app.translator.trans('flagrow-upload.admin.permissions.upload_label'),
                        permission: 'flagrow.upload'
                    });
                });
            });
        }
    };
});
