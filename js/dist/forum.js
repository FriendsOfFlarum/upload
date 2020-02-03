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
/******/ 	return __webpack_require__(__webpack_require__.s = "./forum.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./forum.js":
/*!******************!*\
  !*** ./forum.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.js");
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

/***/ "./src/forum/components/DragAndDrop.js":
/*!*********************************************!*\
  !*** ./src/forum/components/DragAndDrop.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DragAndDrop; });
var DragAndDrop =
/*#__PURE__*/
function () {
  function DragAndDrop(uploadButton) {
    if (this.initialized) return;
    this.uploadButton = uploadButton;
    this.textarea = $("#composer .Composer");
    $(this.textarea).on('dragover', this.in.bind(this));
    $(this.textarea).on('dragleave', this.out.bind(this));
    $(this.textarea).on('dragend', this.out.bind(this));
    $(this.textarea).on('drop', this.dropping.bind(this));
    this.isDropping = this.over = false;
    this.initialized = true;
  }

  var _proto = DragAndDrop.prototype;

  _proto.in = function _in(e) {
    e.preventDefault();

    if (!this.over) {
      this.textarea.toggleClass('flagrow-upload-dragging', true);
      this.over = true;
    }
  };

  _proto.out = function out(e) {
    e.preventDefault();

    if (this.over) {
      this.textarea.toggleClass('flagrow-upload-dragging', false);
      this.over = false;
    }
  };

  _proto.dropping = function dropping(e) {
    var _this = this;

    e.preventDefault();

    if (!this.isDropping) {
      this.isDropping = true;
      this.textarea.addClass('flagrow-dropping');
      m.redraw();
      this.uploadButton.uploadFiles(e.originalEvent.dataTransfer.files).then(function () {
        _this.textarea.removeClass('flagrow-dropping');

        _this.isDropping = false;
      });
    }
  };

  return DragAndDrop;
}();



/***/ }),

/***/ "./src/forum/components/PasteClipboard.js":
/*!************************************************!*\
  !*** ./src/forum/components/PasteClipboard.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PasteClipboard; });
var PasteClipboard =
/*#__PURE__*/
function () {
  function PasteClipboard(uploadButton) {
    if (this.initialized) return;
    this.uploadButton = uploadButton;
    document.addEventListener('paste', this.paste.bind(this));
  }

  var _proto = PasteClipboard.prototype;

  _proto.paste = function paste(e) {
    if (e.clipboardData && e.clipboardData.items) {
      var items = e.clipboardData.items;
      var files = [];

      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          files.push(items[i].getAsFile());
        }
      }

      if (files.length > 0) {
        m.redraw();
        this.uploadButton.uploadFiles(files);
      }
    }
  };

  return PasteClipboard;
}();



/***/ }),

/***/ "./src/forum/components/UploadButton.js":
/*!**********************************************!*\
  !*** ./src/forum/components/UploadButton.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return UploadButton; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/Component */ "flarum/Component");
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_helpers_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/helpers/icon */ "flarum/helpers/icon");
/* harmony import */ var flarum_helpers_icon__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_icon__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/components/LoadingIndicator */ "flarum/components/LoadingIndicator");
/* harmony import */ var flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__);





var UploadButton =
/*#__PURE__*/
function (_Component) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UploadButton, _Component);

  function UploadButton() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UploadButton.prototype;

  /**
   * Load the configured remote uploader service.
   */
  _proto.init = function init() {
    // the service type handling uploads
    this.textAreaObj = null; // initial state of the button

    this.uploading = m.prop(false);
  };
  /**
   * Show the actual Upload Button.
   *
   * @returns {*}
   */


  _proto.view = function view() {
    var button = m('span', {
      className: 'Button-label'
    }, app.translator.trans('flagrow-upload.forum.buttons.attach'));

    if (this.uploading()) {
      button = m('span', {
        className: 'Button-label uploading'
      }, app.translator.trans('flagrow-upload.forum.states.loading'));
    }

    return m('div', {
      className: 'Button hasIcon flagrow-upload-button Button--icon ' + (this.uploading() ? 'uploading' : '')
    }, [this.uploading() ? flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default.a.component({
      className: 'Button-icon'
    }) : flarum_helpers_icon__WEBPACK_IMPORTED_MODULE_2___default()('fas fa-file-upload', {
      className: 'Button-icon'
    }), button, m('form#flagrow-upload-form', [m('input', {
      type: 'file',
      multiple: true,
      onchange: this.process.bind(this)
    })])]);
  };
  /**
   * Process the upload event.
   *
   * @param e
   */


  _proto.process = function process(e) {
    // get the file from the input field
    var files = $('form#flagrow-upload-form input').prop('files'); // set the button in the loading state (and redraw the element!)

    this.uploading(true);
    this.uploadFiles(files);
  };

  _proto.uploadFiles = function uploadFiles(files) {
    var data = new FormData();

    for (var i = 0; i < files.length; i++) {
      data.append('files[]', files[i]);
    } // send a POST request to the api


    return app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/flagrow/upload',
      // prevent JSON.stringify'ing the form data in the XHR call
      serialize: function serialize(raw) {
        return raw;
      },
      data: data
    }).then(this.success.bind(this), this.failure.bind(this));
  };
  /**
   * Handles errors.
   *
   * @param message
   */


  _proto.failure = function failure(message) {} // todo show popup

  /**
   * Appends the file's link to the body of the composer.
   *
   * @param file
   */
  ;

  _proto.success = function success(response) {
    var _this = this;

    response.forEach(function (bbcode) {
      _this.textAreaObj.insertAtCursor(bbcode + '\n');
    }); // if we are not starting a new discussion, the variable is defined

    if (typeof this.textAreaObj.props.preview !== 'undefined') {
      // show what we just uploaded
      this.textAreaObj.props.preview();
    } // reset the button for a new upload


    setTimeout(function () {
      document.getElementById("flagrow-upload-form").reset();

      _this.uploading(false);
    }, 1000);
  };

  return UploadButton;
}(flarum_Component__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "./src/forum/downloadButtonInteraction.js":
/*!************************************************!*\
  !*** ./src/forum/downloadButtonInteraction.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_components_Post__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/Post */ "flarum/components/Post");
