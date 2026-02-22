/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/components/SharedUploadPage.tsx"
/*!***************************************************!*\
  !*** ./src/admin/components/SharedUploadPage.tsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SharedUploadPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_admin_components_AdminPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/admin/components/AdminPage */ "flarum/admin/components/AdminPage");
/* harmony import */ var flarum_admin_components_AdminPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_AdminPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _common_components_SharedFileList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../common/components/SharedFileList */ "./src/common/components/SharedFileList.tsx");
/* harmony import */ var _common_states_FileListState__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../common/states/FileListState */ "./src/common/states/FileListState.ts");







class SharedUploadPage extends (flarum_admin_components_AdminPage__WEBPACK_IMPORTED_MODULE_2___default()) {
  constructor() {
    super(...arguments);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "sharedUploads", []);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "currentPage", 1);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "fileState", void 0);
  }
  oninit(vnode) {
    super.oninit(vnode);
    this.fileState = new _common_states_FileListState__WEBPACK_IMPORTED_MODULE_6__["default"](true);
  }
  headerInfo() {
    return {
      className: 'SharedUploadPage--header',
      icon: 'fas fa-file-upload',
      title: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.shared-uploads.title'),
      description: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.shared-uploads.description')
    };
  }
  content() {
    return m("div", {
      className: "SharedUploadPage--content"
    }, m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.shared-uploads.introduction')), m("hr", null), m("div", {
      className: "SharedUploadPage--main-actions"
    }, this.mainActionItems().toArray()), m("hr", null), m("div", {
      className: "SharedUploadPage--uploads"
    }, m(_common_components_SharedFileList__WEBPACK_IMPORTED_MODULE_5__["default"], {
      user: (flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().session).user,
      selectable: false,
      fileState: this.fileState,
      onDelete: this.onDelete.bind(this)
    })));
  }
  showUploadModal() {
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show(() => __webpack_require__.e(/*! import() | common/components/UploadSharedFileModal */ "common/components/UploadSharedFileModal").then(__webpack_require__.bind(__webpack_require__, /*! ../../common/components/UploadSharedFileModal */ "./src/common/components/UploadSharedFileModal.tsx")), {
      onUploadComplete: files => {
        this.uploadComplete(files);
      }
    });
  }
  mainActionItems() {
    const items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4___default())();
    items.add('refresh', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button Button--icon",
      icon: "fas fa-sync",
      onclick: () => this.refresh()
    }));
    items.add('upload-new', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button",
      icon: "fas fa-upload",
      onclick: () => this.showUploadModal()
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.shared-uploads.upload-new-button')));
    return items;
  }
  fileActionItems(file) {
    const items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4___default())();
    return items;
  }
  uploadComplete(files) {
    console.log('upload complete', files);
    this.fileState.addToList(files);
  }
  refresh() {
    this.fileState.refresh();
  }
  onDelete(file) {
    this.fileState.removeFromList(file);
  }
}
flarum.reg.add('fof-upload', 'admin/components/SharedUploadPage', SharedUploadPage);flarum.reg.addChunkModule('common/components/UploadSharedFileModal', './src/common/components/UploadSharedFileModal.tsx', 'fof-upload', 'common/components/UploadSharedFileModal');

/***/ },

/***/ "./src/admin/components/UploadImageButton.ts"
/*!***************************************************!*\
  !*** ./src/admin/components/UploadImageButton.ts ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadImageButton)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/UploadImageButton */ "flarum/common/components/UploadImageButton");
/* harmony import */ var flarum_common_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_2__);



class UploadImageButton extends (flarum_common_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_2___default()) {
  constructor() {
    super(...arguments);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "attrs", void 0);
  }
  resourceUrl() {
    var _this$attrs$path;
    return flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('apiUrl') + '/' + ((_this$attrs$path = this.attrs.path) != null ? _this$attrs$path : 'fof/watermark');
  }
}
flarum.reg.add('fof-upload', 'admin/components/UploadImageButton', UploadImageButton);

/***/ },

/***/ "./src/admin/components/UploadPage.tsx"
/*!*********************************************!*\
  !*** ./src/admin/components/UploadPage.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/admin/utils/saveSettings */ "flarum/admin/utils/saveSettings");
/* harmony import */ var flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Alert */ "flarum/common/components/Alert");
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Select */ "flarum/common/components/Select");
/* harmony import */ var flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/Switch */ "flarum/common/components/Switch");
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/components/Placeholder */ "flarum/common/components/Placeholder");
/* harmony import */ var flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _UploadImageButton__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./UploadImageButton */ "./src/admin/components/UploadImageButton.ts");
/* harmony import */ var flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/common/utils/withAttr */ "flarum/common/utils/withAttr");
/* harmony import */ var flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! flarum/admin/components/ExtensionPage */ "flarum/admin/components/ExtensionPage");
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! flarum/common/components/Icon */ "flarum/common/components/Icon");
/* harmony import */ var flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../index */ "./src/admin/index.ts");

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }















