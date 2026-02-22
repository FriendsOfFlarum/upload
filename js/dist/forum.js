/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./src/common/components/AbstractFIleList.tsx"
/*!****************************************************!*\
  !*** ./src/common/components/AbstractFIleList.tsx ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractFileList)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mimeToIcon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../mimeToIcon */ "./src/common/mimeToIcon.ts");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _DisplayFile__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./DisplayFile */ "./src/common/components/DisplayFile.tsx");
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/components/Alert */ "flarum/common/components/Alert");
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/common/utils/extractText */ "flarum/common/utils/extractText");
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/common/components/Icon */ "flarum/common/components/Icon");
/* harmony import */ var flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_10__);











class AbstractFileList extends (flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default()) {
  constructor() {
    super(...arguments);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "user", null);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "inModal", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "restrictFileType", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "downloadOnClick", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "filesBeingHidden", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "fileState", void 0);
  }
  oninit(vnode) {
    super.oninit(vnode);
    this.inModal = this.attrs.selectable;
    this.restrictFileType = this.attrs.restrictFileType || null;
    this.downloadOnClick = this.attrs.downloadOnClick || false;
    this.filesBeingHidden = [];
    this.fileState = this.attrs.fileState;
    this.loadFileList();
  }
  view() {
    return m("div", {
      className: "SharedFileList fof-upload-file-list",
      "aria-live": "polite"
    }, this.isLoading() && this.fileCollection().length === 0 && m("div", {
      className: 'fof-upload-loading'
    }, flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.lib.file_list.loading'), m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default()), null)), !this.isLoading() && this.fileCollection().length === 0 && m("div", {
      className: "Placeholder"
    }, m("p", {
      className: "fof-upload-empty"
    }, flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.lib.file_list.empty'))), m("ul", null, this.fileCollection().map(file => {
      var _file$id, _file$id2;
      const fileIcon = (0,_mimeToIcon__WEBPACK_IMPORTED_MODULE_4__["default"])(file.type());
      const fileSelectable = this.restrictFileType ? this.isSelectable(file) : true;
      const fileClassNames = flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5___default()(['fof-file',
      // File is image
      fileIcon === 'far fa-file-image' && 'fof-file-type-image',
      // File is selected
      this.attrs.selectedFiles && this.attrs.selectedFiles.indexOf((_file$id = file.id()) != null ? _file$id : '') >= 0 && 'fof-file-selected']);
      const isFileHiding = this.filesBeingHidden.includes(file.uuid());
      return m("li", {
        "aria-busy": isFileHiding,
        key: file.uuid()
      }, m(_DisplayFile__WEBPACK_IMPORTED_MODULE_7__["default"], {
        file: file,
        fileSelectable: fileSelectable,
        isSelected: this.attrs.selectedFiles && this.attrs.selectedFiles.indexOf((_file$id2 = file.id()) != null ? _file$id2 : '') >= 0,
        fileClassNames: fileClassNames,
        isFileHiding: isFileHiding,
        onHide: this.hideFile.bind(this),
        onFileClick: this.onFileClick.bind(this),
        user: this.attrs.user,
        onDelete: this.onDelete.bind(this)
      }));
    })), this.hasMoreResults() && m("div", {
      className: 'fof-load-more-files'
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_6___default()), {
      className: 'Button Button--primary',
      disabled: this.isLoading(),
      loading: this.isLoading(),
      onclick: () => this.loadMore()
    }, flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.lib.file_list.load_more_files_btn'))));
  }
  onDelete(file) {
    if (this.attrs.onDelete) {
      this.attrs.onDelete(file);
    }
  }

  // Common methods like onFileClick, isSelectable, hideFile...

  onFileClick(file) {
    // Custom functionality
    if (this.attrs.onFileSelect) {
      this.attrs.onFileSelect(file);
      return;
    }

    // Download on click
    if (this.attrs.downloadOnClick) {
      window.open(file.url());
      return;
    }
  }
  isSelectable(file) {
    const fileType = file.type();

    // Custom defined file types
    if (Array.isArray(this.restrictFileType)) {
      return this.restrictFileType.indexOf(fileType) >= 0;
    }

    // Image
    else if (this.restrictFileType === 'image') {
      return fileType.includes('image/');
    }

    // Audio
    else if (this.restrictFileType === 'audio') {
      return fileType.includes('audio/');
    }

    // Video
    else if (this.restrictFileType === 'video') {
      return fileType.includes('video/');
    }
    return false;
  }

  /**
   * Begins the hiding process for a file.
   *
   * - Shows a native confirmation dialog
   * - If confirmed, sends AJAX request to the hide file API
   */
  async hideFile(file) {
    const uuid = file.uuid();
    if (this.filesBeingHidden.includes(uuid)) return;
    this.filesBeingHidden.push(uuid);
    const transPrefix = file.isShared() ? 'fof-upload.lib.file_list.hide_shared_file' : 'fof-upload.lib.file_list.hide_file';
    const confirmToggleHide = confirm(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_9___default()(flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans(file.hidden() ? "".concat(transPrefix, ".show_confirmation") : "".concat(transPrefix, ".hide_confirmation"), {
      fileName: file.baseName()
    })));
    if (confirmToggleHide) {
      try {
        const filePayload = await flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().request({
          method: 'PATCH',
          url: "".concat(flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('apiUrl'), "/fof/upload/hide"),
          body: {
            uuid
          }
        });
        flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().store.pushPayload(filePayload);
        m.redraw();
        flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().alerts.show((flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_8___default()), {
          type: 'success'
        }, [m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_10___default()), {
          name: file.hidden() ? 'fas fa-eye-slash' : 'fas fa-eye'
        }), ' ', flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans(file != null && file.hidden() ? "".concat(transPrefix, ".hide_success") : "".concat(transPrefix, ".show_success"))]);
        if (this.fileState.user) {
          const index = this.fileState.files.findIndex(file => uuid === file.uuid());
          this.fileState.files.splice(index, 1);
        }
      } catch (error) {
        flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().alerts.show((flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_8___default()), {
          type: 'error'
        }, flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans(file != null && file.hidden() ? "".concat(transPrefix, ".hide_fail") : "".concat(transPrefix, ".show_fail"), {
          fileName: file.baseName()
        }));
      } finally {
        // Remove file from hiding list
        const i = this.filesBeingHidden.indexOf(uuid);
        this.filesBeingHidden.splice(i, 1);
      }
    }
  }
}
flarum.reg.add('fof-upload', 'common/components/AbstractFIleList', AbstractFileList);

/***/ },

