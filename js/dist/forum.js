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
/*! exports provided: components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _src_forum__WEBPACK_IMPORTED_MODULE_0__["components"]; });



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

/***/ "./src/common/fileToBBcode.js":
/*!************************************!*\
  !*** ./src/common/fileToBBcode.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return fileToBBcode; });
function fileToBBcode(file) {
  switch (file.tag()) {
    // File
    case 'file':
      return "[upl-file uuid=" + file.uuid() + " size=" + file.humanSize() + "]" + file.baseName() + "[/upl-file]";
    // Image template

    case 'image':
      return "[upl-image uuid=" + file.uuid() + " size=" + file.humanSize() + " url=" + file.url() + "]" + file.baseName() + "[/upl-image]";
    // Image preview

    case 'image-preview':
      return "[upl-image-preview url=" + file.url() + "]";
    // 'just-url' or unknown

    default:
      return file.url();
  }
}

/***/ }),

/***/ "./src/common/mimeToIcon.js":
/*!**********************************!*\
  !*** ./src/common/mimeToIcon.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return mimeToIcon; });
var image = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];
var archive = ['application/zip', 'application/x-7z-compressed', 'application/gzip', 'application/vnd.rar', 'application/x-rar-compressed'];
var code = ['text/html', 'text/css', 'text/javascript', 'application/json', 'application/ld+json', 'text/javascript', 'application/x-httpd-php'];
var word = ['application/x-abiword', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
function mimeToIcon(fileType) {
  // Display image (do not display for)
  if (image.indexOf(fileType) >= 0) {
    return 'image';
  } // Display image icon for other types
  else if (fileType.includes('image/')) {
      return 'far fa-file-image';
    } // Video icon
    else if (fileType.includes('video/')) {
        return 'far fa-file-video';
      } // Archive icon
      else if (archive.indexOf(fileType) >= 0) {
          return 'far fa-file-archive';
        } // PDF icon
        else if (fileType === 'application/pdf') {
            return 'far fa-file-pdf';
          } // Word
          else if (word.indexOf(fileType) >= 0) {
              return 'far fa-file-word';
            } // Audio icon
            else if (fileType.includes('audio/')) {
                return 'far fa-file-audio';
              } // Code files
              else if (code.indexOf(fileType) >= 0) {
                  return 'far fa-file-code';
                }

  return 'far fa-file';
}

/***/ }),

/***/ "./src/common/models/File.js":
/*!***********************************!*\
  !*** ./src/common/models/File.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return File; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/Model */ "flarum/Model");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_Model__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/utils/mixin */ "flarum/utils/mixin");
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fileToBBcode__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../fileToBBcode */ "./src/common/fileToBBcode.js");





var File = /*#__PURE__*/function (_mixin) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(File, _mixin);

  function File() {
    return _mixin.apply(this, arguments) || this;
  }

  var _proto = File.prototype;

  /**
   * Use FoF Uploads endpoint
   */
  _proto.apiEndpoint = function apiEndpoint() {
    return '/fof/uploads' + (this.exists ? '/' + this.data.id : '');
  }
  /**
   * Generate bbcode for this file
   */
  ;

  _proto.bbcode = function bbcode() {
    return Object(_fileToBBcode__WEBPACK_IMPORTED_MODULE_3__["default"])(this);
  };

  return File;
}(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default()(flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a, {
  baseName: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('baseName'),
  path: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('path'),
  url: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('url'),
  type: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('type'),
  size: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('size'),
  humanSize: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('humanSize'),
  createdAt: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('createdAt'),
  uuid: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('uuid'),
  tag: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('tag')
}));



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
/* harmony import */ var _components_FileManagerButton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/FileManagerButton */ "./src/forum/components/FileManagerButton.js");








