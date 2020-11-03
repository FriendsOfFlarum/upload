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

/***/ "./src/forum/addUploadButton.js":
/*!**************************************!*\
  !*** ./src/forum/addUploadButton.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_TextEditor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/TextEditor */ "flarum/components/TextEditor");
/* harmony import */ var flarum_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_TextEditor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_UploadButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/UploadButton */ "./src/forum/components/UploadButton.js");
/* harmony import */ var _components_DragAndDrop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/DragAndDrop */ "./src/forum/components/DragAndDrop.js");
/* harmony import */ var _components_PasteClipboard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/PasteClipboard */ "./src/forum/components/PasteClipboard.js");
/* harmony import */ var _handler_Uploader__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./handler/Uploader */ "./src/forum/handler/Uploader.js");







/* harmony default export */ __webpack_exports__["default"] = (function () {
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'oninit', function () {
    this.uploader = new _handler_Uploader__WEBPACK_IMPORTED_MODULE_6__["default"]();
  });
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'controlItems', function (items) {
    var _this = this;

    if (!flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.forum.attribute('fof-upload.canUpload')) return;
    var button = _components_UploadButton__WEBPACK_IMPORTED_MODULE_3__["default"].component({
      upload: function upload(files) {
        return _this.uploader.upload(files);
      }
    });
    this.uploader.on('uploaded', function () {
      return button.success();
    });
    items.add('fof-upload', button);
  });
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'oncreate', function (f_, vnode) {
    var _this2 = this;

    if (!flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.forum.attribute('fof-upload.canUpload')) return;
    this.uploader.on('success', function (image) {
      return _this2.attrs.composer.editor.insertAtCursor(image + '\n');
    });
    var dragAndDrop = new _components_DragAndDrop__WEBPACK_IMPORTED_MODULE_4__["default"](function (files) {
      return _this2.uploader.upload(files);
    }, this.$().parents('.Composer')[0]);

    var unloadHandler = function unloadHandler() {
      dragAndDrop.unload();
    };

    this.$('textarea').bind('onunload', unloadHandler);
    new _components_PasteClipboard__WEBPACK_IMPORTED_MODULE_5__["default"](function (files) {
      return _this2.uploader.upload(files);
    }, this.$('textarea')[0]);
  });
});

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
var DragAndDrop = /*#__PURE__*/function () {
  function DragAndDrop(upload, composerElement) {
    this.upload = upload;
    this.composerElement = composerElement; // Keep references to the bound methods so we can remove the event listeners later

    this.handlers = {};

    if (!this.supportsFileDragging()) {
      return;
    }

    this.composerElement.addEventListener('dragover', this.handlers["in"] = this["in"].bind(this));
    this.composerElement.addEventListener('dragleave', this.handlers.out = this.out.bind(this));
    this.composerElement.addEventListener('dragend', this.handlers.out);
    this.composerElement.addEventListener('drop', this.handlers.dropping = this.dropping.bind(this));
    this.isDropping = this.over = false;
  }

  var _proto = DragAndDrop.prototype;

  _proto.supportsFileDragging = function supportsFileDragging() {
    // Based on https://css-tricks.com/drag-and-drop-file-uploading/
    var div = document.createElement('div');
    return ('draggable' in div || 'ondragstart' in div && 'ondrop' in div) && 'FormData' in window && 'FileReader' in window;
  };

  _proto.unload = function unload() {
    // If the handlers were not set (drag and drop not supported), we skip removing them
    if (!this.handlers["in"]) {
      return;
    }

    this.composerElement.removeEventListener('dragover', this.handlers["in"]);
    this.composerElement.removeEventListener('dragleave', this.handlers.out);
    this.composerElement.removeEventListener('dragend', this.handlers.out);
    this.composerElement.removeEventListener('drop', this.handlers.dropping);
  };

  _proto.isNotFile = function isNotFile(event) {
    // Checking event.dataTransfer.files.length does not work on dragover event, it's always zero
    // So we use the dataTransfer.items property to check whether any file is being dragged
    if (event.dataTransfer.items) {
      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind !== 'file') {
          return true;
        }
      }
    }

    return false;
  };

  _proto["in"] = function _in(event) {
    if (this.isNotFile(event)) {
      return;
    }

    event.preventDefault();

    if (!this.over) {
      this.composerElement.classList.add('fof-upload-dragging');
      this.over = true;
    }
  };

  _proto.out = function out(event) {
    if (this.isNotFile(event)) {
      return;
    }

    event.preventDefault();

    if (this.over) {
      this.composerElement.classList.remove('fof-upload-dragging');
      this.over = false;
    }
  };

  _proto.dropping = function dropping(event) {
    var _this = this;

    if (this.isNotFile(event)) {
      return;
    }

    event.preventDefault();

    if (!this.isDropping) {
      this.isDropping = true;
      this.composerElement.classList.add('fof-upload-dropping');
      this.upload(event.dataTransfer.files, function () {
        _this.composerElement.classList.remove('fof-upload-dropping');

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
var PasteClipboard = /*#__PURE__*/function () {
  function PasteClipboard(upload, textAreaElement) {
    this.upload = upload; // We don't need to remove the events listeners, because they are bound to the textarea when it's created,
    // and need to stay as long as the textarea exists in the DOM

    textAreaElement.addEventListener('paste', this.paste.bind(this));
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
        e.preventDefault();
        this.upload(files);
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
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/Component */ "flarum/Component");
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_helpers_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/helpers/icon */ "flarum/helpers/icon");
/* harmony import */ var flarum_helpers_icon__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_icon__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/LoadingIndicator */ "flarum/components/LoadingIndicator");
/* harmony import */ var flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_components_ReplyComposer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/components/ReplyComposer */ "flarum/components/ReplyComposer");
/* harmony import */ var flarum_components_ReplyComposer__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_components_ReplyComposer__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_components_EditPostComposer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/components/EditPostComposer */ "flarum/components/EditPostComposer");
/* harmony import */ var flarum_components_EditPostComposer__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_components_EditPostComposer__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/utils/Stream */ "flarum/utils/Stream");
/* harmony import */ var flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_7__);