/***/ "./src/common/components/DisplayFile.tsx"
/*!***********************************************!*\
  !*** ./src/common/components/DisplayFile.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DisplayFile)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Icon */ "flarum/common/components/Icon");
/* harmony import */ var flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _mimeToIcon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../mimeToIcon */ "./src/common/mimeToIcon.ts");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/components/Tooltip */ "flarum/common/components/Tooltip");
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/common/utils/extractText */ "flarum/common/utils/extractText");
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_9__);










class DisplayFile extends (flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default()) {
  constructor() {
    super(...arguments);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isFileHiding", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "imageLoaded", true);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "file", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "fileIcon", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isSelected", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isSelectable", void 0);
    // Function to call when image fails to load
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "handleImageError", () => {
      this.imageLoaded = false;
      this.fileIcon = 'fas fa-exclamation-triangle';
      this.isSelectable = false;
      m.redraw();
    });
    // Function to call when image loads successfully
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "handleImageLoad", () => {
      this.imageLoaded = true;
      m.redraw();
    });
  }
  oninit(vnode) {
    super.oninit(vnode);
    this.file = this.attrs.file;
    this.isFileHiding = this.attrs.isFileHiding === undefined ? false : this.attrs.isFileHiding;
    this.fileIcon = (0,_mimeToIcon__WEBPACK_IMPORTED_MODULE_6__["default"])(this.file.type());
    this.isSelected = this.attrs.isSelected === undefined ? false : this.attrs.isSelected;
    this.isSelectable = this.attrs.fileSelectable === undefined ? true : this.attrs.fileSelectable;
  }
  onbeforeupdate(vnode) {
    super.onbeforeupdate(vnode);

    // Make sure the isSelected property is updated
    this.isSelected = this.attrs.isSelected === undefined ? false : this.attrs.isSelected;
  }
  view() {
    const isImage = this.file.type().startsWith('image/');
    const fileSelectedClass = this.isSelected ? 'selected' : '';
    return m("div", {
      className: "UploadedFile ".concat(fileSelectedClass),
      key: this.file.uuid(),
      onclick: () => {
        if (this.isSelectable && !this.isFileHiding) {
          this.isSelected = !this.isSelected;
          this.attrs.onFileClick(this.file);
        }
      },
      disabled: !this.isSelectable || this.isFileHiding
    }, this.imageLoaded && isImage ? m("img", {
      src: this.file.url(),
      className: "fof-file-image-preview",
      draggable: false,
      onerror: this.handleImageError,
      onload: this.handleImageLoad,
      alt: this.file.baseName()
    }) : this.displayIcon(this.fileIcon), m("div", {
      className: "fof-file-actions"
    }, this.actionItems(this.file).toArray()), m("div", {
      className: "fof-file-name"
    }, m((flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_8___default()), {
      text: this.file.baseName()
    }, m("span", null, this.file.baseName()))), this.isFileHiding && m("div", {
      class: "fof-file-loading",
      role: "status",
      "aria-label": flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.lib.file_list.hide_file.loading')
    }, m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default()), null)));
  }
  displayIcon(fileIcon) {
    return m("span", {
      className: "fof-file-icon",
      role: "presentation",
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%' // Ensure the container takes up the necessary space
      }
    }, m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_5___default()), {
      name: "fa-fw ".concat(fileIcon)
    }));
  }
  actionItems(file) {
    const items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_7___default())();
    file.canViewInfo() && items.add('view-info', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--icon fof-file-action",
      icon: "fas fa-info-circle",
      "aria-label": "info",
      onclick: () => this.viewFileInfo()
    }), 100);
    const transPrefix = file.isShared() ? 'fof-upload.lib.file_list.hide_shared_file' : 'fof-upload.lib.file_list.hide_file';
    const hideTranslation = flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans(this.file.hidden() ? "".concat(transPrefix, ".btn_a11y_label_show") : "".concat(transPrefix, ".btn_a11y_label_hide"), {
      fileName: file.baseName()
    });
    file.canHide() && items.add('hide-file', m((flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_8___default()), {
      text: hideTranslation,
      position: "bottom"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--icon fof-file-action",
      icon: this.file.hidden() ? 'fas fa-eye' : 'fas fa-eye-slash',
      "aria-label": hideTranslation,
      disabled: this.isFileHiding,
      onclick: e => this.hide(e)
    })), 80);
    const deleteTranslation = flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.lib.file_list.delete_file_a11y_label', {
      fileName: file.baseName()
    });
    file.canDelete() && items.add('delete-file', m((flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_8___default()), {
      text: deleteTranslation,
      position: "bottom"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--icon fof-file-action",
      icon: "fas fa-trash",
      "aria-label": deleteTranslation,
      disabled: this.isFileHiding,
      onclick: e => this.confirmDelete(e)
    })), 60);
    return items;
  }
  viewFileInfo() {
    console.log('view file info');
  }
  hide(e) {
    e.stopPropagation();

    // TODO: local logic, then:

    if (this.attrs.onHide) {
      this.attrs.onHide(this.file);
    }
  }
  async confirmDelete(e) {
    e.stopPropagation();
    if (confirm(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_9___default()(flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.lib.file_list.delete_confirmation', {
      fileName: this.file.baseName()
    })))) {
      const uuid = this.file.uuid();
      await flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().request({
        method: 'DELETE',
        url: flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('apiUrl') + '/fof/upload/delete/' + uuid
      });
      if (this.attrs.onDelete) {
        this.attrs.onDelete(this.file);
      }
    }
  }
}
flarum.reg.add('fof-upload', 'common/components/DisplayFile', DisplayFile);

/***/ },

/***/ "./src/common/components/SharedFileList.tsx"
/*!**************************************************!*\
  !*** ./src/common/components/SharedFileList.tsx ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SharedFileList)
/* harmony export */ });
/* harmony import */ var _AbstractFIleList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractFIleList */ "./src/common/components/AbstractFIleList.tsx");

class SharedFileList extends _AbstractFIleList__WEBPACK_IMPORTED_MODULE_0__["default"] {
  loadFileList() {
    this.fileState.loadResults();
  }
  hasMoreResults() {
    return this.fileState.hasMoreResults();
  }
  loadMore() {
    this.fileState.loadMore();
  }
  isLoading() {
    return this.fileState.isLoading();
  }
  fileCollection() {
    return this.fileState.files;
  }
}
flarum.reg.add('fof-upload', 'common/components/SharedFileList', SharedFileList);

/***/ },

/***/ "./src/common/components/UserFileList.tsx"
/*!************************************************!*\
  !*** ./src/common/components/UserFileList.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UserFileList)
/* harmony export */ });
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AbstractFIleList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractFIleList */ "./src/common/components/AbstractFIleList.tsx");


