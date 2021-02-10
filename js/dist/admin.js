module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./admin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./admin.js":
/*!******************!*\
  !*** ./admin.js ***!
  \******************/
/*! exports provided: components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _src_admin__WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _inheritsLoose; });
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/***/ }),

/***/ "./src/admin/components/UploadPage.js":
/*!********************************************!*\
  !*** ./src/admin/components/UploadPage.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return UploadPage; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/utils/saveSettings */ "flarum/utils/saveSettings");
/* harmony import */ var flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_Alert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/Alert */ "flarum/components/Alert");
/* harmony import */ var flarum_components_Alert__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Alert__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_components_Select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/components/Select */ "flarum/components/Select");
/* harmony import */ var flarum_components_Select__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Select__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/components/Switch */ "flarum/components/Switch");
/* harmony import */ var flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/components/UploadImageButton */ "flarum/components/UploadImageButton");
/* harmony import */ var flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/utils/withAttr */ "flarum/utils/withAttr");
/* harmony import */ var flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/utils/Stream */ "flarum/utils/Stream");
/* harmony import */ var flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flarum_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/components/ExtensionPage */ "flarum/components/ExtensionPage");
/* harmony import */ var flarum_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! flarum/utils/ItemList */ "flarum/utils/ItemList");
/* harmony import */ var flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_11__);












/* global m */