/* harmony default export */ __webpack_exports__["default"] = (function () {
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'oninit', function () {
    this.uploader = new _handler_Uploader__WEBPACK_IMPORTED_MODULE_6__["default"]();
  });
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'controlItems', function (items) {
    if (!flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.forum.attribute('fof-upload.canUpload')) return; // Add media button

    items.add('fof-upload-media', _components_FileManagerButton__WEBPACK_IMPORTED_MODULE_7__["default"].component({
      uploader: this.uploader
    })); // Add upload button

    items.add('fof-upload', _components_UploadButton__WEBPACK_IMPORTED_MODULE_3__["default"].component({
      uploader: this.uploader
    }));
  });
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'oncreate', function (f_, vnode) {
    var _this = this;

    if (!flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.forum.attribute('fof-upload.canUpload')) return;
    this.uploader.on('success', function (_ref) {
      var file = _ref.file,
          addBBcode = _ref.addBBcode;
      if (!addBBcode) return;

      _this.attrs.composer.editor.insertAtCursor(file.bbcode() + '\n'); // We wrap this in a typeof check to prevent it running when a user
      // is creating a new discussion. There's nothing to preview in a new
      // discussion, so the `preview` function isn't defined.


      if (typeof _this.attrs.preview === 'function') {
        // Scroll the preview into view
        // preview() causes the composer to close on mobile, but we don't want that. We want only the scroll
        // We work around that by temporarily patching the isFullScreen method
        var originalIsFullScreen = flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.composer.isFullScreen;

        flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.composer.isFullScreen = function () {
          return false;
        };

        _this.attrs.preview();

        flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.composer.isFullScreen = originalIsFullScreen;
      }
    });
    var dragAndDrop = new _components_DragAndDrop__WEBPACK_IMPORTED_MODULE_4__["default"](function (files) {
      return _this.uploader.upload(files);
    }, this.$().parents('.Composer')[0]);

    var unloadHandler = function unloadHandler() {
      dragAndDrop.unload();
    };

    this.$('textarea').bind('onunload', unloadHandler);
    new _components_PasteClipboard__WEBPACK_IMPORTED_MODULE_5__["default"](function (files) {
      return _this.uploader.upload(files);
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
    if (this.isNotFile(event)) {
      return;
    }

    event.preventDefault();
    this.upload(event.dataTransfer.files);
    this.composerElement.classList.remove('fof-upload-dragging');
  };

  return DragAndDrop;
}();



/***/ }),

/***/ "./src/forum/components/FileManagerButton.js":
/*!***************************************************!*\
  !*** ./src/forum/components/FileManagerButton.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return FileManagerButton; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/Component */ "flarum/Component");
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _FileManagerModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FileManagerModal */ "./src/forum/components/FileManagerModal.js");






var FileManagerButton = /*#__PURE__*/function (_Component) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(FileManagerButton, _Component);

  function FileManagerButton() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = FileManagerButton.prototype;

  _proto.view = function view() {
    return flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
      className: 'Button fof-upload-button Button--icon',
      onclick: this.fileManagerButtonClicked.bind(this),
      icon: 'fas fa-photo-video',
      title: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.forum.buttons.media')
    });
  }
  /**
   * Show tooltip on hover
   *
   * @param {*} vnode
   */
  ;

  _proto.oncreate = function oncreate(vnode) {
    _Component.prototype.oncreate.call(this, vnode); // Add tooltip


    this.$().tooltip();
  }
  /**
   * Event handler for upload button being clicked
   *
   * @param {PointerEvent} e
   */
  ;

  _proto.fileManagerButtonClicked = function fileManagerButtonClicked(e) {
    e.preventDefault(); // Open dialog

    flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.modal.show(_FileManagerModal__WEBPACK_IMPORTED_MODULE_4__["default"], {
      selectFile: true,
      uploader: this.attrs.uploader
    });
  };

  return FileManagerButton;
}(flarum_Component__WEBPACK_IMPORTED_MODULE_2___default.a);



/***/ }),