class UserFileList extends _AbstractFIleList__WEBPACK_IMPORTED_MODULE_1__["default"] {
  loadFileList() {
    var _this$attrs$user;
    //app.fileListState.setUser(this.attrs.user || app.session.user);
    this.fileState.setUser((_this$attrs$user = this.attrs.user) != null ? _this$attrs$user : (flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default().session).user);
    /**
     * The user who's media we are dealing with
     */
    this.user = this.fileState.user; //app.fileListState.user;
  }
  hasMoreResults() {
    return this.fileState.hasMoreResults();
  }
  loadMore() {
    this.fileState.loadMore();
  }
  isLoading() {
    return this.fileState.isLoading();
  }
  fileCollection() {
    return this.fileState.files;
  }
}
flarum.reg.add('fof-upload', 'common/components/UserFileList', UserFileList);

/***/ },

/***/ "./src/common/extend.ts"
/*!******************************!*\
  !*** ./src/common/extend.ts ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extenders */ "flarum/common/extenders");
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_File__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/File */ "./src/common/models/File.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0___default().Store)() //
.add('files', _models_File__WEBPACK_IMPORTED_MODULE_1__["default"]).add('shared-files', _models_File__WEBPACK_IMPORTED_MODULE_1__["default"])]);

/***/ },

/***/ "./src/common/mimeToIcon.ts"
/*!**********************************!*\
  !*** ./src/common/mimeToIcon.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mimeToIcon)
/* harmony export */ });
const mimeToIconMap = new Map([
// Image formats
['image/png', 'far fa-file-image'], ['image/jpg', 'far fa-file-image'], ['image/jpeg', 'far fa-file-image'], ['image/svg+xml', 'far fa-file-image'], ['image/gif', 'far fa-file-image'], ['image/bmp', 'far fa-file-image'], ['image/webp', 'far fa-file-image'],
// Compressed file formats
['application/zip', 'far fa-file-archive'], ['application/x-7z-compressed', 'far fa-file-archive'], ['application/gzip', 'far fa-file-archive'], ['application/vnd.rar', 'far fa-file-archive'], ['application/x-rar-compressed', 'far fa-file-archive'], ['application/x-tar', 'far fa-file-archive'], ['application/x-iso9660-image', 'far fa-file-archive'],
// Text and code file formats
['text/plain', 'far fa-file-alt'], ['text/csv', 'far fa-file-csv'], ['text/xml', 'far fa-file-code'], ['text/html', 'far fa-file-code'], ['text/css', 'far fa-file-code'], ['text/javascript', 'far fa-file-code'], ['application/json', 'far fa-file-code'], ['application/ld+json', 'far fa-file-code'], ['application/x-httpd-php', 'far fa-file-code'], ['application/xml', 'far fa-file-code'], ['text/xml', 'far fa-file-code'],
// Document formats
['application/x-abiword', 'far fa-file-word'], ['application/msword', 'far fa-file-word'], ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'far fa-file-word'], ['application/vnd.oasis.opendocument.text', 'far fa-file-word'], ['application/vnd.ms-excel', 'far fa-file-excel'], ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'far fa-file-excel'], ['application/vnd.oasis.opendocument.spreadsheet', 'far fa-file-excel'], ['application/vnd.ms-powerpoint', 'far fa-file-powerpoint'], ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'far fa-file-powerpoint'], ['application/vnd.oasis.opendocument.presentation', 'far fa-file-powerpoint'], ['application/pdf', 'far fa-file-pdf'], ['application/rtf', 'far fa-file-alt'],
// eBook formats
['application/epub+zip', 'far fa-book'], ['application/x-mobipocket-ebook', 'far fa-book'], ['application/vnd.amazon.ebook', 'far fa-book'],
// Audio formats
['audio/mpeg', 'far fa-file-audio'], ['audio/wav', 'far fa-file-audio'], ['audio/x-wav', 'far fa-file-audio'], ['audio/aac', 'far fa-file-audio'], ['audio/ogg', 'far fa-file-audio'], ['audio/flac', 'far fa-file-audio'], ['audio/aiff', 'far fa-file-audio'], ['audio/x-aiff', 'far fa-file-audio'],
// Video formats
['video/x-msvideo', 'far fa-file-video'], ['video/mp4', 'far fa-file-video'], ['video/quicktime', 'far fa-file-video']]);
function mimeToIcon(fileType) {
  // Directly return the icon if the fileType is in the map
  return mimeToIconMap.get(fileType) || function () {
    // Check for generic types
    if (fileType.startsWith('image/')) {
      return 'far fa-file-image';
    } else if (fileType.startsWith('video/')) {
      return 'far fa-file-video';
    } else if (fileType.startsWith('audio/')) {
      return 'far fa-file-audio';
    }

    // Default icon
    return 'far fa-file';
  }();
}
flarum.reg.add('fof-upload', 'common/mimeToIcon', mimeToIcon);

/***/ },

/***/ "./src/common/models/File.ts"
/*!***********************************!*\
  !*** ./src/common/models/File.ts ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ File)
/* harmony export */ });
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_0__);

class File extends (flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default()) {
  baseName() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('baseName').call(this);
  }
  path() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('path').call(this);
  }
  url() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('url').call(this);
  }
  size() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('size').call(this);
  }
  type() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('type').call(this);
  }
  humanSize() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('humanSize').call(this);
  }
  createdAt() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('createdAt', (flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().transformDate)).call(this);
  }
  uuid() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('uuid').call(this);
  }
  tag() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('tag').call(this);
  }
  hidden() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('hidden').call(this);
  }
  bbcode() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('bbcode').call(this);
  }
  isShared() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('shared').call(this);
  }
  isPrivateShared() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('isPrivateShared').call(this);
  }
  canViewInfo() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('canViewInfo').call(this);
  }
  canHide() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('canHide').call(this);
  }
  canDelete() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('canDelete').call(this);
  }
  apiEndpoint() {
    return '/fof/uploads' + (this.exists ? '/' + this.id() : '');
  }
}
flarum.reg.add('fof-upload', 'common/models/File', File);

/***/ },

