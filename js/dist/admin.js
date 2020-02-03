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
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.js");
/* empty/unused harmony star reexport */

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

/***/ "./src/admin/addUploadPane.js":
/*!************************************!*\
  !*** ./src/admin/addUploadPane.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/AdminNav */ "flarum/components/AdminNav");
/* harmony import */ var flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/AdminLinkButton */ "flarum/components/AdminLinkButton");
/* harmony import */ var flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_UploadPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/UploadPage */ "./src/admin/components/UploadPage.js");




/* harmony default export */ __webpack_exports__["default"] = (function () {
  // create the route
  app.routes['flagrow-upload'] = {
    path: '/flagrow/upload',
    component: _components_UploadPage__WEBPACK_IMPORTED_MODULE_3__["default"].component()
  }; // bind the route we created to the three dots settings button

  app.extensionSettings['flagrow-upload'] = function () {
    return m.route(app.route('flagrow-upload'));
  };

  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'items', function (items) {
    // add the Image Upload tab to the admin navigation menu
    items.add('flagrow-upload', flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      href: app.route('flagrow-upload'),
      icon: 'far fa-file',
      children: 'File Upload',
      description: app.translator.trans('flagrow-upload.admin.help_texts.description')
    }));
  });
});

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
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/Component */ "flarum/Component");
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_Component__WEBPACK_IMPORTED_MODULE_1__);
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