/***/ "./src/forum/components/FileManagerModal.js":
/*!**************************************************!*\
  !*** ./src/forum/components/FileManagerModal.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return FileManagerModal; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_components_Modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/Modal */ "flarum/components/Modal");
/* harmony import */ var flarum_components_Modal__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Modal__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _UploadButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./UploadButton */ "./src/forum/components/UploadButton.js");
/* harmony import */ var _UserFileList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./UserFileList */ "./src/forum/components/UserFileList.js");
/* harmony import */ var _DragAndDrop__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DragAndDrop */ "./src/forum/components/DragAndDrop.js");







var FileManagerModal = /*#__PURE__*/function (_Modal) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(FileManagerModal, _Modal);

  function FileManagerModal() {
    return _Modal.apply(this, arguments) || this;
  }

  var _proto = FileManagerModal.prototype;

  _proto.oninit = function oninit(vnode) {
    _Modal.prototype.oninit.call(this, vnode); // Initialize upload managers


    this.uploader = vnode.attrs.uploader; // Current selected files

    this.selectedFiles = []; // Allow multiselect

    this.multiSelect = vnode.attrs.multiSelect || true; // Drag & drop

    this.dragDrop = null; // Initialize uploads

    this.onUpload();
  };

  _proto.className = function className() {
    return 'Modal--large fof-file-manager-modal';
  }
  /**
   * Initialize drag & drop
   */
  ;

  _proto.oncreate = function oncreate(vnode) {
    var _this = this;

    _Modal.prototype.oncreate.call(this, vnode);

    this.dragDrop = new _DragAndDrop__WEBPACK_IMPORTED_MODULE_5__["default"](function (files) {
      return _this.uploader.upload(files, false);
    }, this.$().find('.Modal-content')[0]);
  }
  /**
   * Remove events from modal content
   */
  ;

  _proto.onremove = function onremove() {
    if (this.dragDrop) {
      this.dragDrop.unload();
    }
  };

  _proto.view = function view() {
    return m("div", {
      className: 'Modal modal-dialog ' + this.className()
    }, m("div", {
      className: "Modal-content"
    }, m("div", {
      className: "fof-modal-buttons App-backControl"
    }, _UploadButton__WEBPACK_IMPORTED_MODULE_3__["default"].component({
      uploader: this.uploader,
      disabled: app.fileListState.isLoading(),
      isMediaUploadButton: true
    })), m("div", {
      className: 'fof-drag-and-drop'
    }, m("div", {
      className: 'fof-drag-and-drop-release'
    }, m("i", {
      className: 'fas fa-cloud-upload-alt'
    }), app.translator.trans('fof-upload.forum.file_list.release_to_upload'))), m("div", {
      className: "Modal-header"
    }, m("h3", {
      className: "App-titleControl App-titleControl--text"
    }, app.translator.trans('fof-upload.forum.media_manager'))), this.alertAttrs ? m("div", {
      className: "Modal-alert"
    }, Alert.component(this.alertAttrs)) : '', m("div", {
      className: 'Modal-body'
    }, _UserFileList__WEBPACK_IMPORTED_MODULE_4__["default"].component({
      user: this.attrs.user,
      selectable: true,
      onFileSelect: this.onFileSelect.bind(this),
      selectedFiles: this.selectedFiles
    })), m("div", {
      className: 'Modal-footer'
    }, flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      onclick: this.hide.bind(this),
      className: 'Button'
    }, app.translator.trans('fof-upload.forum.buttons.cancel')), flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      onclick: this.onSelect.bind(this),
      disabled: this.selectedFiles.length === 0 || !this.multiSelect && this.selectedFiles.length > 1,
      className: 'Button Button--primary'
    }, app.translator.transChoice('fof-upload.forum.buttons.select_file', this.selectedFiles.length)))));
  }
  /**
   * Add or remove file from selected files
   *
   * @param {File} file
   */
  ;

  _proto.onFileSelect = function onFileSelect(file) {
    var itemPosition = this.selectedFiles.indexOf(file.id());

    if (itemPosition >= 0) {
      this.selectedFiles.splice(itemPosition, 1);
    } else {
      if (this.multiSelect) {
        this.selectedFiles.push(file.id());
      } else {
        this.selectedFiles = [file.id()];
      }
    }
  }
  /**
   * Add files to file list after upload
   */
  ;

  _proto.onUpload = function onUpload() {
    var _this2 = this;

    this.uploader.on('success', function (_ref) {
      var file = _ref.file;

      if (_this2.multiSelect) {
        _this2.selectedFiles.push(file.id());
      } else {
        _this2.selectedFiles = [file.id()];
      }
    });
  }
  /**
   * Add selected files to the composer
   */
  ;

  _proto.onSelect = function onSelect() {
    this.hide(); // Custom callback

    if (this.attrs.onSelect) {
      this.attrs.onSelect(this.selectedFiles);
      return;
    } // Add selected files to composer


    this.selectedFiles.map(function (fileId) {
      var file = app.store.getById('files', fileId);
      app.composer.editor.insertAtCursor(file.bbcode() + '\n');
    });
  };

  return FileManagerModal;
}(flarum_components_Modal__WEBPACK_IMPORTED_MODULE_1___default.a);



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
/* harmony import */ var flarum_utils_classList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/utils/classList */ "flarum/utils/classList");
/* harmony import */ var flarum_utils_classList__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_classList__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/LoadingIndicator */ "flarum/components/LoadingIndicator");
/* harmony import */ var flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_5__);