/**
 * Convert a human-readable permission label into a URL-safe slug.
 *
 * Steps:
 *  1. NFD-normalize so accented chars (ä, ö, ü, ñ, …) decompose into
 *     base letter + combining mark.
 *  2. Strip the combining marks (Unicode category Mn).
 *  3. Lowercase the result.
 *  4. Replace any run of non-alphanumeric characters with a single dash.
 *  5. Trim leading/trailing dashes.
 *
 * Examples:
 *   "Images"          → "images"
 *   "Bilder (Größen)" → "bilder-grossen"   (ö→o, ß→ss via NFD doesn't work for ß,
 *                                            see note below)
 *   "Vidéos & More"   → "videos-more"
 *
 * Note: ß does not decompose under NFD; it becomes "ss" only under NFKD-like
 * mappings that browsers don't expose. We handle it with an explicit replacement
 * before normalizing.
 */
function slugify(value) {
  return value.replace(/ß/g, 'ss').normalize('NFD').replace(/(?:[\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0897-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B55\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0D81\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABD\u1ABF-\u1ADD\u1AE0-\u1AEB\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDD69-\uDD6D\uDEAB\uDEAC\uDEFA-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF40\uDF66-\uDF6C\uDF70-\uDF74\uDFBB-\uDFC0\uDFCE\uDFD0\uDFD2\uDFE1\uDFE2]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB3-\uDCB8\uDCBA\uDCBF\uDCC0\uDCC2\uDCC3\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD3B\uDD3C\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99\uDF60\uDF62-\uDF64\uDF66]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40\uDF42\uDF5A]|\uD80D[\uDC40\uDC47-\uDC55]|\uD818[\uDD1E-\uDD29\uDD2D-\uDD2F]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD67-\uDD69\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF\uDDEE\uDDEF\uDEE3\uDEE6\uDEEE\uDEEF\uDEF5]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uDB40[\uDD00-\uDDEF])/g, '') // strip combining marks (diacritics)
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
class UploadPage extends (flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_11___default()) {
  constructor() {
    super(...arguments);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "loading", false);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "successAlert", null);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "uploadS3SetByEnv", false);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "uploadLocalCdnSetByEnv", false);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "settingsPrefix", 'fof-upload');
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "fields", []);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "checkboxes", []);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "objects", []);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "uploadMethodOptions", {});
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "templateOptions", {});
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "values", {});
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "defaultAdap", 'local');
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "watermarkPositions", {});
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "composerButtonVisiblityOptions", {});
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "newMimeType", void 0);
  }
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = false;
    this.uploadS3SetByEnv = !!(flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).uploadS3SetByEnv;
    this.uploadLocalCdnSetByEnv = !!(flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).uploadLocalCdnSetByEnv;
    this.fields = ['resizeMaxWidth', 'cdnUrl', 'maxFileSize', 'whitelistedClientExtensions', 'composerButtonVisiblity', 'watermark', 'watermarkPosition', 'imgurClientId', 'awsS3Key', 'awsS3Secret', 'awsS3Bucket', 'awsS3Region', 'awsS3Endpoint', 'awsS3ACL', 'awsS3CustomUrl', 'qiniuKey', 'qiniuSecret', 'qiniuBucket'];
    this.checkboxes = ['mustResize', 'addsWatermarks', 'disableHotlinkProtection', 'disableDownloadLogging', 'awsS3UsePathStyleEndpoint', 'svgAnimateAllowed'];
    this.objects = ['mimeTypes'];
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
    };
    this.composerButtonVisiblityOptions = {
      both: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.composer_buttons.options.both'),
      'upload-btn': flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.composer_buttons.options.upload-btn'),
      'media-btn': flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.composer_buttons.options.media-btn')
    };
    const settings = (flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).settings;
    const rawMethods = settings[this.addPrefix('availableUploadMethods')];
    const rawTemplates = settings[this.addPrefix('availableTemplates')];
    this.uploadMethodOptions = typeof rawMethods === 'object' && rawMethods !== null ? rawMethods : typeof rawMethods === 'string' ? JSON.parse(rawMethods || '{}') : {};
    this.templateOptions = typeof rawTemplates === 'object' && rawTemplates !== null ? rawTemplates : typeof rawTemplates === 'string' ? JSON.parse(rawTemplates || '{}') : {};
    this.fields.forEach(key => this.values[key] = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_10___default()(settings[this.addPrefix(key)]));
    this.checkboxes.forEach(key => this.values[key] = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_10___default()(settings[this.addPrefix(key)] === '1'));
    this.objects.forEach(key => {
      const val = settings[this.addPrefix(key)];
      this.values[key] = val ? flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_10___default()(JSON.parse(val)) : flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_10___default()();
    });
    this.defaultAdap = Object.keys(this.uploadMethodOptions)[Object.keys(this.uploadMethodOptions).length - 1] || 'local';
    if (!this.values.mimeTypes() || Object.keys(this.values.mimeTypes()).length === 0) {
      this.values.mimeTypes = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_10___default()({
        '^image\\/(jpeg|png|gif|webp|avif|bmp|tiff|svg\\+xml)$': {
          adapter: this.defaultAdap,
          template: 'image-preview',
          permission_label: 'Images',
          permission_slug: 'images'
        }
      });
    }
    this.newMimeType = {
      regex: flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_10___default()(''),
      adapter: flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_10___default()(this.defaultAdap),
      template: flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_10___default()('file'),
      permission_label: flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_10___default()('')
    };
  }
  content(vnode) {
    var _this$values$maxFileS, _this$values$resizeMa, _this$values$whitelis, _this$values$cdnUrl;
    const maxPost = (flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).settings[this.addPrefix('php_ini.post_max_size')];
    const maxUpload = (flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).settings[this.addPrefix('php_ini.upload_max_filesize')];
    return m("div", {
      className: "UploadPage"
    }, m("div", {
      className: "UploadPage-container container"
    }, m("form", {
      className: "Form",
      onsubmit: e => {
        e.preventDefault();
        this.onsubmit(e);
      }
    }, m("div", {
      className: "Form-body"
    }, m("fieldset", {
      className: "Form-group"
    }, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.preferences.title')), m("div", {
      className: "Form-group"
    }, m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.preferences.max_file_size')), m("input", {
      className: "FormControl",
      type: "number",
      min: "0",
      value: (_this$values$maxFileS = this.values.maxFileSize()) != null ? _this$values$maxFileS : '',
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.maxFileSize)
    }), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.preferences.php_ini_values', {
      post: maxPost,
      upload: maxUpload
    }))), m("div", {
      className: "Form-group"
    }, m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.preferences.mime_types')), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.mime_types')), m("div", {
      className: "UploadPage-mimeTypes"
    }, Object.keys(this.values.mimeTypes()).map(mime => {
      var _permission_label;
      let config = this.values.mimeTypes()[mime];
      if (typeof config !== 'object') {
        config = {
          adapter: config,
          template: 'file'
        };
      }
      const isInvalidRegex = !this.isValidRegex(mime);
      return m("div", {
        key: mime,
        className: "UploadPage-mimeTypeRow ".concat(isInvalidRegex ? 'UploadPage-mimeTypeRow--invalid' : '')
      }, m("input", {
        className: "FormControl UploadPage-mimeTypeInput",
        value: mime,
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', v => this.updateMimeTypeKey(mime, v)),
        onblur: e => {
          const value = e.target.value;
          const sanitized = this.sanitizeMimeRegex(value);
          if (sanitized !== value) {
            this.updateMimeTypeKey(value, sanitized);
          }
        },
        title: isInvalidRegex ? flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.preferences.mime_type_regex_invalid') : undefined
      }), m((flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5___default()), {
        options: this.uploadMethodOptions,
        onchange: v => this.updateMimeTypeAdapter(mime, config, v),
        value: config.adapter || 'local'
      }), m((flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5___default()), {
        options: this.getTemplateOptionsForInput(),
        onchange: v => this.updateMimeTypeTemplate(mime, config, v),
        value: config.template || 'file'
      }), m("input", {
        className: "FormControl UploadPage-mimeTypePermission",
        placeholder: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.preferences.mime_type_permission_placeholder'),
        value: (_permission_label = config.permission_label) != null ? _permission_label : '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', v => this.updateMimeTypePermissionLabel(mime, config, v))
      }), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
        type: "button",
        className: "Button Button--warning",
        onclick: () => this.deleteMimeType(mime)
      }, "\xD7"));
    }), m("div", {
      className: "UploadPage-mimeTypeRow UploadPage-mimeTypeAdd"
    }, m("input", {
      className: "FormControl UploadPage-mimeTypeInput",
      placeholder: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.preferences.mime_type_regex_placeholder'),
      value: this.newMimeType.regex(),
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.newMimeType.regex),
      onblur: () => {
        const value = this.newMimeType.regex();
        const sanitized = this.sanitizeMimeRegex(value);
        if (sanitized !== value) {
          this.newMimeType.regex(sanitized);
          m.redraw();
        }
      }
    }), m((flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5___default()), {
      options: this.uploadMethodOptions,
      className: "UploadPage-mimeTypeSelect",
      onchange: this.newMimeType.adapter,
      value: this.newMimeType.adapter()
    }), m((flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5___default()), {
      options: this.getTemplateOptionsForInput(),
      className: "UploadPage-mimeTypeSelect",
      onchange: this.newMimeType.template,
      value: this.newMimeType.template()
    }), m("input", {
      className: "FormControl UploadPage-mimeTypePermission",
      placeholder: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.preferences.mime_type_permission_placeholder'),
      value: this.newMimeType.permission_label(),
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.newMimeType.permission_label)
    }), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      type: "button",
      className: "Button Button--warning",
      onclick: () => this.addMimeType()
    }, "+"))), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Button",
      onclick: () => flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show(() => __webpack_require__.e(/*! import() | admin/components/InspectMimeModal */ "admin/components/InspectMimeModal").then(__webpack_require__.bind(__webpack_require__, /*! ./InspectMimeModal */ "./src/admin/components/InspectMimeModal.tsx")))
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.inspect-mime')), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.download_templates')), this.templateOptionsDescriptions())), m("fieldset", {
      className: "Form-group UploadPage-composerButtons"
    }, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.composer_buttons.title')), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.composer_buttons')), m((flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5___default()), {
      options: this.composerButtonVisiblityOptions,
      onchange: this.values.composerButtonVisiblity,
      value: this.values.composerButtonVisiblity() || 'both'
    })), m("fieldset", {
      className: "Form-group"
    }, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.resize.title')), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.resize')), m("div", {
      className: "Form-group"
    }, m((flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default()), {
      state: this.values.mustResize() || false,
      onchange: this.values.mustResize
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.resize.toggle'))), m("div", {
      className: "Form-group"
    }, m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.resize.max_width')), m("input", {
      className: "FormControl",
      type: "number",
      min: "0",
      value: (_this$values$resizeMa = this.values.resizeMaxWidth()) != null ? _this$values$resizeMa : 100,
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.resizeMaxWidth),
      disabled: !this.values.mustResize()
    }))), m("fieldset", {
      className: "Form-group"
    }, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.client_extension.title')), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.client_extension')), m("input", {
      className: "FormControl",
      value: (_this$values$whitelis = this.values.whitelistedClientExtensions()) != null ? _this$values$whitelis : '',
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.whitelistedClientExtensions)
    })), m("fieldset", {
      className: "Form-group"
    }, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.watermark.title')), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.watermark')), m("div", {
      className: "Form-group"
    }, m((flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default()), {
      state: this.values.addsWatermarks() || false,
      onchange: this.values.addsWatermarks
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.watermark.toggle'))), m("div", {
      className: "Form-group"
    }, m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.watermark.position')), m((flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5___default()), {
      options: this.watermarkPositions,
      onchange: this.values.watermarkPosition,
      value: this.values.watermarkPosition() || 'bottom-right'
    })), m("div", {
      className: "Form-group"
    }, m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.watermark.file')), m(_UploadImageButton__WEBPACK_IMPORTED_MODULE_8__["default"], {
      name: "fof-watermark",
      path: "fof/watermark",
      routePath: "fof-watermark",
      value: (flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).settings['fof-watermark_path'],
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('fof-watermarkUrl')
    }))), m("fieldset", {
      className: "Form-group"
    }, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.svg-sanitizer.title')), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.svg-sanitizer.help')), m("div", {
      className: "Form-group"
    }, m((flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default()), {
      state: this.values.svgAnimateAllowed() || false,
      onchange: this.values.svgAnimateAllowed
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.svg-sanitizer.allow_animate')), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.svg-sanitizer.allow_animate_help')))), m("fieldset", {
      className: "Form-group"
    }, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.disable-hotlink-protection.title')), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.disable-hotlink-protection')), m("div", {
      className: "Form-group"
    }, m((flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default()), {
      state: this.values.disableHotlinkProtection() || false,
      onchange: this.values.disableHotlinkProtection
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.disable-hotlink-protection.toggle'))), m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.disable-download-logging.title')), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.disable-download-logging')), m("div", {
      className: "Form-group"
    }, m((flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default()), {
      state: this.values.disableDownloadLogging() || false,
      onchange: this.values.disableDownloadLogging
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.disable-download-logging.toggle')))), !this.uploadLocalCdnSetByEnv && m("fieldset", {
      className: "Form-group"
    }, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.local.title')), m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.local.cdn_url')), m("input", {
      className: "FormControl",
      value: (_this$values$cdnUrl = this.values.cdnUrl()) != null ? _this$values$cdnUrl : '',
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.cdnUrl)
    })), this.uploadLocalCdnSetByEnv && m("fieldset", {
      className: "Form-group"
    }, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.local.title')), m((flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_7___default()), {
      text: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.configured_by_environment')
    })), this.adaptorItems().toArray(), m("div", {
      className: "Form-group Form-controls"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      type: "submit",
      className: "Button Button--primary",
      loading: this.loading,
      disabled: !this.changed()
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('core.admin.settings.submit_button')))))));
  }
  adaptorItems() {
    const items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_12___default())();
    if (this.uploadMethodOptions['imgur'] !== undefined) {
      var _this$values$imgurCli;
      items.add('imgur', m("div", {
        className: "UploadPage-adapter UploadPage-adapter--imgur"
      }, m("fieldset", {
        className: "Form-group"
      }, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.imgur.title')), m("p", null, m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_13___default()), {
        name: "fas fa-exclamation-circle"
      }), flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.imgur.tos', {
        a: m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_14___default()), {
          href: "https://imgur.com/tos",
          external: true,
          target: "_blank"
        })
      })), m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.imgur.client_id')), m("input", {
        className: "FormControl",
        value: (_this$values$imgurCli = this.values.imgurClientId()) != null ? _this$values$imgurCli : '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.imgurClientId)
      }))), 100);
    }
    if (this.uploadMethodOptions['qiniu'] !== undefined) {
      var _this$values$qiniuKey, _this$values$qiniuSec, _this$values$qiniuBuc;
      items.add('qiniu', m("div", {
        className: "UploadPage-adapter UploadPage-adapter--qiniu"
      }, m("fieldset", {
        className: "Form-group"
      }, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.qiniu.title')), m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.qiniu.key')), m("input", {
        className: "FormControl",
        value: (_this$values$qiniuKey = this.values.qiniuKey()) != null ? _this$values$qiniuKey : '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.qiniuKey)
      }), m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.qiniu.secret')), m("input", {
        className: "FormControl",
        value: (_this$values$qiniuSec = this.values.qiniuSecret()) != null ? _this$values$qiniuSec : '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.qiniuSecret)
      }), m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.qiniu.bucket')), m("input", {
        className: "FormControl",
        value: (_this$values$qiniuBuc = this.values.qiniuBucket()) != null ? _this$values$qiniuBuc : '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.qiniuBucket)
      }))), 80);
    }
    if (this.uploadMethodOptions['aws-s3'] !== undefined) {
      if (!this.uploadS3SetByEnv) {
        var _this$values$awsS3Key, _this$values$awsS3Sec, _this$values$awsS3Buc, _this$values$awsS3Reg, _this$values$awsS3End, _this$values$awsS3ACL, _this$values$awsS3Cus;
        items.add('aws-s3', m("div", {
          className: "UploadPage-adapter UploadPage-adapter--aws"
        }, m("fieldset", {
          className: "Form-group"
        }, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.title')), m("p", {
          className: "helpText"
        }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.s3_instance_profile')), m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.key')), m("input", {
          className: "FormControl",
          value: (_this$values$awsS3Key = this.values.awsS3Key()) != null ? _this$values$awsS3Key : '',
          oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.awsS3Key)
        }), m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.secret')), m("input", {
          className: "FormControl",
          value: (_this$values$awsS3Sec = this.values.awsS3Secret()) != null ? _this$values$awsS3Sec : '',
          oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.awsS3Secret)
        }), m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.bucket')), m("input", {
          className: "FormControl",
          value: (_this$values$awsS3Buc = this.values.awsS3Bucket()) != null ? _this$values$awsS3Buc : '',
          oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.awsS3Bucket)
        }), m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.region')), m("input", {
          className: "FormControl",
          value: (_this$values$awsS3Reg = this.values.awsS3Region()) != null ? _this$values$awsS3Reg : '',
          oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.awsS3Region)
        })), m("fieldset", {
          className: "Form-group"
        }, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.advanced_title')), m("p", {
          className: "helpText"
        }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.s3_compatible_storage')), m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.endpoint')), m("input", {
          className: "FormControl",
          value: (_this$values$awsS3End = this.values.awsS3Endpoint()) != null ? _this$values$awsS3End : '',
          oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.awsS3Endpoint)
        }), m("div", {
          className: "Form-group"
        }, m((flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default()), {
          state: this.values.awsS3UsePathStyleEndpoint() || false,
          onchange: this.values.awsS3UsePathStyleEndpoint
        }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.use_path_style_endpoint'))), m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.acl')), m("input", {
          className: "FormControl",
          value: (_this$values$awsS3ACL = this.values.awsS3ACL()) != null ? _this$values$awsS3ACL : '',
          oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.awsS3ACL)
        }), m("p", {
          className: "helpText"
        }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.s3_acl')), m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.custom_url')), m("input", {
          className: "FormControl",
          value: (_this$values$awsS3Cus = this.values.awsS3CustomUrl()) != null ? _this$values$awsS3Cus : '',
          oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_9___default()('value', this.values.awsS3CustomUrl)
        }), m("p", {
          className: "helpText"
        }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.custom_s3_url')))), 60);
      } else {
        items.add('aws-s3', m("div", {
          className: "UploadPage-adapter UploadPage-adapter--aws"
        }, m("fieldset", {
          className: "Form-group"
        }, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.title')), m((flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_7___default()), {
          text: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.configured_by_environment')
        }))), 60);
      }
    }
    return items;
  }
  getTemplateOptionsForInput() {
    const options = {};
    for (const option in this.templateOptions) {
      if (Object.prototype.hasOwnProperty.call(this.templateOptions, option)) {
        options[option] = this.templateOptions[option].name;
      }
    }
    return options;
  }
  updateMimeTypeKey(mime, value) {
    if (value === mime) return;
    const mimeTypes = this.values.mimeTypes();
    mimeTypes[value] = mimeTypes[mime];
    delete mimeTypes[mime];
    this.values.mimeTypes(_objectSpread({}, mimeTypes));
    m.redraw();
  }
  updateMimeTypeAdapter(mime, config, value) {
    config.adapter = value;
    const mimeTypes = this.values.mimeTypes();
    mimeTypes[mime] = config;
    this.values.mimeTypes(_objectSpread({}, mimeTypes));
    m.redraw();
  }
  updateMimeTypeTemplate(mime, config, value) {
    config.template = value;
    const mimeTypes = this.values.mimeTypes();
    mimeTypes[mime] = config;
    this.values.mimeTypes(_objectSpread({}, mimeTypes));
    m.redraw();
  }
  updateMimeTypePermissionLabel(mime, config, value) {
    config.permission_label = value || undefined;
    config.permission_slug = value ? slugify(value) : undefined;
    const mimeTypes = this.values.mimeTypes();
    mimeTypes[mime] = config;
    this.values.mimeTypes(_objectSpread({}, mimeTypes));
    m.redraw();
  }
  deleteMimeType(mime) {
    const mimeTypes = this.values.mimeTypes();
    delete mimeTypes[mime];
    this.values.mimeTypes(_objectSpread({}, mimeTypes));
    m.redraw();
  }
  templateOptionsDescriptions() {
    return m("ul", {
      className: "UploadPage-templateList"
    }, Object.keys(this.templateOptions).map(template => m("li", {
      key: template
    }, this.templateOptions[template].name, ": ", m("span", {
      dangerouslySetInnerHTML: {
        __html: this.templateOptions[template].description
      }
    }))));
  }
  addMimeType() {
    const regex = this.newMimeType.regex();
    if (!regex) return;
    const label = this.newMimeType.permission_label();
    const mimeTypes = this.values.mimeTypes();
    mimeTypes[regex] = _objectSpread({
      adapter: this.newMimeType.adapter(),
      template: this.newMimeType.template()
    }, label ? {
      permission_label: label,
      permission_slug: slugify(label)
    } : {});
    this.values.mimeTypes(_objectSpread({}, mimeTypes));
    this.newMimeType.regex('');
    this.newMimeType.adapter(this.defaultAdap);
    this.newMimeType.template('file');
    this.newMimeType.permission_label('');
    m.redraw();
  }
  changed() {
    const fieldsCheck = this.fields.some(key => this.values[key]() !== (flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).settings[this.addPrefix(key)]);
    const checkboxesCheck = this.checkboxes.some(key => this.values[key]() !== ((flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).settings[this.addPrefix(key)] === '1'));
    const objectsCheck = this.objects.some(key => JSON.stringify(this.values[key]()) !== (flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).settings[this.addPrefix(key)]);
    return fieldsCheck || checkboxesCheck || objectsCheck;
  }
  onsubmit(e) {
    e.preventDefault();
    if (this.loading) return;
    this.loading = true;
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().alerts.dismiss(this.successAlert);
    const settings = {};
    this.fields.forEach(key => settings[this.addPrefix(key)] = this.values[key]());
    this.checkboxes.forEach(key => settings[this.addPrefix(key)] = this.values[key]());
    this.objects.forEach(key => settings[this.addPrefix(key)] = JSON.stringify(this.values[key]()));

    // Snapshot current mime permissions before the async save so the grid
    // can be updated immediately on success without waiting for a page reload.
    const mimePermsSnapshot = Object.values(this.values.mimeTypes()).filter(c => c.permission_label && c.permission_slug).map(c => ({
      label: c.permission_label,
      slug: c.permission_slug
    }));
    flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3___default()(settings).then(() => {
      this.successAlert = flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().alerts.show((flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_4___default()), {
        type: 'success'
      }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('core.admin.settings.saved_message'));
      (0,_index__WEBPACK_IMPORTED_MODULE_15__.registerMimePermissions)(mimePermsSnapshot);
    }).catch(() => {}).then(() => {
      this.loading = false;
      m.redraw();
    });
  }
  addPrefix(key) {
    return "".concat(this.settingsPrefix, ".").concat(key);
  }
  isValidRegex(pattern) {
    if (!pattern.trim()) return false;
    try {
      new RegExp(pattern);
      return true;
    } catch (_unused) {
      return false;
    }
  }
  sanitizeMimeRegex(pattern) {
    return pattern.replace(/\|\|+/g, '|').replace(/\|\)/g, ')').replace(/\(\|/g, '(').replace(/\|\$/g, '$').replace(/^\|/, '').replace(/\|$/, '');
  }
}
flarum.reg.add('fof-upload', 'admin/components/UploadPage', UploadPage);flarum.reg.addChunkModule('admin/components/InspectMimeModal', './src/admin/components/InspectMimeModal.tsx', 'fof-upload', 'admin/components/InspectMimeModal');