var UploadPage =
/*#__PURE__*/
function (_Component) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UploadPage, _Component);

  function UploadPage() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UploadPage.prototype;

  _proto.init = function init() {
    var _this = this;

    // whether we are saving the settings or not right now
    this.loading = false; // the fields we need to watch and to save

    this.fields = [// image
    'resizeMaxWidth', 'cdnUrl', 'maxFileSize', 'overrideAvatarUpload', // watermark
    'watermark', 'watermarkPosition', // Imgur
    'imgurClientId', // AWS
    'awsS3Key', 'awsS3Secret', 'awsS3Bucket', 'awsS3Region', // OVH
    'ovhUsername', 'ovhPassword', 'ovhTenantId', 'ovhContainer', 'ovhRegion', // QIniu
    'qiniuKey', 'qiniuSecret', 'qiniuBucket']; // the checkboxes we need to watch and to save.

    this.checkboxes = ['mustResize', 'overrideAvatarUpload', 'addsWatermarks', 'disableHotlinkProtection', 'disableDownloadLogging']; // fields that are objects

    this.objects = ['mimeTypes']; // watermark positions

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
    }; // get the saved settings from the database

    var settings = app.data.settings; // our package prefix (to be added to every field and checkbox in the setting table)

    this.settingsPrefix = 'flagrow.upload'; // Options for the Upload methods dropdown menu.

    this.uploadMethodOptions = settings[this.addPrefix('availableUploadMethods')] || {}; // Options for the Template dropdown menu.

    this.templateOptions = settings[this.addPrefix('availableTemplates')] || {}; // Contains current values.

    this.values = {}; // bind the values of the fields and checkboxes to the getter/setter functions

    this.fields.forEach(function (key) {
      return _this.values[key] = m.prop(settings[_this.addPrefix(key)]);
    });
    this.checkboxes.forEach(function (key) {
      return _this.values[key] = m.prop(settings[_this.addPrefix(key)] === '1');
    });
    this.objects.forEach(function (key) {
      return _this.values[key] = settings[_this.addPrefix(key)] ? m.prop(JSON.parse(settings[_this.addPrefix(key)])) : m.prop();
    }); // Set a sane default in case no mimeTypes have been configured yet.

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
  };
  /**
   * Show the actual ImageUploadPage.
   *
   * @returns {*}
   */


  _proto.view = function view() {
    var _this2 = this;

    return [m('div', {
      className: 'UploadPage'
    }, [m('div', {
      className: 'container'
    }, [m('form', {
      onsubmit: this.onsubmit.bind(this)
    }, [m('fieldset', {
      className: 'UploadPage-preferences'
    }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.title')), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.max_file_size')), m('input', {
      className: 'FormControl',
      value: this.values.maxFileSize() || 2048,
      oninput: m.withAttr('value', this.values.maxFileSize)
    }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.preferences.mime_types')), m('div', {
      className: 'MimeTypes--Container'
    }, Object.keys(this.values.mimeTypes()).map(function (mime) {
      var config = _this2.values.mimeTypes()[mime]; // Compatibility for older versions.


      if (typeof config !== 'object') {
        config = {
          adapter: config,
          template: 'file'
        };
      }

      return m('div', {}, [m('input', {
        className: 'FormControl MimeTypes',
        value: mime,
        oninput: m.withAttr('value', _this2.updateMimeTypeKey.bind(_this2, mime))
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
        children: 'x',
        onclick: _this2.deleteMimeType.bind(_this2, mime)
      })]);
    }), m('br'), m('div', {}, [m('input', {
      className: 'FormControl MimeTypes add-MimeType-key',
      value: this.newMimeType.regex(),
      oninput: m.withAttr('value', this.newMimeType.regex)
    }), flarum_components_Select__WEBPACK_IMPORTED_MODULE_5___default.a.component({
      options: this.uploadMethodOptions,
      className: 'add-MimeType-value',
      oninput: m.withAttr('value', this.newMimeType.adapter),
      value: this.newMimeType.adapter()
    }), flarum_components_Select__WEBPACK_IMPORTED_MODULE_5___default.a.component({
      options: this.getTemplateOptionsForInput(),
      className: 'add-MimeType-value',
      oninput: m.withAttr('value', this.newMimeType.template),
      value: this.newMimeType.template()
    }), flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      type: 'button',
      className: 'Button Button--warning',
      children: '+',
      onclick: this.addMimeType.bind(this)
    })])), m('div', {
      className: 'helpText'
    }, app.translator.trans('flagrow-upload.admin.help_texts.mime_types')), m('div', {
      className: 'helpText'
    }, app.translator.trans('flagrow-upload.admin.help_texts.download_templates')), this.templateOptionsDescriptions()]), m('fieldset', {
      className: 'UploadPage-resize'
    }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.resize.title')), m('div', {
      className: 'helpText'
    }, app.translator.trans('flagrow-upload.admin.help_texts.resize')), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default.a.component({
      state: this.values.mustResize() || false,
      children: app.translator.trans('flagrow-upload.admin.labels.resize.toggle'),
      onchange: this.values.mustResize
    }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.resize.max_width')), m('input', {
      className: 'FormControl',
      value: this.values.resizeMaxWidth() || 100,
      oninput: m.withAttr('value', this.values.resizeMaxWidth),
      disabled: !this.values.mustResize()
    })]), m('fieldset', {
      className: 'UploadPage-watermark'
    }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.watermark.title')), m('div', {
      className: 'helpText'
    }, app.translator.trans('flagrow-upload.admin.help_texts.watermark')), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default.a.component({
      state: this.values.addsWatermarks() || false,
      children: app.translator.trans('flagrow-upload.admin.labels.watermark.toggle'),
      onchange: this.values.addsWatermarks
    }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.watermark.position')), m('div', {}, [flarum_components_Select__WEBPACK_IMPORTED_MODULE_5___default.a.component({
      options: this.watermarkPositions,
      onchange: this.values.watermarkPosition,
      value: this.values.watermarkPosition() || 'bottom-right'
    })]), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.watermark.file')), m(flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_7___default.a, {
      name: "flagrow/watermark"
    })]), m('fieldset', {
      className: 'UploadPage-downloading'
    }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.disable-hotlink-protection.title')), m('div', {
      className: 'helpText'
    }, app.translator.trans('flagrow-upload.admin.help_texts.disable-hotlink-protection')), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default.a.component({
      state: this.values.disableHotlinkProtection() || false,
      children: app.translator.trans('flagrow-upload.admin.labels.disable-hotlink-protection.toggle'),
      onchange: this.values.disableHotlinkProtection
    }), m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.disable-download-logging.title')), m('div', {
      className: 'helpText'
    }, app.translator.trans('flagrow-upload.admin.help_texts.disable-download-logging')), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default.a.component({
      state: this.values.disableDownloadLogging() || false,
      children: app.translator.trans('flagrow-upload.admin.labels.disable-download-logging.toggle'),
      onchange: this.values.disableDownloadLogging
    })]), m('fieldset', {
      className: 'UploadPage-local'
    }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.local.title')), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.local.cdn_url')), m('input', {
      className: 'FormControl',
      value: this.values.cdnUrl() || '',
      oninput: m.withAttr('value', this.values.cdnUrl)
    })]), m('fieldset', {
      className: 'UploadPage-imgur'
    }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.imgur.title')), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.imgur.client_id')), m('input', {
      className: 'FormControl',
      value: this.values.imgurClientId() || '',
      oninput: m.withAttr('value', this.values.imgurClientId)
    })]), m('fieldset', {
      className: 'UploadPage-qiniu'
    }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.qiniu.title')), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.qiniu.key')), m('input', {
      className: 'FormControl',
      value: this.values.qiniuKey() || '',
      oninput: m.withAttr('value', this.values.qiniuKey)
    }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.qiniu.secret')), m('input', {
      className: 'FormControl',
      value: this.values.qiniuSecret() || '',
      oninput: m.withAttr('value', this.values.qiniuSecret)
    }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.qiniu.bucket')), m('input', {
      className: 'FormControl',
      value: this.values.qiniuBucket() || '',
      oninput: m.withAttr('value', this.values.qiniuBucket)
    })]), m('fieldset', {
      className: 'UploadPage-aws-s3'
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
    })]), m('fieldset', {
      className: 'UploadPage-ovh-svfs'
    }, [m('legend', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.title')), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.container')), m('input', {
      className: 'FormControl',
      value: this.values.ovhContainer() || '',
      oninput: m.withAttr('value', this.values.ovhContainer)
    }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.tenantid')), m('input', {
      className: 'FormControl',
      value: this.values.ovhTenantId() || '',
      oninput: m.withAttr('value', this.values.ovhTenantId)
    }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.username')), m('input', {
      className: 'FormControl',
      value: this.values.ovhUsername() || '',
      oninput: m.withAttr('value', this.values.ovhUsername)
    }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.password')), m('input', {
      className: 'FormControl',
      value: this.values.ovhPassword() || '',
      oninput: m.withAttr('value', this.values.ovhPassword)
    }), m('label', {}, app.translator.trans('flagrow-upload.admin.labels.ovh-svfs.region')), m('input', {
      className: 'FormControl',
      value: this.values.ovhRegion() || '',
      oninput: m.withAttr('value', this.values.ovhRegion)
    })]), flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      type: 'submit',
      className: 'Button Button--primary',
      children: app.translator.trans('flagrow-upload.admin.buttons.save'),
      loading: this.loading,
      disabled: !this.changed()
    })])])])];
  };

  _proto.getTemplateOptionsForInput = function getTemplateOptionsForInput() {
    var options = [];

    for (var option in this.templateOptions) {
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
      children.push(m('li', this.templateOptions[template].name + ": " + this.templateOptions[template].description));
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
  };
  /**
   * Checks if the values of the fields and checkboxes are different from
   * the ones stored in the database
   *
   * @returns boolean
   */


  _proto.changed = function changed() {
    var _this3 = this;

    var fieldsCheck = this.fields.some(function (key) {
      return _this3.values[key]() !== app.data.settings[_this3.addPrefix(key)];
    });
    var checkboxesCheck = this.checkboxes.some(function (key) {
      return _this3.values[key]() !== (app.data.settings[_this3.addPrefix(key)] == '1');
    });
    var objectsCheck = this.objects.some(function (key) {
      return JSON.stringify(_this3.values[key]()) !== app.data.settings[_this3.addPrefix(key)];
    });
    return fieldsCheck || checkboxesCheck || objectsCheck;
  };
  /**
   * Saves the settings to the database and redraw the page
   *
   * @param e
   */


  _proto.onsubmit = function onsubmit(e) {
    var _this4 = this;

    // prevent the usual form submit behaviour
    e.preventDefault(); // if the page is already saving, do nothing

    if (this.loading) return; // prevents multiple savings

    this.loading = true; // remove previous success popup

    app.alerts.dismiss(this.successAlert);
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
      app.alerts.show(_this4.successAlert = new flarum_components_Alert__WEBPACK_IMPORTED_MODULE_4___default.a({
        type: 'success',
        children: app.translator.trans('core.admin.basics.saved_message')
      }));
    }).catch(function () {}).then(function () {
      // return to the initial state and redraw the page
      _this4.loading = false;
      m.redraw();
    });
  };
  /**
   * Adds the prefix `this.settingsPrefix` at the beginning of `key`
   *
   * @returns string
   */


  _proto.addPrefix = function addPrefix(key) {
    return this.settingsPrefix + '.' + key;
  };

  return UploadPage;
}(flarum_Component__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "./src/admin/index.js":
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/PermissionGrid */ "flarum/components/PermissionGrid");
/* harmony import */ var flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _addUploadPane__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./addUploadPane */ "./src/admin/addUploadPane.js");




flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.initializers.add('flagrow-upload', function (app) {
  // add the admin pane
  Object(_addUploadPane__WEBPACK_IMPORTED_MODULE_3__["default"])(); // add the permission option to the relative pane

  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'startItems', function (items) {
    items.add('upload', {
      icon: 'far fa-file',
      label: app.translator.trans('flagrow-upload.admin.permissions.upload_label'),
      permission: 'flagrow.upload'
    });
  }); // add the permission option to the relative pane

  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'viewItems', function (items) {
    items.add('download', {
      icon: 'fas fa-download',
      label: app.translator.trans('flagrow-upload.admin.permissions.download_label'),
      permission: 'flagrow.upload.download',
      allowGuest: true
    });
  });
});

/***/ }),

/***/ "flarum/Component":
/*!**************************************************!*\
  !*** external "flarum.core.compat['Component']" ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['Component'];

/***/ }),

/***/ "flarum/app":
/*!********************************************!*\
  !*** external "flarum.core.compat['app']" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['app'];

/***/ }),

/***/ "flarum/components/AdminLinkButton":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['components/AdminLinkButton']" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/AdminLinkButton'];

/***/ }),

/***/ "flarum/components/AdminNav":
/*!************************************************************!*\
  !*** external "flarum.core.compat['components/AdminNav']" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/AdminNav'];

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

/***/ "flarum/components/PermissionGrid":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['components/PermissionGrid']" ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/PermissionGrid'];

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

/***/ "flarum/extend":
/*!***********************************************!*\
  !*** external "flarum.core.compat['extend']" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['extend'];

/***/ }),

/***/ "flarum/utils/saveSettings":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['utils/saveSettings']" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/saveSettings'];

/***/ })

/******/ });
//# sourceMappingURL=admin.js.map