var UploadButton = /*#__PURE__*/function (_Component) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UploadButton, _Component);

  function UploadButton() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UploadButton.prototype;

  _proto.oninit = function oninit(vnode) {
    var _this = this;

    _Component.prototype.oninit.call(this, vnode);

    this.attrs.uploader.on('uploaded', function () {
      // reset the button for a new upload
      _this.$('form')[0].reset(); // redraw to reflect uploader.loading in the DOM


      m.redraw();
    });
    this.isMediaUploadButton = vnode.attrs.isMediaUploadButton || false;
  };

  _proto.oncreate = function oncreate(vnode) {
    _Component.prototype.oncreate.call(this, vnode); // Add tooltip


    if (!this.isMediaUploadButton) {
      this.$().tooltip();
    }
  };

  _proto.view = function view() {
    var buttonText = this.attrs.uploader.uploading ? flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.forum.states.loading') : flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-upload.forum.buttons.upload');
    return flarum_components_Button__WEBPACK_IMPORTED_MODULE_5___default.a.component({
      className: flarum_utils_classList__WEBPACK_IMPORTED_MODULE_3___default()(['Button', 'hasIcon', 'fof-upload-button', !this.isMediaUploadButton && !this.attrs.uploader.uploading && 'Button--icon', !this.isMediaUploadButton && !this.attrs.uploader.uploading && 'Button--link', this.attrs.uploader.uploading && 'uploading']),
      icon: !this.attrs.uploader.uploading && 'fas fa-file-upload',
      onclick: this.uploadButtonClicked.bind(this),
      title: !this.isMediaUploadButton ? buttonText : null,
      disabled: this.attrs.disabled
    }, [this.attrs.uploader.uploading && flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      size: 'tiny',
      className: 'LoadingIndicator--inline Button-icon'
    }), this.isMediaUploadButton || this.attrs.uploader.uploading ? m("span", {
      className: "Button-label"
    }, buttonText) : null, m("form", null, m("input", {
      type: "file",
      multiple: true,
      onchange: this.process.bind(this)
    }))]);
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

    if (files.length === 0) {
      // We've got no files to upload, so trying
      // to begin an upload will show an error
      // to the user.
      return;
    }

    this.attrs.uploader.upload(files, !this.isMediaUploadButton);
  }
  /**
   * Event handler for upload button being clicked
   *
   * @param {PointerEvent} e
   */
  ;

  _proto.uploadButtonClicked = function uploadButtonClicked(e) {
    // Trigger click on hidden input element
    // (Opens file dialog)
    this.$('input').click();
  };

  return UploadButton;
}(flarum_Component__WEBPACK_IMPORTED_MODULE_2___default.a);



