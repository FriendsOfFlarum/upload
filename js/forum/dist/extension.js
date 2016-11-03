"use strict";

System.register("flagrow/upload/components/UploadButton", ["flarum/Component", "flarum/helpers/icon", "flarum/components/LoadingIndicator"], function (_export, _context) {
    "use strict";

    var Component, icon, LoadingIndicator, UploadButton;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumComponentsLoadingIndicator) {
            LoadingIndicator = _flarumComponentsLoadingIndicator.default;
        }],
        execute: function () {
            UploadButton = function (_Component) {
                babelHelpers.inherits(UploadButton, _Component);

                function UploadButton() {
                    babelHelpers.classCallCheck(this, UploadButton);
                    return babelHelpers.possibleConstructorReturn(this, (UploadButton.__proto__ || Object.getPrototypeOf(UploadButton)).apply(this, arguments));
                }

                babelHelpers.createClass(UploadButton, [{
                    key: "init",
                    value: function init() {
                        // the service type handling uploads
                        this.textAreaObj = null;

                        // initial state of the button
                        this.loading = false;
                    }
                }, {
                    key: "view",
                    value: function view() {
                        return m('div', {className: 'Button hasIcon flagrow-upload-button Button--icon'}, [this.loading ? LoadingIndicator.component({className: 'Button-icon'}) : icon('file-o', {className: 'Button-icon'}), m('span', {className: 'Button-label'}, this.loading ? app.translator.trans('flagrow-upload.forum.states.loading') : app.translator.trans('flagrow-upload.forum.buttons.attach')), m('form#flagrow-upload-form', [m('input', {
                            type: 'file',
                            name: 'flagrow-upload-input',
                            onchange: this.process.bind(this)
                        })])]);
                    }
                }, {
                    key: "process",
                    value: function process(e) {
                        // get the file from the input field
                        var data = new FormData();
                        data.append('file', $(e.target)[0].files[0]);

                        // set the button in the loading state (and redraw the element!)
                        this.loading = true;
                        m.redraw();

                        // send a POST request to the api
                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/flagrow/upload?discussion=' + app.current.discussion.id(),
                            serialize: function serialize(raw) {
                                return raw;
                            },
                            data: data
                        }).then(this.success.bind(this), this.failure.bind(this));
                    }
                }, {
                    key: "failure",
                    value: function failure(message) {
                    }
                    // todo show popup


                    /**
                     * Appends the file's link to the body of the composer.
                     *
                     * @param file
                     */

                }, {
                    key: "success",
                    value: function success(file) {
                        var _this2 = this;

                        console.log(file);

                        // create a markdown string that holds the image link
                        // var markdownString = '\n![image ' + link + '](' + link + ')\n';
                        var markdownString = '\n![' + file.data.attributes.base_name + '](' + file.data.attributes.url + ')\n';

                        // place the Markdown image link in the Composer
                        this.textAreaObj.insertAtCursor(markdownString);

                        // if we are not starting a new discussion, the variable is defined
                        if (typeof this.textAreaObj.props.preview !== 'undefined') {
                            // show what we just uploaded
                            this.textAreaObj.props.preview();
                        }

                        // reset the button for a new upload
                        setTimeout(function () {
                            document.getElementById("flagrow-upload-form").reset();
                            _this2.loading = false;
                        }, 1000);
                    }
                }]);
                return UploadButton;
            }(Component);

            _export("default", UploadButton);
        }
    };
});
;
"use strict";

System.register("flagrow/upload/main", ["flarum/extend", "flarum/components/TextEditor", "flagrow/upload/components/UploadButton"], function (_export, _context) {
    "use strict";

    var extend, TextEditor, UploadButton;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsTextEditor) {
            TextEditor = _flarumComponentsTextEditor.default;
        }, function (_flagrowUploadComponentsUploadButton) {
            UploadButton = _flagrowUploadComponentsUploadButton.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-upload', function (app) {
                extend(TextEditor.prototype, 'controlItems', function (items) {
                    // check whether the user can upload images. If not, returns.
                    if (!app.forum.attribute('canUpload')) return;

                    // create and add the button
                    var uploadButton = new UploadButton();
                    uploadButton.textAreaObj = this;
                    items.add('flagrow-upload', uploadButton, 0);

                    // animate the button on hover: shows the label
                    $('.Button-label', '.item-flagrow-upload > div').hide();
                    $('.item-flagrow-upload > div').hover(function () {
                        $('.Button-label', this).show();
                        $(this).removeClass('Button--icon');
                    }, function () {
                        $('.Button-label', this).hide();
                        $(this).addClass('Button--icon');
                    });
                });
            });
        }
    };
});
