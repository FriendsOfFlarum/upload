"use strict";
(self["webpackChunkmodule_exports"] = self["webpackChunkmodule_exports"] || []).push([["common/components/UploadSharedFileModal"],{

/***/ "./src/common/components/UploadSharedFileModal.tsx"
/*!*********************************************************!*\
  !*** ./src/common/components/UploadSharedFileModal.tsx ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadSharedFileModal)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_FormModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/FormModal */ "flarum/common/components/FormModal");
/* harmony import */ var flarum_common_components_FormModal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_FormModal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Switch */ "flarum/common/components/Switch");
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mimeToIcon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../mimeToIcon */ "./src/common/mimeToIcon.ts");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5__);






class UploadSharedFileModal extends (flarum_common_components_FormModal__WEBPACK_IMPORTED_MODULE_2___default()) {
  constructor() {
    super(...arguments);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "files", []);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "fileInput", null);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "options", {
      shared: true,
      hidden: false
    });
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "loading", false);
  }
  oninit(vnode) {
    super.oninit(vnode);
  }
  className() {
    return 'UploadSharedFileModal Modal--medium';
  }
  title() {
    return flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.lib.upload-shared-file-modal.title');
  }
  onFileChange(e) {
    const target = e.target;
    if (target.files) {
      this.addFiles(Array.from(target.files));
    }
  }
  addFiles(newFiles) {
    this.files.push(...newFiles);
    m.redraw();
  }
  onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer && e.dataTransfer.files) {
      this.addFiles(Array.from(e.dataTransfer.files));
    }
  }
  onDropzoneClick() {
    if (this.fileInput) {
      this.fileInput.click();
    }
  }
  content() {
    return m("div", {
      className: "Modal-body"
    }, m("div", {
      className: "UploadSharedFileModal-dropzone",
      onclick: () => this.onDropzoneClick(),
      ondragover: this.onDragOver.bind(this),
      ondrop: this.onDrop.bind(this)
    }, flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.lib.upload-shared-file-modal.dropzone'), m("input", {
      type: "file",
      multiple: true,
      onchange: this.onFileChange.bind(this),
      style: {
        opacity: 0,
        position: 'absolute',
        left: '-9999px'
      },
      oncreate: vnode => {
        this.fileInput = vnode.dom;
      }
    })), m("div", {
      className: "UploadSharedFileModal-files"
    }, this.files.map(file => {
      const isImage = file.type.startsWith('image/');
      return m("div", {
        className: "UploadedFile"
      }, isImage ? m("img", {
        src: URL.createObjectURL(file),
        alt: file.name
      }) : m("i", {
        className: (0,_mimeToIcon__WEBPACK_IMPORTED_MODULE_4__["default"])(file.type)
      }), m("div", {
        className: "UploadedFile-name"
      }, file.name), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default()), {
        className: "Button Button--icon Button--link UploadedFile-remove",
        icon: "fas fa-times",
        onclick: () => {
          this.files = this.files.filter(f => f !== file);
        }
      }));
    })), m("div", {
      className: "UploadSharedFileModal-options Form-group"
    }, m((flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_3___default()), {
      state: this.options.hidden,
      onchange: value => this.options.hidden = value
    }, flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.lib.upload-shared-file-modal.hide-from-media-gallery'))), m("div", {
      className: "UploadSharedFileModal-submit App-primaryControl"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default()), {
      className: "Button Button--primary",
      loading: this.loading,
      onclick: this.upload.bind(this),
      disabled: !this.files.length || this.loading
    }, flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.lib.upload-shared-file-modal.upload'))));
  }
  async upload() {
    this.loading = true;
    m.redraw();
    const formData = new FormData();

    // Append each file to the form data
    this.files.forEach(file => {
      formData.append('files[]', file);
    });
    Object.keys(this.options).forEach(key => {
      formData.append("options[".concat(key, "]"), String(this.options[key]));
    });
    const results = await flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().request({
      method: 'POST',
      url: flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('apiUrl') + '/fof/upload',
      serialize: raw => raw,
      // Prevent mithril from trying to serialize FormData
      body: formData
    });
    const uploadedFiles = flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().store.pushPayload(results);
    this.attrs.onUploadComplete(uploadedFiles);
    this.files = [];
    this.hide();
    this.loading = false;
    m.redraw();
  }
}
flarum.reg.add('fof-upload', 'common/components/UploadSharedFileModal', UploadSharedFileModal);

/***/ }

}]);
//# sourceMappingURL=UploadSharedFileModal.js.map