/***/ }),

/***/ "./src/forum/components/UserFileList.js":
/*!**********************************************!*\
  !*** ./src/forum/components/UserFileList.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return UserFileList; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/Component */ "flarum/Component");
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/components/LoadingIndicator */ "flarum/components/LoadingIndicator");
/* harmony import */ var flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _common_mimeToIcon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../common/mimeToIcon */ "./src/common/mimeToIcon.js");






var UserFileList = /*#__PURE__*/function (_Component) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UserFileList, _Component);

  function UserFileList() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UserFileList.prototype;

  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode); // Load file list


    app.fileListState.setUser(vnode.attrs.user || app.session.user);
    this.inModal = vnode.attrs.selectable;
    this.restrictFileType = vnode.attrs.restrictFileType || null;
  };

  _proto.view = function view() {
    var _this = this;

    var state = app.fileListState;
    return m("div", {
      className: 'fof-upload-file-list'
    }, state.isLoading() && state.files.length === 0 && m("div", {
      className: 'fof-upload-loading'
    }, app.translator.trans('fof-upload.forum.file_list.loading'), m(flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default.a, null)), this.inModal && state.empty() && m("p", {
      className: 'fof-upload-empty'
    }, m("i", {
      className: 'fas fa-cloud-upload-alt fof-upload-empty-icon'
    }), app.translator.trans("fof-upload.forum.file_list.modal_empty_" + (app.screen() !== 'phone' ? 'desktop' : 'phone'))), !this.inModal && state.empty()(m("p", {
      className: 'fof-upload-empty'
    }, app.translator.trans('fof-upload.forum.file_list.empty'))), m("ul", null, state.files.map(function (file) {
      var fileClassNames = 'fof-file';
      var fileIcon = Object(_common_mimeToIcon__WEBPACK_IMPORTED_MODULE_4__["default"])(file.type());
      var fileSelectable = _this.restrictFileType ? _this.isSelectable(file) : true; // File is image

      if (fileIcon === 'image') {
        fileClassNames += ' fof-file-type-image';
      } // File is selected


      if (_this.attrs.selectedFiles && _this.attrs.selectedFiles.indexOf(file.id()) >= 0) {
        fileClassNames += ' fof-file-selected';
      }

      return m("li", null, m("button", {
        className: fileClassNames,
        onclick: _this.attrs.onFileSelect ? function () {
          return _this.attrs.onFileSelect(file);
        } : null,
        title: file.baseName(),
        disabled: !fileSelectable
      }, m("span", {
        className: 'fof-file-icon'
      }, m("i", {
        className: fileIcon !== 'image' ? fileIcon : 'far fa-file-image'
      })), fileIcon === 'image' && m("img", {
        src: file.url(),
        className: 'fof-file-image-preview'
      }), m("span", {
        className: 'fof-file-name'
      }, file.baseName())));
    })), state.hasMoreResults() && m("div", {
      className: 'fof-load-more-files'
    }, m(flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a, {
      className: 'Button Button--primary',
      disabled: state.isLoading(),
      loading: state.isLoading(),
      onclick: function onclick() {
        return state.loadMore();
      }
    }, app.translator.trans('fof-upload.forum.buttons.load_more_files'))));
  }
  /**
   * Check if a file is selectable
   *
   * @param {File} file
   */
  ;

  _proto.isSelectable = function isSelectable(file) {
    var fileType = file.type(); // Custom defined file types

    if (Array.isArray(this.restrictFileType)) {
      return this.restrictFileType.indexOf(fileType) >= 0;
    } // Image
    else if (this.restrictFileType === 'image') {
        return fileType.includes('image/');
      } // Audio
      else if (this.restrictFileType === 'audio') {
          return fileType.includes('audio/');
        } // Video
        else if (this.restrictFileType === 'video') {
            return fileType.includes('video/');
          }

    return false;
  };

  return UserFileList;
}(flarum_Component__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "./src/forum/components/index.js":
/*!***************************************!*\
  !*** ./src/forum/components/index.js ***!
  \***************************************/
/*! exports provided: components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
/* harmony import */ var _handler_Uploader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../handler/Uploader */ "./src/forum/handler/Uploader.js");
/* harmony import */ var _DragAndDrop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DragAndDrop */ "./src/forum/components/DragAndDrop.js");
/* harmony import */ var _FileManagerButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FileManagerButton */ "./src/forum/components/FileManagerButton.js");
/* harmony import */ var _FileManagerModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FileManagerModal */ "./src/forum/components/FileManagerModal.js");
/* harmony import */ var _UserFileList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./UserFileList */ "./src/forum/components/UserFileList.js");