var UploadPage = /*#__PURE__*/function (_ExtensionPage) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UploadPage, _ExtensionPage);

  function UploadPage() {
    return _ExtensionPage.apply(this, arguments) || this;
  }

  var _proto = UploadPage.prototype;

  _proto.oninit = function oninit(vnode) {
    var _this = this;

    _ExtensionPage.prototype.oninit.call(this, vnode); // whether we are saving the settings or not right now


    this.loading = false; // the fields we need to watch and to save

    this.fields = [// image
    'resizeMaxWidth', 'cdnUrl', 'maxFileSize', 'whitelistedClientExtensions', 'composerButtonVisiblity', // watermark
    'watermark', 'watermarkPosition', // Imgur
    'imgurClientId', // AWS
    'awsS3Key', 'awsS3Secret', 'awsS3Bucket', 'awsS3Region', 'awsS3Endpoint', 'awsS3ACL', // QIniu
    'qiniuKey', 'qiniuSecret', 'qiniuBucket']; // the checkboxes we need to watch and to save.

    this.checkboxes = ['mustResize', 'addsWatermarks', 'disableHotlinkProtection', 'disableDownloadLogging', 'awsS3UsePathStyleEndpoint']; // fields that are objects

    this.objects = ['mimeTypes']; // watermark positions

    this.watermarkPositions = {
      'top-left': 'top-left',
      'top-right': 'top-right',
      'bottom-left': 'bottom-left',
      'bottom-right': 'bottom-right',
      center: 'center',
      left: 'left',
      top: 'top',
      right: 'right',
      bottom: 'bottom'
    }; // Composer button options

    this.composerButtonVisiblityOptions = {
      'both': flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.composer_buttons.options.both'),
      'upload-btn': flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.composer_buttons.options.upload-btn'),
      'media-btn': flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.composer_buttons.options.media-btn')
    }; // get the saved settings from the database

    var settings = flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.data.settings; // our package prefix (to be added to every field and checkbox in the setting table)

    this.settingsPrefix = 'fof-upload'; // Options for the Upload methods dropdown menu.

    this.uploadMethodOptions = settings[this.addPrefix('availableUploadMethods')] || {}; // Options for the Template dropdown menu.

    this.templateOptions = settings[this.addPrefix('availableTemplates')] || {}; // Contains current values.

    this.values = {}; // bind the values of the fields and checkboxes to the getter/setter functions

    this.fields.forEach(function (key) {
      return _this.values[key] = flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()(settings[_this.addPrefix(key)]);
    });
    this.checkboxes.forEach(function (key) {
      return _this.values[key] = flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()(settings[_this.addPrefix(key)] === '1');
    });
    this.objects.forEach(function (key) {
      return _this.values[key] = settings[_this.addPrefix(key)] ? flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()(JSON.parse(settings[_this.addPrefix(key)])) : flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()();
    }); // Set a sane default in case no mimeTypes have been configured yet.
    // Since 'local' (or others) can now be disabled, pick the last entry in the object for default

    this.defaultAdap = Object.keys(this.uploadMethodOptions)[Object.keys(this.uploadMethodOptions).length - 1];
    this.values.mimeTypes() || (this.values.mimeTypes = flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()({
      '^image\\/.*': {
        adapter: this.defaultAdap,
        template: 'image-preview'
      }
    }));
    this.newMimeType = {
      regex: flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()(''),
      adapter: flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()(this.defaultAdap),
      template: flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()('file')
    };
  }
  /**
   * Show the actual ImageUploadPage.
   *
   * @returns {*}
   */
  ;

  _proto.content = function content() {
    var _this2 = this;

    return [m('.UploadPage', [m('.container', [m('form', {
      onsubmit: this.onsubmit.bind(this)
    }, [m('fieldset', [m('legend', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.preferences.title')), m('label', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.preferences.max_file_size')), m('input.FormControl', {
      value: this.values.maxFileSize() || 2048,
      oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.maxFileSize),
      type: 'number',
      min: '0'
    }), m('label', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.preferences.mime_types')), m('.MimeTypes--Container', Object.keys(this.values.mimeTypes()).map(function (mime) {
      var config = _this2.values.mimeTypes()[mime]; // Compatibility for older versions.


      if (typeof config !== 'object') {
        config = {
          adapter: config,
          template: 'file'
        };
      }

      return m('div', [m('input.FormControl.MimeTypes', {
        value: mime,
        oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', _this2.updateMimeTypeKey.bind(_this2, mime))
      }), flarum_components_Select__WEBPACK_IMPORTED_MODULE_5___default.a.component({
        options: _this2.uploadMethodOptions,
        onchange: _this2.updateMimeTypeAdapter.bind(_this2, mime, config),
        value: config.adapter || 'local'
      }), flarum_components_Select__WEBPACK_IMPORTED_MODULE_5___default.a.component({
        options: _this2.getTemplateOptionsForInput(),
        onchange: _this2.updateMimeTypeTemplate.bind(_this2, mime, config),
        value: config.template || 'local'
      }), flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
        type: 'button',
        className: 'Button Button--warning',
        onclick: _this2.deleteMimeType.bind(_this2, mime)
      }, 'x')]);
    }), m('br'), m('div', [m('input.FormControl.MimeTypes.add-MimeType-key', {
      value: this.newMimeType.regex(),
      oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.newMimeType.regex)
    }), flarum_components_Select__WEBPACK_IMPORTED_MODULE_5___default.a.component({
      options: this.uploadMethodOptions,
      className: 'add-MimeType-value',
      oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.newMimeType.adapter),
      value: this.newMimeType.adapter()
    }), flarum_components_Select__WEBPACK_IMPORTED_MODULE_5___default.a.component({
      options: this.getTemplateOptionsForInput(),
      className: 'add-MimeType-value',
      oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.newMimeType.template),
      value: this.newMimeType.template()
    }), flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      type: 'button',
      className: 'Button Button--warning',
      onclick: this.addMimeType.bind(this)
    }, '+')])), m('.helpText', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.help_texts.mime_types')), m('.helpText', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.help_texts.download_templates')), this.templateOptionsDescriptions()]), m('fieldset', [m('legend', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.composer_buttons.title')), m('.helpText', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.help_texts.composer_buttons')), m('div', [flarum_components_Select__WEBPACK_IMPORTED_MODULE_5___default.a.component({
      options: this.composerButtonVisiblityOptions,
      onchange: this.values.composerButtonVisiblity,
      value: this.values.composerButtonVisiblity() || 'both'
    })])]), m('fieldset', [m('legend', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.resize.title')), m('.helpText', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.help_texts.resize')), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default.a.component({
      state: this.values.mustResize() || false,
      onchange: this.values.mustResize
    }, flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.resize.toggle')), m('label', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.resize.max_width')), m('input', {
      className: 'FormControl',
      value: this.values.resizeMaxWidth() || 100,
      oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.resizeMaxWidth),
      disabled: !this.values.mustResize(),
      type: 'number',
      min: '0'
    })]), m('fieldset', [m('legend', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.client_extension.title')), m('.helpText', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.help_texts.client_extension')), m('input', {
      className: 'FormControl',
      value: this.values.whitelistedClientExtensions() || '',
      oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.whitelistedClientExtensions)
    })]), m('fieldset', [m('legend', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.watermark.title')), m('.helpText', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.help_texts.watermark')), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default.a.component({
      state: this.values.addsWatermarks() || false,
      onchange: this.values.addsWatermarks
    }, flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.watermark.toggle')), m('label', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.watermark.position')), m('div', [flarum_components_Select__WEBPACK_IMPORTED_MODULE_5___default.a.component({
      options: this.watermarkPositions,
      onchange: this.values.watermarkPosition,
      value: this.values.watermarkPosition() || 'bottom-right'
    })]), m('label', {}, flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.watermark.file')), flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_7___default.a.component({
      name: 'fof/watermark'
    })]), m('fieldset', [m('legend', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.disable-hotlink-protection.title')), m('.helpText', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.help_texts.disable-hotlink-protection')), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default.a.component({
      state: this.values.disableHotlinkProtection() || false,
      onchange: this.values.disableHotlinkProtection
    }, flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.disable-hotlink-protection.toggle')), m('legend', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.disable-download-logging.title')), m('.helpText', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.help_texts.disable-download-logging')), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default.a.component({
      state: this.values.disableDownloadLogging() || false,
      onchange: this.values.disableDownloadLogging
    }, flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.disable-download-logging.toggle'))]), m('fieldset', [m('legend', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.local.title')), m('label', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.local.cdn_url')), m('input.FormControl', {
      value: this.values.cdnUrl() || '',
      oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.cdnUrl)
    })]), this.adaptorItems().toArray(), flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      type: 'submit',
      className: 'Button Button--primary',
      loading: this.loading,
      disabled: !this.changed()
    }, flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.buttons.save'))])])])];
  };

  _proto.adaptorItems = function adaptorItems() {
    var items = new flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_11___default.a();

    if (this.uploadMethodOptions['imgur'] !== undefined) {
      items.add('imgur', m('.imgur', [m('fieldset', [m('legend', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.imgur.title')), m('label', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.imgur.client_id')), m('input.FormControl', {
        value: this.values.imgurClientId() || '',
        oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.imgurClientId)
      })])]));
    }

    if (this.uploadMethodOptions['qiniu'] !== undefined) {
      items.add('qiniu', m('.qiniu', [m('fieldset', [m('legend', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.qiniu.title')), m('label', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.qiniu.key')), m('input.FormControl', {
        value: this.values.qiniuKey() || '',
        oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.qiniuKey)
      }), m('label', {}, flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.qiniu.secret')), m('input.FormControl', {
        value: this.values.qiniuSecret() || '',
        oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.qiniuSecret)
      }), m('label', {}, flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.qiniu.bucket')), m('input.FormControl', {
        value: this.values.qiniuBucket() || '',
        oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.qiniuBucket)
      })])]));
    }

    if (this.uploadMethodOptions['aws-s3'] !== undefined) {
      items.add('aws-s3', m('.aws', [m('fieldset', [m('legend', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.aws-s3.title')), m('label', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.aws-s3.key')), m('input.FormControl', {
        value: this.values.awsS3Key() || '',
        oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.awsS3Key)
      }), m('label', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.aws-s3.secret')), m('input.FormControl', {
        value: this.values.awsS3Secret() || '',
        oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.awsS3Secret)
      }), m('label', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.aws-s3.bucket')), m('input.FormControl', {
        value: this.values.awsS3Bucket() || '',
        oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.awsS3Bucket)
      }), m('label', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.aws-s3.region')), m('input.FormControl', {
        value: this.values.awsS3Region() || '',
        oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.awsS3Region)
      })]), m('fieldset', [m('legend', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.aws-s3.advanced_title')), m('.helpText', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.help_texts.s3_compatible_storage')), m('label', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.aws-s3.endpoint')), m('input.FormControl', {
        value: this.values.awsS3Endpoint() || '',
        oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.awsS3Endpoint)
      }), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default.a.component({
        state: this.values.awsS3UsePathStyleEndpoint() || false,
        onchange: this.values.awsS3UsePathStyleEndpoint
      }, flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.aws-s3.use_path_style_endpoint')), m('label', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.labels.aws-s3.acl')), m('input.FormControl', {
        value: this.values.awsS3ACL() || '',
        oninput: flarum_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.awsS3ACL)
      }), m('.helpText', flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.admin.help_texts.s3_acl'))])]));
    }

    return items;
  };

  _proto.getTemplateOptionsForInput = function getTemplateOptionsForInput() {
    var options = {};

    for (var option in this.templateOptions) {
      if (!this.templateOptions.hasOwnProperty(option)) {
        continue;
      }

      options[option] = this.templateOptions[option].name;
    }

    return options;
  };

  _proto.updateMimeTypeKey = function updateMimeTypeKey(mime, value) {
    this.values.mimeTypes()[value] = this.values.mimeTypes()[mime];
    this.deleteMimeType(mime);
  };

  _proto.updateMimeTypeAdapter = function updateMimeTypeAdapter(mime, config, value) {
    config.adapter = value;
    this.values.mimeTypes()[mime] = config;
  };

  _proto.updateMimeTypeTemplate = function updateMimeTypeTemplate(mime, config, value) {
    config.template = value;
    this.values.mimeTypes()[mime] = config;
  };

  _proto.deleteMimeType = function deleteMimeType(mime) {
    delete this.values.mimeTypes()[mime];
  };

  _proto.templateOptionsDescriptions = function templateOptionsDescriptions() {
    var children = [];

    for (var template in this.templateOptions) {
      if (!this.templateOptions.hasOwnProperty(template)) {
        continue;
      }

      children.push(m('li', this.templateOptions[template].name + ': ' + this.templateOptions[template].description));
    }

    return m('ul', children);
  };

  _proto.addMimeType = function addMimeType() {
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
  ;

  _proto.changed = function changed() {
    var _this3 = this;

    var fieldsCheck = this.fields.some(function (key) {
      return _this3.values[key]() !== flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.data.settings[_this3.addPrefix(key)];
    });
    var checkboxesCheck = this.checkboxes.some(function (key) {
      return _this3.values[key]() !== (flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.data.settings[_this3.addPrefix(key)] === '1');
    });
    var objectsCheck = this.objects.some(function (key) {
      return JSON.stringify(_this3.values[key]()) !== flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.data.settings[_this3.addPrefix(key)];
    });
    return fieldsCheck || checkboxesCheck || objectsCheck;
  }
  /**
   * Saves the settings to the database and redraw the page
   *
   * @param e
   */
  ;

  _proto.onsubmit = function onsubmit(e) {
    var _this4 = this;

    // prevent the usual form submit behaviour
    e.preventDefault(); // if the page is already saving, do nothing

    if (this.loading) return; // prevents multiple savings

    this.loading = true; // remove previous success popup

    flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.alerts.dismiss(this.successAlert);
    var settings = {}; // gets all the values from the form

    this.fields.forEach(function (key) {
      return settings[_this4.addPrefix(key)] = _this4.values[key]();
    });
    this.checkboxes.forEach(function (key) {
      return settings[_this4.addPrefix(key)] = _this4.values[key]();
    });
    this.objects.forEach(function (key) {
      return settings[_this4.addPrefix(key)] = JSON.stringify(_this4.values[key]());
    }); // actually saves everything in the database

    flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3___default()(settings).then(function () {
      // on success, show popup
      _this4.successAlert = flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.alerts.show(flarum_components_Alert__WEBPACK_IMPORTED_MODULE_4___default.a, {
        type: 'success'
      }, flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('core.admin.basics.saved_message'));
    })["catch"](function () {}).then(function () {
      // return to the initial state and redraw the page
      _this4.loading = false;
      m.redraw();
    });
  }
  /**
   * Adds the prefix `this.settingsPrefix` at the beginning of `key`
   *
   * @returns string
   */
  ;

  _proto.addPrefix = function addPrefix(key) {
    return this.settingsPrefix + '.' + key;
  };

  return UploadPage;
}(flarum_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_10___default.a);



