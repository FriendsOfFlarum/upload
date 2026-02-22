"use strict";
(self["webpackChunkmodule_exports"] = self["webpackChunkmodule_exports"] || []).push([["admin/components/InspectMimeModal"],{

/***/ "./src/admin/components/InspectMimeModal.tsx"
/*!***************************************************!*\
  !*** ./src/admin/components/InspectMimeModal.tsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InspectMimeModal)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_FormModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/FormModal */ "flarum/common/components/FormModal");
/* harmony import */ var flarum_common_components_FormModal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_FormModal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_4__);





class InspectMimeModal extends (flarum_common_components_FormModal__WEBPACK_IMPORTED_MODULE_2___default()) {
  constructor() {
    super(...arguments);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "uploading", false);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "inspection", {});
  }
  oninit(vnode) {
    super.oninit(vnode);
    this.uploading = false;
    this.inspection = {};
  }
  className() {
    return 'Modal--small fof-upload-inspect-mime-modal';
  }
  title() {
    return flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.title');
  }
  content() {
    return m("div", {
      className: "Modal-body"
    }, m("p", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.description', {
      a: m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_4___default()), {
        href: "https://github.com/SoftCreatR/php-mime-detector",
        external: true,
        target: "_blank"
      }, "PHP Mime Detector")
    })), m("p", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.select')), m("div", null, m("input", {
      type: "file",
      onchange: e => this.onupload(e),
      disabled: this.uploading
    }), this.uploading ? m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default()), null) : null), m("dl", null, m("dt", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.laravel-validation')), m("dd", null, typeof this.inspection.laravel_validation === 'undefined' ? m("em", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.no-file-selected')) : this.inspection.laravel_validation ? flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.validation-passed') : flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.validation-failed', {
      error: this.inspection.laravel_validation_error || '?'
    }))), m("dl", null, m("dt", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.mime-detector')), m("dd", null, this.inspection.mime_detector ? m("code", null, this.inspection.mime_detector) : m("em", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.not-available')))), m("dl", null, m("dt", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.mime-fileinfo')), m("dd", null, this.inspection.php_mime ? m("code", null, this.inspection.php_mime) : m("em", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.not-available')))), m("dl", null, m("dt", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.guessed-extension')), m("dd", null, this.inspection.guessed_extension ? m("code", null, this.inspection.guessed_extension) : m("em", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.not-available')))));
  }
  onupload(event) {
    const target = event.target;
    const body = new FormData();
    for (let i = 0; i < target.files.length; i++) {
      body.append('files[]', target.files[i]);
    }
    this.uploading = true;
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().request({
      method: 'POST',
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('apiUrl') + '/fof/upload/inspect-mime',
      serialize: raw => raw,
      body
    }).then(result => {
      const inspection = result;
      this.uploading = false;
      this.inspection = inspection;
      m.redraw();
    }).catch(error => {
      this.uploading = false;
      this.inspection = {};
      m.redraw();
      throw error;
    });
  }
}
flarum.reg.add('fof-upload', 'admin/components/InspectMimeModal', InspectMimeModal);

/***/ }

}]);
//# sourceMappingURL=InspectMimeModal.js.map