var components = {
  DragAndDrop: _DragAndDrop__WEBPACK_IMPORTED_MODULE_1__["default"],
  FileManagerButton: _FileManagerButton__WEBPACK_IMPORTED_MODULE_2__["default"],
  FileManagerModal: _FileManagerModal__WEBPACK_IMPORTED_MODULE_3__["default"],
  UserFileList: _UserFileList__WEBPACK_IMPORTED_MODULE_4__["default"],
  Uploader: _handler_Uploader__WEBPACK_IMPORTED_MODULE_0__["default"]
};

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
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_Post__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'oncreate', function () {
    var _this = this;

    this.$('[data-fof-upload-download-uuid]').unbind('click').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.forum.attribute('fof-upload.canDownload')) {
        alert(flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.translator.trans('fof-upload.forum.states.unauthorized'));
        return;
      }

      var url = flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.forum.attribute('apiUrl') + '/fof/download';
      url += '/' + e.currentTarget.dataset.fofUploadDownloadUuid;
      url += '/' + _this.attrs.post.id();
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
      success: [],
      failure: [],
      uploading: [],
      uploaded: []
    };
    this.uploading = false;
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

  _proto.upload = function upload(files, addBBcode) {
    var _this = this;

    if (addBBcode === void 0) {
      addBBcode = true;
    }

    this.uploading = true;
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
    }).then(function (result) {
      return _this.uploaded(result, addBBcode);
    })["catch"](function (error) {
      _this.uploading = false;
      m.redraw();
      throw error;
    });
  };

  _proto.uploaded = function uploaded(result, addBBcode) {
    var _this2 = this;

    if (addBBcode === void 0) {
      addBBcode = false;
    }

    this.uploading = false;
    result.data.forEach(function (file) {
      var fileObj = app.store.pushObject(file); // Add file to media manager

      app.fileListState.addToList(fileObj); // Dispatch

      _this2.dispatch('success', {
        file: fileObj,
        addBBcode: addBBcode
      });
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
/*! exports provided: components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_models_File__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/models/File */ "./src/common/models/File.js");
/* harmony import */ var _states_FileListState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./states/FileListState */ "./src/forum/states/FileListState.js");
/* harmony import */ var _downloadButtonInteraction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./downloadButtonInteraction */ "./src/forum/downloadButtonInteraction.js");
/* harmony import */ var _addUploadButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./addUploadButton */ "./src/forum/addUploadButton.js");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components */ "./src/forum/components/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _components__WEBPACK_IMPORTED_MODULE_5__["components"]; });







flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.initializers.add('fof-upload', function () {
  Object(_addUploadButton__WEBPACK_IMPORTED_MODULE_4__["default"])();
  Object(_downloadButtonInteraction__WEBPACK_IMPORTED_MODULE_3__["default"])(); // File model

  flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.store.models.files = _common_models_File__WEBPACK_IMPORTED_MODULE_1__["default"]; // File list state

  flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.fileListState = new _states_FileListState__WEBPACK_IMPORTED_MODULE_2__["default"]();
});