/***/ }),

/***/ "./src/admin/components/index.js":
/*!***************************************!*\
  !*** ./src/admin/components/index.js ***!
  \***************************************/
/*! exports provided: components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
/* harmony import */ var _UploadPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UploadPage */ "./src/admin/components/UploadPage.js");

var components = {
  UploadPage: _UploadPage__WEBPACK_IMPORTED_MODULE_0__["default"]
};

/***/ }),

/***/ "./src/admin/index.js":
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
/*! exports provided: components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_UploadPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/UploadPage */ "./src/admin/components/UploadPage.js");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components */ "./src/admin/components/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _components__WEBPACK_IMPORTED_MODULE_2__["components"]; });




flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.initializers.add('fof-upload', function (app) {
  app.extensionData["for"]('fof-upload').registerPage(_components_UploadPage__WEBPACK_IMPORTED_MODULE_1__["default"]).registerPermission({
    icon: 'far fa-file',
    label: app.translator.trans('fof-upload.admin.permissions.upload_label'),
    permission: 'fof-upload.upload'
  }, 'start', 50).registerPermission({
    icon: 'fas fa-download',
    label: app.translator.trans('fof-upload.admin.permissions.download_label'),
    permission: 'fof-upload.download',
    allowGuest: true
  }, 'view', 50);
});