/***/ },

/***/ "./src/admin/extend.ts"
/*!*****************************!*\
  !*** ./src/admin/extend.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/extend */ "./src/common/extend.ts");
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/extenders */ "flarum/common/extenders");
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extenders__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_SharedUploadPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/SharedUploadPage */ "./src/admin/components/SharedUploadPage.tsx");
/* harmony import */ var _components_UploadPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/UploadPage */ "./src/admin/components/UploadPage.tsx");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([..._common_extend__WEBPACK_IMPORTED_MODULE_1__["default"], new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_2___default().Routes)() //
.add('adminUploads', '/uploads', _components_SharedUploadPage__WEBPACK_IMPORTED_MODULE_3__["default"]), new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_2___default().Admin)().permission(() => ({
  icon: 'far fa-file',
  label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.permissions.upload_label'),
  permission: 'fof-upload.upload'
}), 'start', 50).permission(() => ({
  icon: 'fas fa-download',
  label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.permissions.download_label'),
  permission: 'fof-upload.download',
  allowGuest: true
}), 'view', 50).permission(() => ({
  icon: 'fas fa-eye',
  label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.permissions.view_user_uploads_label'),
  permission: 'fof-upload.viewUserUploads'
}), 'moderate', 50).permission(() => ({
  icon: 'fas fa-trash',
  label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.permissions.delete_uploads_of_others_label'),
  permission: 'fof-upload.deleteUserUploads'
}), 'moderate', 50).permission(() => ({
  icon: 'far fa-file-alt',
  label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.permissions.upload_shared_label'),
  permission: 'fof-upload.upload-shared-files'
}), 'start').permission(() => ({
  icon: 'far fa-file-alt',
  label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.permissions.access_shared_label'),
  permission: 'fof-upload.access-shared-files'
}), 'start').generalIndexItems('settings', () => {
  var _app$data$settings, _app$data$settings2;
  const t = (key, attrs) => flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans(key, attrs != null ? attrs : {}, true);
  return [{
    id: 'preferences',
    tree: [t('fof-upload.admin.labels.preferences.title')],
    label: t('fof-upload.admin.labels.preferences.max_file_size'),
    help: t('fof-upload.admin.labels.preferences.php_ini_values', {
      post: ((_app$data$settings = (flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().data).settings) == null ? void 0 : _app$data$settings['fof-upload.php_ini.post_max_size']) || '',
      upload: ((_app$data$settings2 = (flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().data).settings) == null ? void 0 : _app$data$settings2['fof-upload.php_ini.upload_max_filesize']) || ''
    })
  }, {
    id: 'mime-types',
    tree: [t('fof-upload.admin.labels.preferences.title')],
    label: t('fof-upload.admin.labels.preferences.mime_types'),
    help: t('fof-upload.admin.help_texts.mime_types')
  }, {
    id: 'composer-buttons',
    tree: [t('fof-upload.admin.labels.composer_buttons.title')],
    label: t('fof-upload.admin.labels.composer_buttons.title'),
    help: t('fof-upload.admin.help_texts.composer_buttons')
  }, {
    id: 'resize',
    tree: [t('fof-upload.admin.labels.resize.title')],
    label: t('fof-upload.admin.labels.resize.toggle'),
    help: t('fof-upload.admin.help_texts.resize')
  }, {
    id: 'resize-max-width',
    tree: [t('fof-upload.admin.labels.resize.title')],
    label: t('fof-upload.admin.labels.resize.max_width'),
    help: t('fof-upload.admin.help_texts.resize')
  }, {
    id: 'client-extension',
    tree: [t('fof-upload.admin.labels.client_extension.title')],
    label: t('fof-upload.admin.labels.client_extension.title'),
    help: t('fof-upload.admin.help_texts.client_extension')
  }, {
    id: 'watermark',
    tree: [t('fof-upload.admin.labels.watermark.title')],
    label: t('fof-upload.admin.labels.watermark.toggle'),
    help: t('fof-upload.admin.help_texts.watermark')
  }, {
    id: 'watermark-position',
    tree: [t('fof-upload.admin.labels.watermark.title')],
    label: t('fof-upload.admin.labels.watermark.position'),
    help: t('fof-upload.admin.help_texts.watermark')
  }, {
    id: 'svg-sanitizer',
    tree: [t('fof-upload.admin.labels.svg-sanitizer.title')],
    label: t('fof-upload.admin.labels.svg-sanitizer.title'),
    help: t('fof-upload.admin.labels.svg-sanitizer.help')
  }, {
    id: 'hotlink-protection',
    tree: [t('fof-upload.admin.labels.disable-hotlink-protection.title')],
    label: t('fof-upload.admin.labels.disable-hotlink-protection.toggle'),
    help: t('fof-upload.admin.help_texts.disable-hotlink-protection')
  }, {
    id: 'download-logging',
    tree: [t('fof-upload.admin.labels.disable-download-logging.title')],
    label: t('fof-upload.admin.labels.disable-download-logging.toggle'),
    help: t('fof-upload.admin.help_texts.disable-download-logging')
  }, {
    id: 'local-cdn',
    tree: [t('fof-upload.admin.labels.local.title')],
    label: t('fof-upload.admin.labels.local.cdn_url'),
    help: t('fof-upload.admin.labels.local.title'),
    visible: () => !(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().data).uploadLocalCdnSetByEnv
  }, {
    id: 'imgur',
    tree: [t('fof-upload.admin.labels.imgur.title')],
    label: t('fof-upload.admin.labels.imgur.client_id'),
    help: t('fof-upload.admin.labels.imgur.title')
  }, {
    id: 'qiniu',
    tree: [t('fof-upload.admin.labels.qiniu.title')],
    label: t('fof-upload.admin.labels.qiniu.title'),
    help: t('fof-upload.admin.labels.qiniu.title')
  }, {
    id: 'aws-s3',
    tree: [t('fof-upload.admin.labels.aws-s3.title')],
    label: t('fof-upload.admin.labels.aws-s3.title'),
    help: t('fof-upload.admin.help_texts.s3_instance_profile')
  }];
}).page(_components_UploadPage__WEBPACK_IMPORTED_MODULE_4__["default"])]);