/***/ "./src/common/states/FileListState.ts"
/*!********************************************!*\
  !*** ./src/common/states/FileListState.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FileListState)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_1__);


class FileListState {
  constructor(sharedFiles) {
    if (sharedFiles === void 0) {
      sharedFiles = false;
    }
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "user", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "files", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "moreResults", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "loading", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "sharedFiles", void 0);
    this.user = null;
    this.files = [];
    this.moreResults = false;
    this.loading = false;
    this.sharedFiles = sharedFiles;
  }

  /**
   * Set the user and load their file list.
   * @param user The user whose files to load.
   */
  setUser(user) {
    if (user === this.user) return;
    this.user = user;
    this.files = [];
    this.loadResults();
  }
  refresh() {
    this.files = [];
    this.loadResults();
    m.redraw();
  }

  /**
   * Load more files for the current user, starting from the given offset.
   * @param offset The starting index for loading more files.
   * @returns A promise resolving to the loaded files.
   */
  async loadResults(offset) {
    if (offset === void 0) {
      offset = 0;
    }
    if (!this.sharedFiles && !this.user) return Promise.reject('User not set');
    this.loading = true;
    if (this.sharedFiles && this.files.length > 0 && offset === 0) {
      this.loading = false;
      return Promise.resolve(this.files);
    }
    let route = 'fof/uploads';
    let params = {};
    if (!this.sharedFiles && this.user) {
      params = {
        filter: {
          user: this.user.id()
        },
        page: {
          offset
        }
      };
    } else {
      route = 'fof/upload/shared-files';
      params = {
        page: {
          offset
        }
      };
    }
    const results = await flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().store.find(route, params);
    return this.parseResults(results);
  }

  /**
   * Load the next set of results.
   */
  async loadMore() {
    this.loading = true;
    return this.loadResults(this.files.length);
  }
  parseResults(results) {
    var _payload;
    this.files = this.files.concat(results);
    this.loading = false;
    this.moreResults = !!(results != null && (_payload = results.payload) != null && (_payload = _payload.links) != null && _payload.next);
    m.redraw();
    return results;
  }

  /**
   * Add files to the beginning of the list.
   * @param files The files to be added.
   */
  addToList(files) {
    if (Array.isArray(files)) {
      this.files.unshift(...files);
    } else {
      this.files.unshift(files);
    }
    m.redraw();
  }

  /**
   * Remove files from the list.
   * @param files The files to be removed.
   */
  removeFromList(files) {
    if (Array.isArray(files)) {
      this.files = this.files.filter(file => !files.includes(file));
    } else {
      this.files = this.files.filter(file => file !== files);
    }
    m.redraw();
  }

  /**
   * Check if there are files in the list.
   * @returns True if there are files, false otherwise.
   */
  hasFiles() {
    return this.files.length > 0;
  }

  /**
   * Check if the file list is currently loading.
   * @returns True if loading, false otherwise.
   */
  isLoading() {
    return this.loading;
  }

  /**
   * Check if there are more files to load.
   * @returns True if there are more files, false otherwise.
   */
  hasMoreResults() {
    return this.moreResults;
  }

  /**
   * Check if the user has no files and the list is not loading.
   * @returns True if the list is empty and not loading, false otherwise.
   */
  empty() {
    return !this.hasFiles() && !this.isLoading();
  }
}
flarum.reg.add('fof-upload', 'common/states/FileListState', FileListState);

/***/ },

/***/ "./src/forum/addUploadButton.ts"
/*!**************************************!*\
  !*** ./src/forum/addUploadButton.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addUploadButton)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_UploadButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/UploadButton */ "./src/forum/components/UploadButton.tsx");
/* harmony import */ var _components_DragAndDrop__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/DragAndDrop */ "./src/forum/components/DragAndDrop.ts");
/* harmony import */ var _components_PasteClipboard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/PasteClipboard */ "./src/forum/components/PasteClipboard.ts");
/* harmony import */ var _handler_Uploader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./handler/Uploader */ "./src/forum/handler/Uploader.ts");
/* harmony import */ var _components_FileManagerButton__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/FileManagerButton */ "./src/forum/components/FileManagerButton.tsx");
/* harmony import */ var flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/components/TextEditor */ "flarum/common/components/TextEditor");
/* harmony import */ var flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_7__);








function addUploadButton() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_7___default().prototype), 'oninit', function () {
    this.uploader = new _handler_Uploader__WEBPACK_IMPORTED_MODULE_5__["default"]();
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_7___default().prototype), 'controlItems', function (items) {
    if (!flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('fof-upload.canUpload')) return;
    const composerButtonVisiblity = flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('fof-upload.composerButtonVisiblity');
    if (composerButtonVisiblity === 'both' || composerButtonVisiblity === 'media-btn') {
      items.add('fof-upload-media', _components_FileManagerButton__WEBPACK_IMPORTED_MODULE_6__["default"].component({
        uploader: this.uploader
      }));
    }
    if (composerButtonVisiblity === 'both' || composerButtonVisiblity === 'upload-btn') {
      items.add('fof-upload', _components_UploadButton__WEBPACK_IMPORTED_MODULE_2__["default"].component({
        uploader: this.uploader
      }));
    }
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_7___default().prototype), 'oncreate', function () {
    var _fofUploadDragAndDrop, _ref;
    if (!flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('fof-upload.canUpload')) return;
    this.uploader.on('success', response => {
      const {
        file,
        addBBcode
      } = response;
      if (!addBBcode) return;
      this.attrs.composer.editor.insertAtCursor(file.bbcode() + '\n', false);
      if (typeof this.attrs.preview === 'function') {
        const originalIsFullScreen = (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().composer).isFullScreen;
        (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().composer).isFullScreen = () => false;
        this.attrs.preview();
        (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().composer).isFullScreen = originalIsFullScreen;
      }
    });
    const dragAndDropTarget = (_fofUploadDragAndDrop = (_ref = this).fofUploadDragAndDropTarget) == null ? void 0 : _fofUploadDragAndDrop.call(_ref);
    if (dragAndDropTarget) {
      this.dragAndDrop = new _components_DragAndDrop__WEBPACK_IMPORTED_MODULE_3__["default"](files => this.uploader.upload(files), dragAndDropTarget);
    }
    const editorEl = this.$('.TextEditor-editor')[0];
    if (editorEl) {
      new _components_PasteClipboard__WEBPACK_IMPORTED_MODULE_4__["default"](files => this.uploader.upload(files), editorEl);
    }
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_7___default().prototype), 'onremove', function () {
    if (!flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('fof-upload.canUpload')) return;
    if (this.dragAndDrop) {
      this.dragAndDrop.unload();
    }
  });
  (flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_7___default().prototype).fofUploadDragAndDropTarget = function () {
    return this.$().parents('.Composer')[0];
  };
}

/***/ },

/***/ "./src/forum/addUserPageButton.tsx"
/*!*****************************************!*\
  !*** ./src/forum/addUserPageButton.tsx ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addUserPageButton)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/UserPage */ "flarum/forum/components/UserPage");
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__);