/***/ }),

/***/ "flarum/app":
/*!********************************************!*\
  !*** external "flarum.core.compat['app']" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['app'];

/***/ }),

/***/ "flarum/components/Alert":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['components/Alert']" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Alert'];

/***/ }),

/***/ "flarum/components/Button":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Button']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Button'];

/***/ }),

/***/ "flarum/components/ExtensionPage":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['components/ExtensionPage']" ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/ExtensionPage'];

/***/ }),

/***/ "flarum/components/Select":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Select']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Select'];

/***/ }),

/***/ "flarum/components/Switch":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Switch']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Switch'];

/***/ }),

/***/ "flarum/components/UploadImageButton":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['components/UploadImageButton']" ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/UploadImageButton'];

/***/ }),

/***/ "flarum/utils/ItemList":
/*!*******************************************************!*\
  !*** external "flarum.core.compat['utils/ItemList']" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/ItemList'];

/***/ }),

/***/ "flarum/utils/Stream":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['utils/Stream']" ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/Stream'];

/***/ }),

/***/ "flarum/utils/saveSettings":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['utils/saveSettings']" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/saveSettings'];

/***/ }),

/***/ "flarum/utils/withAttr":
/*!*******************************************************!*\
  !*** external "flarum.core.compat['utils/withAttr']" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/withAttr'];

/***/ })

/******/ });
//# sourceMappingURL=admin.js.map