/* harmony import */ var flarum_components_Post__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Post__WEBPACK_IMPORTED_MODULE_1__);


/* harmony default export */ __webpack_exports__["default"] = (function () {
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_Post__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'config', function (isInitialized) {
    var _this = this;

    if (isInitialized) return;
    this.$('.flagrow-download-button[data-uuid]').unbind('click').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var url = app.forum.attribute('apiUrl') + '/flagrow/download';
      url += '/' + $(e.currentTarget).attr('data-uuid');
      url += '/' + _this.props.post.id();
      url += '/' + app.session.csrfToken;
      window.open(url);
    });
  });
});

/***/ }),

/***/ "./src/forum/index.js":
/*!****************************!*\
  !*** ./src/forum/index.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_components_TextEditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/TextEditor */ "flarum/components/TextEditor");
/* harmony import */ var flarum_components_TextEditor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_TextEditor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_UploadButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/UploadButton */ "./src/forum/components/UploadButton.js");
/* harmony import */ var _components_DragAndDrop__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/DragAndDrop */ "./src/forum/components/DragAndDrop.js");
/* harmony import */ var _components_PasteClipboard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/PasteClipboard */ "./src/forum/components/PasteClipboard.js");
/* harmony import */ var _downloadButtonInteraction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./downloadButtonInteraction */ "./src/forum/downloadButtonInteraction.js");






app.initializers.add('flagrow-upload', function (app) {
  var uploadButton, drag, clipboard;
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_TextEditor__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'controlItems', function (items) {
    // check whether the user can upload images. If not, returns.
    if (!app.forum.attribute('canUpload')) return; // create and add the button

    uploadButton = new _components_UploadButton__WEBPACK_IMPORTED_MODULE_2__["default"]();
    uploadButton.textAreaObj = this;
    items.add('flagrow-upload', uploadButton, 0); // animate the button on hover: shows the label

    $('.Button-label', '.item-flagrow-upload > div:not(.uploading)').hide();
    $('.item-flagrow-upload > div:not(.uploading)').hover(function () {
      $('.Button-label', this).show();
      $(this).removeClass('Button--icon');
    }, function () {
      $('.Button-label', this).hide();
      $(this).addClass('Button--icon');
    });
  });
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_TextEditor__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'configTextarea', function () {
    // check whether the user can upload images. If not, returns.
    if (!app.forum.attribute('canUpload')) return;

    if (!drag) {
      drag = new _components_DragAndDrop__WEBPACK_IMPORTED_MODULE_3__["default"](uploadButton);
    }

    if (!clipboard) {
      clipboard = new _components_PasteClipboard__WEBPACK_IMPORTED_MODULE_4__["default"](uploadButton);
    }
  });
  Object(_downloadButtonInteraction__WEBPACK_IMPORTED_MODULE_5__["default"])();
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

/***/ "flarum/components/LoadingIndicator":
/*!********************************************************************!*\
  !*** external "flarum.core.compat['components/LoadingIndicator']" ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/LoadingIndicator'];

/***/ }),

/***/ "flarum/components/Post":
/*!********************************************************!*\
  !*** external "flarum.core.compat['components/Post']" ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Post'];

/***/ }),

/***/ "flarum/components/TextEditor":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['components/TextEditor']" ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/TextEditor'];

/***/ }),

/***/ "flarum/extend":
/*!***********************************************!*\
  !*** external "flarum.core.compat['extend']" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['extend'];

/***/ }),

/***/ "flarum/helpers/icon":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['helpers/icon']" ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['helpers/icon'];

/***/ })

/******/ });
//# sourceMappingURL=forum.js.map