/***/ }),

/***/ "./src/forum/states/FileListState.js":
/*!*******************************************!*\
  !*** ./src/forum/states/FileListState.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return FileListState; });
var FileListState = /*#__PURE__*/function () {
  function FileListState() {
    this.user = null;
    this.files = [];
    this.moreResults = false;
    this.loading = false;
  }
  /**
   * Set user and load list
   *
   * @param user A user to populate the media manager
   */


  var _proto = FileListState.prototype;

  _proto.setUser = function setUser(user) {
    // Keep previous state
    if (user === this.user) return; // Set user

    this.user = user; // Reset file list

    this.files = []; // Load user files

    this.loadResults();
  }
  /**
   * Load more user files
   *
   * @param offset The index to start the page at.
   */
  ;

  _proto.loadResults = function loadResults(offset) {
    if (offset === void 0) {
      offset = 0;
    }

    if (!this.user) return;
    this.loading = true;
    return app.store.find('fof/uploads', {
      filter: {
        user: this.user.id()
      },
      page: {
        offset: offset
      }
    }).then(this.parseResults.bind(this));
  }
  /**
   * Load the next page of discussion results.
   */
  ;

  _proto.loadMore = function loadMore() {
    this.loading = true;
    this.loadResults(this.files.length).then(this.parseResults.bind(this));
  }
  /**
   * Parse results and append them to the file list.
   */
  ;

  _proto.parseResults = function parseResults(results) {
    var _this$files;

    (_this$files = this.files).push.apply(_this$files, results);

    this.loading = false;
    this.moreResults = !!results.payload.links && !!results.payload.links.next;
    m.redraw();
    return results;
  }
  /**
   * Add files to the beginning of the list
   */
  ;

  _proto.addToList = function addToList(files) {
    if (Array.isArray(files)) {
      var _this$files2;

      (_this$files2 = this.files).unshift.apply(_this$files2, files);
    } else {
      this.files.unshift(files);
    }
  }
  /**
   * Are there any files in the list?
   */
  ;

  _proto.hasFiles = function hasFiles() {
    return this.files.length > 0;
  }
  /**
   * Is the file list loading?
   */
  ;

  _proto.isLoading = function isLoading() {
    return this.loading;
  }
  /**
   * Does this user has more files?
   */
  ;

  _proto.hasMoreResults = function hasMoreResults() {
    return this.moreResults;
  }
  /**
   * Does this user have any files?
   */
  ;

  _proto.empty = function empty() {
    return !this.hasFiles() && !this.isLoading();
  };

  return FileListState;
}();



/***/ }),

/***/ "flarum/Component":
/*!**************************************************!*\
  !*** external "flarum.core.compat['Component']" ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['Component'];

/***/ }),

/***/ "flarum/Model":
/*!**********************************************!*\
  !*** external "flarum.core.compat['Model']" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['Model'];

/***/ }),

/***/ "flarum/app":
/*!********************************************!*\
  !*** external "flarum.core.compat['app']" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['app'];

/***/ }),

/***/ "flarum/components/Button":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Button']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Button'];

/***/ }),

/***/ "flarum/components/LoadingIndicator":
/*!********************************************************************!*\
  !*** external "flarum.core.compat['components/LoadingIndicator']" ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/LoadingIndicator'];

/***/ }),

/***/ "flarum/components/Modal":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['components/Modal']" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Modal'];

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

/***/ "flarum/utils/classList":
/*!********************************************************!*\
  !*** external "flarum.core.compat['utils/classList']" ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/classList'];

/***/ }),

/***/ "flarum/utils/mixin":
/*!****************************************************!*\
  !*** external "flarum.core.compat['utils/mixin']" ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/mixin'];

/***/ })

/******/ });
//# sourceMappingURL=forum.js.map