function addUserPageButton() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'navItems', function (items) {
    const canUpload = !!flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('fof-upload.canUpload');
    const user = this.user;
    const hasUploads = !!(user != null && user.uploadCountCurrent());
    const sessionUser = (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session).user;
    if (!this.user || !sessionUser) return;
    if (sessionUser.viewOthersMediaLibrary() || this.user === sessionUser && (canUpload || hasUploads)) {
      var _user$uploadCountCurr;
      const uploadCount = (_user$uploadCountCurr = user == null ? void 0 : user.uploadCountCurrent()) != null ? _user$uploadCountCurr : 0;
      items.add('uploads', flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default().component({
        href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('user.uploads', {
          username: this.user.slug()
        }),
        name: 'uploads',
        icon: 'fas fa-file-upload'
      }, [this.user === sessionUser ? flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.forum.buttons.media') : flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.forum.buttons.user_uploads'), ' ', uploadCount > 0 ? m("span", {
        className: "Button-badge"
      }, uploadCount) : null]), 80);
    }
  });
}

/***/ },

/***/ "./src/forum/components/DragAndDrop.ts"
/*!*********************************************!*\
  !*** ./src/forum/components/DragAndDrop.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DragAndDrop)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");

class DragAndDrop {
  constructor(upload, composerElement) {
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "upload", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "composerElement", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "over", false);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "handlers", {});
    this.upload = upload;
    this.composerElement = composerElement;
    if (!this.supportsFileDragging()) {
      return;
    }
    this.composerElement.addEventListener('dragover', this.handlers.in = this.in.bind(this));
    this.composerElement.addEventListener('dragleave', this.handlers.out = this.out.bind(this));
    this.composerElement.addEventListener('dragend', this.handlers.out);
    this.composerElement.addEventListener('drop', this.handlers.dropping = this.dropping.bind(this));
  }
  supportsFileDragging() {
    const div = document.createElement('div');
    return ('draggable' in div || 'ondragstart' in div && 'ondrop' in div) && 'FormData' in window && 'FileReader' in window;
  }
  unload() {
    if (!this.handlers.in) {
      return;
    }
    this.composerElement.removeEventListener('dragover', this.handlers.in);
    this.composerElement.removeEventListener('dragleave', this.handlers.out);
    this.composerElement.removeEventListener('dragend', this.handlers.out);
    this.composerElement.removeEventListener('drop', this.handlers.dropping);
  }
  isNotFile(event) {
    var _event$dataTransfer;
    if ((_event$dataTransfer = event.dataTransfer) != null && _event$dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind !== 'file') {
          return true;
        }
      }
    }
    return false;
  }
  in(event) {
    if (this.isNotFile(event)) {
      return;
    }
    event.preventDefault();
    if (!this.over) {
      this.composerElement.classList.add('fof-upload-dragging');
      this.over = true;
    }
  }
  out(event) {
    if (this.isNotFile(event)) {
      return;
    }
    event.preventDefault();
    if (this.over) {
      this.composerElement.classList.remove('fof-upload-dragging');
      this.over = false;
    }
  }
  dropping(event) {
    var _event$dataTransfer2;
    if (this.isNotFile(event) || !((_event$dataTransfer2 = event.dataTransfer) != null && _event$dataTransfer2.files)) {
      return;
    }
    event.preventDefault();
    this.upload(event.dataTransfer.files);
    this.composerElement.classList.remove('fof-upload-dragging');
  }
}
flarum.reg.add('fof-upload', 'forum/components/DragAndDrop', DragAndDrop);

/***/ },

/***/ "./src/forum/components/FileManagerButton.tsx"
/*!****************************************************!*\
  !*** ./src/forum/components/FileManagerButton.tsx ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FileManagerButton)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _FileManagerModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FileManagerModal */ "./src/forum/components/FileManagerModal.tsx");
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Tooltip */ "flarum/common/components/Tooltip");
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_4__);





class FileManagerButton extends (flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()) {
  view() {
    return m((flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_4___default()), {
      text: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.forum.buttons.media')
    }, flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default().component({
      className: 'Button fof-upload-button Button--icon',
      onclick: this.fileManagerButtonClicked.bind(this),
      icon: 'fas fa-photo-video'
    }));
  }

  /**
   * Event handler for upload button being clicked
   */
  fileManagerButtonClicked(e) {
    e.preventDefault();

    // Note: FileManagerModal is imported synchronously to avoid chunk ID collision
    // with Flarum core's ReplyComposer (both would get webpack chunk ID 378).
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().modal.show(_FileManagerModal__WEBPACK_IMPORTED_MODULE_3__["default"], {
      uploader: this.attrs.uploader
    });
  }
}
flarum.reg.add('fof-upload', 'forum/components/FileManagerButton', FileManagerButton);

/***/ },

/***/ "./src/forum/components/FileManagerModal.tsx"
/*!***************************************************!*\
  !*** ./src/forum/components/FileManagerModal.tsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FileManagerModal)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Alert */ "flarum/common/components/Alert");
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _UploadButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./UploadButton */ "./src/forum/components/UploadButton.tsx");
/* harmony import */ var _common_components_UserFileList__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../common/components/UserFileList */ "./src/common/components/UserFileList.tsx");
/* harmony import */ var _DragAndDrop__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./DragAndDrop */ "./src/forum/components/DragAndDrop.ts");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _common_components_SharedFileList__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../common/components/SharedFileList */ "./src/common/components/SharedFileList.tsx");
/* harmony import */ var _common_states_FileListState__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../common/states/FileListState */ "./src/common/states/FileListState.ts");