/***/ },

/***/ "./src/admin/extendAdminNav.tsx"
/*!**************************************!*\
  !*** ./src/admin/extendAdminNav.tsx ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ extendAdminNav)
/* harmony export */ });
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_admin_components_AdminNav__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/admin/components/AdminNav */ "flarum/admin/components/AdminNav");
/* harmony import */ var flarum_admin_components_AdminNav__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_AdminNav__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__);




function extendAdminNav() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_admin_components_AdminNav__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'items', function (items) {
    items.add('shared-uploads', m((flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default()), {
      href: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().route('adminUploads'),
      icon: "fas fa-file-upload",
      title: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.shared-uploads.title')
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.nav.shared-uploads-button')), 49);
  });
}

/***/ },

/***/ "./src/admin/index.ts"
/*!****************************!*\
  !*** ./src/admin/index.ts ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extend: () => (/* reexport safe */ _extend__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   registerMimePermissions: () => (/* binding */ registerMimePermissions)
/* harmony export */ });
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _extendAdminNav__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extendAdminNav */ "./src/admin/extendAdminNav.tsx");
/* harmony import */ var _extend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extend */ "./src/admin/extend.ts");




/**
 * Register per-mime-type upload permissions in the Flarum permission grid.
 *
 * Called at boot (from app.initializers) and again after each settings save
 * in UploadPage so the grid updates without requiring a page reload.
 * Calling registerPermission with an existing key overwrites it, so this is
 * safe to call multiple times.
 */
