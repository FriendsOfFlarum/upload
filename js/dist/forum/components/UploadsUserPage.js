"use strict";
(self["webpackChunkmodule_exports"] = self["webpackChunkmodule_exports"] || []).push([["forum/components/UploadsUserPage"],{

/***/ "./src/forum/components/UploadsUserPage.tsx"
/*!**************************************************!*\
  !*** ./src/forum/components/UploadsUserPage.tsx ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadsUserPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/UserPage */ "flarum/forum/components/UserPage");
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_components_UserFileList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common/components/UserFileList */ "./src/common/components/UserFileList.tsx");
/* harmony import */ var _common_states_FileListState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../common/states/FileListState */ "./src/common/states/FileListState.ts");





class UploadsUserPage extends (flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2___default()) {
  constructor() {
    super(...arguments);
    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "fileState", void 0);
  }
  oninit(vnode) {
    super.oninit(vnode);
    this.user = null;
    this.fileState = new _common_states_FileListState__WEBPACK_IMPORTED_MODULE_4__["default"]();
    this.loadUser(m.route.param('username'));
  }
  content() {
    if ((flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user && (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session.user.viewOthersMediaLibrary() || this.user === (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user)) {
      return this.user && _common_components_UserFileList__WEBPACK_IMPORTED_MODULE_3__["default"].component({
        user: this.user,
        selectable: false,
        downloadOnClick: true,
        fileState: this.fileState,
        onDelete: this.onDelete.bind(this)
      });
    } else {
      return null;
    }
  }
  onDelete(file) {
    this.fileState.removeFromList(file);
  }
  show(user) {
    super.show(user);
    this.user = user;
  }
}
flarum.reg.add('fof-upload', 'forum/components/UploadsUserPage', UploadsUserPage);

/***/ }

}]);
//# sourceMappingURL=UploadsUserPage.js.map