class FileManagerModal extends (flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2___default()) {
  constructor() {
    super(...arguments);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "uploader", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "selectedFiles", []);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "multiSelect", true);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "restrictFileType", null);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "dragDrop", null);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "selectedFilesLibrary", 'user');
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "userFileState", void 0);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "sharedFileState", void 0);
  }
  oninit(vnode) {
    super.oninit(vnode);
    this.uploader = vnode.attrs.uploader;
    this.selectedFiles = [];
    this.multiSelect = vnode.attrs.multiSelect === undefined ? true : vnode.attrs.multiSelect;
    this.restrictFileType = vnode.attrs.restrictFileType || null;
    this.dragDrop = null;
    this.selectedFilesLibrary = vnode.attrs.defaultFilesLibrary || 'user';
    this.userFileState = new _common_states_FileListState__WEBPACK_IMPORTED_MODULE_10__["default"]();
    this.sharedFileState = new _common_states_FileListState__WEBPACK_IMPORTED_MODULE_10__["default"](true);
    this.uploader.setState(this.userFileState);
    this.onUpload();
  }
  className() {
    return 'Modal--large fof-file-manager-modal';
  }
  title() {
    return '';
  }
  content() {
    return null;
  }
  oncreate(vnode) {
    super.oncreate(vnode);
    this.dragDrop = new _DragAndDrop__WEBPACK_IMPORTED_MODULE_7__["default"](files => this.uploader.upload(files, false), this.$().find('.Modal-content')[0]);
  }
  onremove() {
    if (this.dragDrop) {
      this.dragDrop.unload();
    }
  }
  view() {
    const fileCount = this.selectedFiles.length;
    const {
      hideUser,
      hideShared
    } = this.attrs;
    return m("div", {
      className: "Modal modal-dialog ".concat(this.className())
    }, m("div", {
      className: "Modal-content"
    }, m("div", {
      className: "fof-modal-buttons App-backControl"
    }, !hideUser && this.selectedFilesLibrary === 'user' && m(_UploadButton__WEBPACK_IMPORTED_MODULE_5__["default"], {
      uploader: this.uploader,
      disabled: this.userFileState.isLoading(),
      isMediaUploadButton: true
    }), (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user && flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session.user.uploadSharedFiles() && !hideShared && this.selectedFilesLibrary === 'shared' && m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button",
      icon: "fas fa-file-upload",
      onclick: () => {
        this.showUploadModal();
      }
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.buttons.upload'))), m("div", {
      className: "fof-drag-and-drop"
    }, m("div", {
      className: "fof-drag-and-drop-release"
    }, m("i", {
      className: "fas fa-cloud-upload-alt"
    }), flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.lib.file_list.release_to_upload'))), m("div", {
      className: "Modal-header"
    }, m("h3", {
      className: "App-titleControl App-titleControl--text"
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.media_manager')), (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user && flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session.user.accessSharedFiles() && !hideUser && !hideShared && m("div", {
      className: "LibrarySelection"
    }, this.fileLibraryButtonItems().toArray())), this.alertAttrs && m("div", {
      className: "Modal-alert"
    }, m((flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_4___default()), this.alertAttrs)), m("div", {
      className: "Modal-body"
    }, this.selectedFilesLibrary === 'user' && this.userFilesContent(), this.selectedFilesLibrary === 'shared' && this.sharedFilesContent()), m("div", {
      className: "Modal-footer"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      onclick: this.hide.bind(this),
      className: "Button"
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.buttons.cancel')), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      onclick: this.onSelect.bind(this),
      disabled: this.selectedFiles.length === 0 || !this.multiSelect && this.selectedFiles.length > 1,
      className: "Button Button--primary"
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.lib.file_list.confirm_selection_btn', {
      fileCount
    })))));
  }
  fileLibraryButtonItems() {
    const items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_8___default())();
    items.add('user', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button Button--flat ".concat(this.selectedFilesLibrary === 'user' ? 'active' : ''),
      onclick: () => this.setLibrary('user')
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.buttons.media')));
    items.add('shared', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button Button--flat ".concat(this.selectedFilesLibrary === 'shared' ? 'active' : ''),
      onclick: () => this.setLibrary('shared')
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.buttons.shared_media')));
    return items;
  }
  setLibrary(library) {
    this.selectedFilesLibrary = library;
    m.redraw();
  }
  userFilesContent() {
    return m(_common_components_UserFileList__WEBPACK_IMPORTED_MODULE_6__["default"], {
      user: this.attrs.user,
      selectable: true,
      onFileSelect: this.onFileSelect.bind(this),
      selectedFiles: this.selectedFiles,
      restrictFileType: this.restrictFileType,
      fileState: this.userFileState,
      onDelete: this.onDelete.bind(this)
    });
  }
  sharedFilesContent() {
    return m(_common_components_SharedFileList__WEBPACK_IMPORTED_MODULE_9__["default"], {
      selectable: true,
      onFileSelect: this.onFileSelect.bind(this),
      selectedFiles: this.selectedFiles,
      restrictFileType: this.restrictFileType,
      user: this.attrs.user,
      fileState: this.sharedFileState,
      onDelete: this.onDelete.bind(this)
    });
  }
  onFileSelect(file) {
    const fileId = file.id();
    if (!fileId) return;
    const itemPosition = this.selectedFiles.indexOf(fileId);
    if (itemPosition >= 0) {
      this.selectedFiles.splice(itemPosition, 1);
    } else {
      if (this.multiSelect) {
        this.selectedFiles.push(fileId);
      } else {
        this.selectedFiles = [fileId];
      }
    }
  }
  onUpload() {
    this.uploader.on('success', response => {
      const {
        file
      } = response;
      const fileId = file.id();
      if (fileId) {
        if (this.multiSelect) {
          this.selectedFiles.push(fileId);
        } else {
          this.selectedFiles = [fileId];
        }
      }
    });
  }
  onSelect() {
    this.hide();
    if (this.attrs.onSelect) {
      this.attrs.onSelect(this.selectedFiles);
      return;
    }
    this.selectedFiles.forEach(fileId => {
      const file = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().store.getById('files', fileId) || flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().store.getById('shared-files', fileId);
      if (file && typeof file.bbcode === 'function' && (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().composer).editor) {
        flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().composer.editor.insertAtCursor(file.bbcode() + '\n', false);
      }
    });
  }
  showUploadModal() {
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show(() => __webpack_require__.e(/*! import() | common/components/UploadSharedFileModal */ "common/components/UploadSharedFileModal").then(__webpack_require__.bind(__webpack_require__, /*! ../../common/components/UploadSharedFileModal */ "./src/common/components/UploadSharedFileModal.tsx")), {
      onUploadComplete: files => {
        this.sharedFileState.addToList(files);
      }
    }, true);
  }
  onDelete(file) {
    this.sharedFileState.removeFromList(file);
    this.userFileState.removeFromList(file);
  }
}
flarum.reg.add('fof-upload', 'forum/components/FileManagerModal', FileManagerModal);flarum.reg.addChunkModule('common/components/UploadSharedFileModal', './src/common/components/UploadSharedFileModal.tsx', 'fof-upload', 'common/components/UploadSharedFileModal');

/***/ },