function registerMimePermissions(perms) {
  if (perms.length === 0) return;
  flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().registry.for('fof-upload');
  perms.forEach(p => {
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().registry.registerPermission({
      icon: 'far fa-file',
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.permissions.upload_mime_label', {
        label: p.label
      }),
      permission: "fof-upload.upload-mime.".concat(p.slug)
    }, 'start', 45);
  });
}
flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('fof-upload', () => {
  var _app$data$settings;
  (0,_extendAdminNav__WEBPACK_IMPORTED_MODULE_1__["default"])();

  // Dynamically register per-mime-type upload permissions in the permission grid.
  // This runs after app.data is fully loaded, so settings are available here.
  const raw = (_app$data$settings = (flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().data).settings) == null ? void 0 : _app$data$settings['fof-upload.mimePermissions'];
  const perms = Array.isArray(raw) ? raw : typeof raw === 'string' ? JSON.parse(raw || '[]') : [];
  registerMimePermissions(perms);
});

/***/ },

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

/***/ "flarum/admin/app"
/*!******************************************************!*\
  !*** external "flarum.reg.get('core', 'admin/app')" ***!
  \******************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'admin/app');

/***/ },

/***/ "flarum/admin/components/AdminNav"
/*!**********************************************************************!*\
  !*** external "flarum.reg.get('core', 'admin/components/AdminNav')" ***!
  \**********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'admin/components/AdminNav');

/***/ },