var UploadButton = /*#__PURE__*/function (_Component) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UploadButton, _Component);

  function UploadButton() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UploadButton.prototype;

  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode); // initial state of the button


    this.uploading = flarum_utils_Stream__WEBPACK_IMPORTED_MODULE_7___default()(false);
  };

  _proto.view = function view() {
    var buttonText = this.uploading() ? flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.forum.states.loading') : flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.forum.buttons.attach');
    return m('.Button.hasIcon.fof-upload-button.Button--icon', {
      className: this.uploading() ? 'uploading' : ''
    }, [this.uploading() ? flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      size: 'tiny',
      className: 'LoadingIndicator--inline Button-icon'
    }) : flarum_helpers_icon__WEBPACK_IMPORTED_MODULE_3___default()('fas fa-file-upload', {
      className: 'Button-icon'
    }), m('span.Button-label', buttonText), m('form', [m('input', {
      type: 'file',
      multiple: true,
      onchange: this.process.bind(this)
    })])]);
  }
  /**
   * Process the upload event.
   *
   * @param e
   */
  ;

  _proto.process = function process(e) {
    // get the file from the input field
    var files = this.$('input').prop('files');
    var upload = this.attrs.upload;
    upload(files);
  }
  /**
   * Appends the file's link to the body of the composer.
   */
  ;

  _proto.success = function success() {
    var _this = this;

    console.log('success hit'); // Scroll the preview into view
    // We don't call this.textAreaObj.props.preview() because that would close the composer on mobile
    // Instead we just directly perform the same scrolling and skip the part about minimizing the composer

    if (flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.composer.component instanceof flarum_components_ReplyComposer__WEBPACK_IMPORTED_MODULE_5___default.a) {
      m.route.set(flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.route.discussion(flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.composer.component.props.discussion, 'reply'));
    }

    if (flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.composer.component instanceof flarum_components_EditPostComposer__WEBPACK_IMPORTED_MODULE_6___default.a) {
      m.route.set(flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.route.post(flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.composer.component.props.post));
    } // reset the button for a new upload


    setTimeout(function () {
      _this.$('form')[0].reset();

      _this.uploading(false);

      m.redraw();
    }, 1000);
  };

  return UploadButton;
}(flarum_Component__WEBPACK_IMPORTED_MODULE_2___default.a);