/***/ "./src/forum/components/PasteClipboard.ts"
/*!************************************************!*\
  !*** ./src/forum/components/PasteClipboard.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PasteClipboard)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");

class PasteClipboard {
  constructor(upload, element) {
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "upload", void 0);
    this.upload = upload;
    element.addEventListener('paste', this.paste.bind(this));
  }
  paste(e) {
    var _e$clipboardData;
    if ((_e$clipboardData = e.clipboardData) != null && _e$clipboardData.items) {
      const items = e.clipboardData.items;
      const files = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }
      if (files.length > 0) {
        e.preventDefault();
        this.upload(files);
      }
    }
  }
}
flarum.reg.add('fof-upload', 'forum/components/PasteClipboard', PasteClipboard);

/***/ },

/***/ "./src/forum/components/UploadButton.tsx"
/*!***********************************************!*\
  !*** ./src/forum/components/UploadButton.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadButton)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_TextEditorButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/TextEditorButton */ "flarum/common/components/TextEditorButton");
/* harmony import */ var flarum_common_components_TextEditorButton__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_TextEditorButton__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5__);






class UploadButton extends (flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default()) {
  constructor() {
    super(...arguments);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isMediaUploadButton", false);
  }
  oninit(vnode) {
    var _vnode$attrs$isMediaU;
    super.oninit(vnode);
    this.attrs.uploader.on('uploaded', () => {
      const form = this.$('form')[0];
      if (form) {
        form.reset();
      }
      m.redraw();
    });
    this.isMediaUploadButton = (_vnode$attrs$isMediaU = vnode.attrs.isMediaUploadButton) != null ? _vnode$attrs$isMediaU : false;
  }
  view() {
    const buttonText = this.attrs.uploader.uploading ? flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.states.loading') : flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.buttons.upload');
    return m((flarum_common_components_TextEditorButton__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5___default()(['Button', 'hasIcon', 'fof-upload-button', !this.isMediaUploadButton && !this.attrs.uploader.uploading && 'Button--icon', !this.isMediaUploadButton && !this.attrs.uploader.uploading && 'Button--link', this.attrs.uploader.uploading && 'uploading']),
      icon: !this.attrs.uploader.uploading && 'fas fa-file-upload',
      onclick: this.uploadButtonClicked.bind(this),
      disabled: this.attrs.disabled,
      title: buttonText
    }, this.attrs.uploader.uploading && m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4___default()), {
      size: "small",
      display: "inline",
      className: "Button-icon"
    }), (this.isMediaUploadButton || this.attrs.uploader.uploading) && m("span", {
      className: "Button-label"
    }, buttonText), m("form", null, m("input", {
      type: "file",
      multiple: true,
      onchange: this.process.bind(this)
    })));
  }
  process(_e) {
    const files = this.$('input').prop('files');
    if (!files || files.length === 0) {
      return;
    }
    this.attrs.uploader.upload(files, !this.isMediaUploadButton);
  }
  uploadButtonClicked(_e) {
    this.$('input').click();
  }
}
flarum.reg.add('fof-upload', 'forum/components/UploadButton', UploadButton);

/***/ },

/***/ "./src/forum/downloadButtonInteraction.ts"
/*!************************************************!*\
  !*** ./src/forum/downloadButtonInteraction.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ downloadButtonInteraction)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_Post__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/Post */ "flarum/forum/components/Post");
/* harmony import */ var flarum_forum_components_Post__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_Post__WEBPACK_IMPORTED_MODULE_2__);



function downloadButtonInteraction() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_Post__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'oncreate', function () {
    this.$('[data-fof-upload-download-uuid]').unbind('click').on('click', e => {
      var _this$attrs$post$id;
      e.preventDefault();
      e.stopPropagation();
      if (!flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('fof-upload.canDownload')) {
        alert(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.forum.states.unauthorized'));
        return;
      }
      const target = e.currentTarget;
      let url = flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('apiUrl') + '/fof/download';
      url += '/' + encodeURIComponent(target.dataset.fofUploadDownloadUuid || '');
      url += '/' + encodeURIComponent((_this$attrs$post$id = this.attrs.post.id()) != null ? _this$attrs$post$id : '');
      url += '/' + encodeURIComponent((flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session).csrfToken);
      window.open(url);
    });
  });
}

/***/ },

/***/ "./src/forum/extend.ts"
/*!*****************************!*\
  !*** ./src/forum/extend.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/extend */ "./src/common/extend.ts");
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extenders */ "flarum/common/extenders");
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1__);


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([..._common_extend__WEBPACK_IMPORTED_MODULE_0__["default"], new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1___default().Routes)() //
.add('user.uploads', '/u/:username/uploads', () => __webpack_require__.e(/*! import() | forum/components/UploadsUserPage */ "forum/components/UploadsUserPage").then(__webpack_require__.bind(__webpack_require__, /*! ./components/UploadsUserPage */ "./src/forum/components/UploadsUserPage.tsx")))]);flarum.reg.addChunkModule('forum/components/UploadsUserPage', './src/forum/components/UploadsUserPage.tsx', 'fof-upload', 'forum/components/UploadsUserPage');

/***/ },

/***/ "./src/forum/handler/Uploader.ts"
/*!***************************************!*\
  !*** ./src/forum/handler/Uploader.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Uploader)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);


class Uploader {
  constructor() {
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "callbacks", {
      success: [],
      failure: [],
      uploading: [],
      uploaded: []
    });
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "uploading", false);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "fileState", void 0);
  }
  setState(fileState) {
    this.fileState = fileState;
  }
  on(type, callback) {
    this.callbacks[type].push(callback);
  }
  dispatch(type, response) {
    this.callbacks[type].forEach(callback => callback(response));
  }
  upload(files, addBBcode) {
    if (addBBcode === void 0) {
      addBBcode = true;
    }
    this.uploading = true;
    this.dispatch('uploading', files);
    m.redraw();
    const body = new FormData();
    const fileArray = Array.from(files);
    for (let i = 0; i < fileArray.length; i++) {
      body.append('files[]', fileArray[i]);
    }
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().request({
      method: 'POST',
      url: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('apiUrl') + '/fof/upload',
      serialize: raw => raw,
      body
    }).then(result => this.uploaded(result, addBBcode)).catch(error => {
      var _error$response, _e$code;
      this.uploading = false;
      m.redraw();
      const e = (_error$response = error.response) == null || (_error$response = _error$response.errors) == null ? void 0 : _error$response[0];
      if (!(e != null && (_e$code = e.code) != null && _e$code.includes('fof-upload'))) {
        throw error;
      }
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().alerts.clear();
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().alerts.show({
        type: 'error'
      }, e.detail);
    });
  }
  uploaded(result, addBBcode) {
    if (addBBcode === void 0) {
      addBBcode = false;
    }
    this.uploading = false;
    result.data.forEach(file => {
      var _this$fileState;
      const fileObj = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().store.pushObject(file);
      (_this$fileState = this.fileState) == null || _this$fileState.addToList(fileObj);
      this.dispatch('success', {
        file: fileObj,
        addBBcode
      });
    });
    this.dispatch('uploaded');
  }
}
flarum.reg.add('fof-upload', 'forum/handler/Uploader', Uploader);

/***/ },