/***/ "flarum/admin/components/AdminPage"
/*!***********************************************************************!*\
  !*** external "flarum.reg.get('core', 'admin/components/AdminPage')" ***!
  \***********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'admin/components/AdminPage');

/***/ },

/***/ "flarum/admin/components/ExtensionPage"
/*!***************************************************************************!*\
  !*** external "flarum.reg.get('core', 'admin/components/ExtensionPage')" ***!
  \***************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'admin/components/ExtensionPage');

/***/ },

/***/ "flarum/admin/utils/saveSettings"
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'admin/utils/saveSettings')" ***!
  \*********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'admin/utils/saveSettings');

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

/***/ "flarum/common/components/Link"
/*!*******************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Link')" ***!
  \*******************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Link');

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

/***/ "flarum/common/components/Placeholder"
/*!**************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Placeholder')" ***!
  \**************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Placeholder');

/***/ },

/***/ "flarum/common/components/Select"
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Select')" ***!
  \*********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Select');

/***/ },

/***/ "flarum/common/components/Switch"
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Switch')" ***!
  \*********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Switch');

/***/ },

/***/ "flarum/common/components/Tooltip"
/*!**********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Tooltip')" ***!
  \**********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Tooltip');

/***/ },

/***/ "flarum/common/components/UploadImageButton"
/*!********************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/UploadImageButton')" ***!
  \********************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/UploadImageButton');

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

/***/ "flarum/common/utils/ItemList"
/*!******************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/utils/ItemList')" ***!
  \******************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/utils/ItemList');

/***/ },

/***/ "flarum/common/utils/Stream"
/*!****************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/utils/Stream')" ***!
  \****************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/utils/Stream');

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

/***/ "flarum/common/utils/withAttr"
/*!******************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/utils/withAttr')" ***!
  \******************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/utils/withAttr');

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
/******/ 			"admin": 0
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
  !*** ./admin.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extend: () => (/* reexport safe */ _src_admin__WEBPACK_IMPORTED_MODULE_0__.extend),
/* harmony export */   registerMimePermissions: () => (/* reexport safe */ _src_admin__WEBPACK_IMPORTED_MODULE_0__.registerMimePermissions)
/* harmony export */ });
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.ts");

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=admin.js.map