/***/ }),

/***/ "./src/forum/downloadButtonInteraction.js":
/*!************************************************!*\
  !*** ./src/forum/downloadButtonInteraction.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Post__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Post */ "flarum/components/Post");
/* harmony import */ var flarum_components_Post__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Post__WEBPACK_IMPORTED_MODULE_2__);



/* global $ */

/* harmony default export */ __webpack_exports__["default"] = (function () {
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_Post__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'config', function (isInitialized) {
    var _this = this;

    if (isInitialized) return;
    this.$('[data-fof-upload-download-uuid]').unbind('click').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.forum.attribute('fof-upload.canDownload')) {
        alert(flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.translator.trans('fof-upload.forum.states.unauthorized'));
        return;
      }

      var url = flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.forum.attribute('apiUrl') + '/fof/download';
      url += '/' + e.currentTarget.dataset.fofUploadDownloadUuid;
      url += '/' + _this.props.post.id();
      url += '/' + flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.session.csrfToken;
      window.open(url);
    });
  });
});

/***/ }),

/***/ "./src/forum/handler/Uploader.js":
/*!***************************************!*\
  !*** ./src/forum/handler/Uploader.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Uploader; });
var Uploader = /*#__PURE__*/function () {
  function Uploader() {
    this.callbacks = {
      'success': [],
      'failure': [],
      'uploading': [],
      'uploaded': []
    };
  }

  var _proto = Uploader.prototype;

  _proto.on = function on(type, callback) {
    this.callbacks[type].push(callback);
  };

  _proto.dispatch = function dispatch(type, response) {
    this.callbacks[type].forEach(function (callback) {
      return callback(response);
    });
  };

  _proto.upload = function upload(files) {
    this.dispatch('uploading', files);
    m.redraw(); // Forcing a redraw so that the button also updates if uploadFiles() is called from DragAndDrop or PasteClipboard

    var body = new FormData();

    for (var i = 0; i < files.length; i++) {
      body.append('files[]', files[i]);
    } // send a POST request to the api


    return app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/fof/upload',
      // prevent JSON.stringify'ing the form data in the XHR call
      serialize: function serialize(raw) {
        return raw;
      },
      body: body
    }).then(this.uploaded.bind(this));
  };

  _proto.uploaded = function uploaded(files) {
    var _this = this;

    files.forEach(function (file) {
      return _this.dispatch('success', file);
    });
    this.dispatch('uploaded');
  };

  return Uploader;
}();



/***/ }),

/***/ "./src/forum/index.js":
/*!****************************!*\
  !*** ./src/forum/index.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _downloadButtonInteraction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./downloadButtonInteraction */ "./src/forum/downloadButtonInteraction.js");
/* harmony import */ var _addUploadButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./addUploadButton */ "./src/forum/addUploadButton.js");



flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.initializers.add('fof-upload', function () {
  Object(_addUploadButton__WEBPACK_IMPORTED_MODULE_2__["default"])();
  Object(_downloadButtonInteraction__WEBPACK_IMPORTED_MODULE_1__["default"])();
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

/***/ "flarum/components/EditPostComposer":
/*!********************************************************************!*\
  !*** external "flarum.core.compat['components/EditPostComposer']" ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/EditPostComposer'];

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

/***/ "flarum/components/ReplyComposer":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['components/ReplyComposer']" ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/ReplyComposer'];

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

/***/ }),

/***/ "flarum/utils/Stream":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['utils/Stream']" ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/Stream'];

/***/ })

/******/ });
//# sourceMappingURL=forum.js.map