/***/ "./src/forum/index.ts"
/*!****************************!*\
  !*** ./src/forum/index.ts ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extend: () => (/* reexport safe */ _extend__WEBPACK_IMPORTED_MODULE_6__["default"])
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/models/User */ "flarum/common/models/User");
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _downloadButtonInteraction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./downloadButtonInteraction */ "./src/forum/downloadButtonInteraction.ts");
/* harmony import */ var _addUploadButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./addUploadButton */ "./src/forum/addUploadButton.ts");
/* harmony import */ var _addUserPageButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./addUserPageButton */ "./src/forum/addUserPageButton.tsx");
/* harmony import */ var _extend__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./extend */ "./src/forum/extend.ts");







flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('fof-upload', () => {
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1___default().prototype).viewOthersMediaLibrary = flarum_common_Model__WEBPACK_IMPORTED_MODULE_2___default().attribute('fof-upload-viewOthersMediaLibrary');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1___default().prototype).deleteOthersMediaLibrary = flarum_common_Model__WEBPACK_IMPORTED_MODULE_2___default().attribute('fof-upload-deleteOthersMediaLibrary');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1___default().prototype).uploadCountCurrent = flarum_common_Model__WEBPACK_IMPORTED_MODULE_2___default().attribute('fof-upload-uploadCountCurrent');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1___default().prototype).uploadCountAll = flarum_common_Model__WEBPACK_IMPORTED_MODULE_2___default().attribute('fof-upload-uploadCountAll');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1___default().prototype).uploadSharedFiles = flarum_common_Model__WEBPACK_IMPORTED_MODULE_2___default().attribute('fof-upload-uploadSharedFiles');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1___default().prototype).accessSharedFiles = flarum_common_Model__WEBPACK_IMPORTED_MODULE_2___default().attribute('fof-upload-accessSharedFiles');
  (0,_addUploadButton__WEBPACK_IMPORTED_MODULE_4__["default"])();
  (0,_downloadButtonInteraction__WEBPACK_IMPORTED_MODULE_3__["default"])();
  (0,_addUserPageButton__WEBPACK_IMPORTED_MODULE_5__["default"])();
});

/***/ },

/***/ "flarum/common/Component"
/*!*************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/Component')" ***!
  \*************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/Component');

/***/ },

/***/ "flarum/common/Model"
/*!*********************************************************!*\
  !*** external "flarum.reg.get('core', 'common/Model')" ***!
  \*********************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/Model');

/***/ },

/***/ "flarum/common/app"
/*!*******************************************************!*\
  !*** external "flarum.reg.get('core', 'common/app')" ***!
  \*******************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/app');

/***/ },

/***/ "flarum/common/components/Alert"
/*!********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Alert')" ***!
  \********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Alert');

/***/ },

/***/ "flarum/common/components/Button"
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Button')" ***!
  \*********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Button');

/***/ },

/***/ "flarum/common/components/FormModal"
/*!************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/FormModal')" ***!
  \************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/FormModal');

/***/ },

/***/ "flarum/common/components/Icon"
/*!*******************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Icon')" ***!
  \*******************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Icon');

/***/ },

/***/ "flarum/common/components/LinkButton"
/*!*************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/LinkButton')" ***!
  \*************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/LinkButton');

/***/ },

/***/ "flarum/common/components/LoadingIndicator"
/*!*******************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/LoadingIndicator')" ***!
  \*******************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/LoadingIndicator');

/***/ },

/***/ "flarum/common/components/Modal"
/*!********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Modal')" ***!
  \********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Modal');

/***/ },

/***/ "flarum/common/components/Switch"
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Switch')" ***!
  \*********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Switch');

/***/ },

/***/ "flarum/common/components/TextEditor"
/*!*************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/TextEditor')" ***!
  \*************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/TextEditor');

/***/ },

/***/ "flarum/common/components/TextEditorButton"
/*!*******************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/TextEditorButton')" ***!
  \*******************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/TextEditorButton');

/***/ },

/***/ "flarum/common/components/Tooltip"
/*!**********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Tooltip')" ***!
  \**********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Tooltip');

/***/ },

/***/ "flarum/common/extend"
/*!**********************************************************!*\
  !*** external "flarum.reg.get('core', 'common/extend')" ***!
  \**********************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/extend');

/***/ },

/***/ "flarum/common/extenders"
/*!*************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/extenders')" ***!
  \*************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/extenders');

/***/ },

/***/ "flarum/common/models/User"
/*!***************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/models/User')" ***!
  \***************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/models/User');

/***/ },

/***/ "flarum/common/utils/ItemList"
/*!******************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/utils/ItemList')" ***!
  \******************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/utils/ItemList');

/***/ },

/***/ "flarum/common/utils/classList"
/*!*******************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/utils/classList')" ***!
  \*******************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/utils/classList');

/***/ },

/***/ "flarum/common/utils/extractText"
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/utils/extractText')" ***!
  \*********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/utils/extractText');

/***/ },

/***/ "flarum/forum/app"
/*!******************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/app')" ***!
  \******************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'forum/app');

/***/ },

/***/ "flarum/forum/components/Post"
/*!******************************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/components/Post')" ***!
  \******************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'forum/components/Post');

/***/ },

/***/ "flarum/forum/components/UserPage"
/*!**********************************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/components/UserPage')" ***!
  \**********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'forum/components/UserPage');

/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js"
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _defineProperty)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperty(e, r, t) {
  return (r = (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js"
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPrimitive)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");

function toPrimitive(t, r) {
  if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js"
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPropertyKey)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js");


function toPropertyKey(t) {
  var i = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(t, "string");
  return "symbol" == (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i) ? i : i + "";
}


/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js"
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		flarum.reg._webpack_runtimes["fof-upload"] ||= __webpack_require__;// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "module.exports:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	__webpack_require__.f.compat = (chunkId, promises) => {
/******/ 	
/******/ 		const originalLoadChunk = __webpack_require__.l;
/******/ 		__webpack_require__.l = flarum.reg.loadChunk.bind(flarum.reg, originalLoadChunk);
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"forum": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkmodule_exports"] = self["webpackChunkmodule_exports"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./forum.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extend: () => (/* reexport safe */ _src_forum__WEBPACK_IMPORTED_MODULE_0__.extend)
/* harmony export */ });
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.ts");

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map