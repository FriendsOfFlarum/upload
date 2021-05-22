module.exports=function(t){var e={};function i(a){if(e[a])return e[a].exports;var o=e[a]={i:a,l:!1,exports:{}};return t[a].call(o.exports,o,o.exports,i),o.l=!0,o.exports}return i.m=t,i.c=e,i.d=function(t,e,a){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(i.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(a,o,function(e){return t[e]}.bind(null,o));return a},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=26)}([function(t,e){t.exports=flarum.core.compat["common/app"]},,function(t,e,i){"use strict";function a(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e}i.d(e,"a",(function(){return a}))},function(t,e){t.exports=flarum.core.compat["common/components/Button"]},function(t,e){t.exports=flarum.core.compat["common/Model"]},function(t,e){t.exports=flarum.core.compat["common/extend"]},,,function(t,e){t.exports=flarum.core.compat["common/Component"]},function(t,e){t.exports=flarum.core.compat["common/components/Alert"]},,function(t,e){t.exports=flarum.core.compat["common/components/LoadingIndicator"]},function(t,e){t.exports=flarum.core.compat["common/components/TextEditor"]},function(t,e){t.exports=flarum.core.compat["forum/components/UserPage"]},function(t,e){t.exports=flarum.core.compat["common/utils/classList"]},function(t,e){t.exports=flarum.core.compat["common/components/Tooltip"]},function(t,e){t.exports=flarum.core.compat["common/utils/extractText"]},function(t,e){t.exports=flarum.core.compat["common/models/User"]},function(t,e){t.exports=flarum.core.compat["common/components/LinkButton"]},function(t,e){t.exports=flarum.core.compat["common/utils/mixin"]},function(t,e){t.exports=flarum.core.compat["forum/components/Post"]},function(t,e){t.exports=flarum.core.compat["common/components/Modal"]},,,,,function(t,e,i){"use strict";i.r(e),i.d(e,"components",(function(){return X}));var a=i(5),o=i(0),n=i.n(o),s=i(13),r=i.n(s),l=i(18),u=i.n(l),d=i(2),p=i(4),c=i.n(p),f=i(19);var h=function(t){function e(){return t.apply(this,arguments)||this}Object(d.a)(e,t);var i=e.prototype;return i.apiEndpoint=function(){return"/fof/uploads"+(this.exists?"/"+this.data.id:"")},i.bbcode=function(){return function(t){switch(t.tag()){case"file":return"[upl-file uuid="+t.uuid()+" size="+t.humanSize()+"]"+t.baseName()+"[/upl-file]";case"image":return"[upl-image uuid="+t.uuid()+" size="+t.humanSize()+" url="+t.url()+"]"+t.baseName()+"[/upl-image]";case"image-preview":return"[upl-image-preview url="+t.url()+"]";default:return t.url()}}(this)},e}(i.n(f)()(c.a,{baseName:c.a.attribute("baseName"),path:c.a.attribute("path"),url:c.a.attribute("url"),type:c.a.attribute("type"),size:c.a.attribute("size"),humanSize:c.a.attribute("humanSize"),createdAt:c.a.attribute("createdAt"),uuid:c.a.attribute("uuid"),tag:c.a.attribute("tag"),hidden:c.a.attribute("hidden")})),g=function(){function t(){this.user=null,this.files=[],this.moreResults=!1,this.loading=!1}var e=t.prototype;return e.setUser=function(t){t!==this.user&&(this.user=t,this.files=[],this.loadResults())},e.loadResults=function(t){if(void 0===t&&(t=0),this.user)return this.loading=!0,n.a.store.find("fof/uploads",{filter:{user:this.user.id()},page:{offset:t}}).then(this.parseResults.bind(this))},e.loadMore=function(){this.loading=!0,this.loadResults(this.files.length).then(this.parseResults.bind(this))},e.parseResults=function(t){var e;return(e=this.files).push.apply(e,t),this.loading=!1,this.moreResults=!!t.payload.links&&!!t.payload.links.next,m.redraw(),t},e.addToList=function(t){var e;Array.isArray(t)?(e=this.files).unshift.apply(e,t):this.files.unshift(t)},e.hasFiles=function(){return this.files.length>0},e.isLoading=function(){return this.loading},e.hasMoreResults=function(){return this.moreResults},e.empty=function(){return!this.hasFiles()&&!this.isLoading()},t}(),b=i(20),v=i.n(b),y=i(12),x=i.n(y),F=i(8),w=i.n(F),N=i(3),_=i.n(N),B=i(11),O=i.n(B),M=i(14),L=i.n(M),S=i(15),k=i.n(S),T=function(t){function e(){return t.apply(this,arguments)||this}Object(d.a)(e,t);var i=e.prototype;return i.oninit=function(e){var i=this;t.prototype.oninit.call(this,e),this.attrs.uploader.on("uploaded",(function(){i.$("form")[0].reset(),m.redraw()})),this.isMediaUploadButton=e.attrs.isMediaUploadButton||!1},i.view=function(){var t=this.attrs.uploader.uploading?n.a.translator.trans("fof-upload.forum.states.loading"):n.a.translator.trans("fof-upload.forum.buttons.upload");return m(k.a,{text:t},m(_.a,{className:L()(["Button","hasIcon","fof-upload-button",!this.isMediaUploadButton&&!this.attrs.uploader.uploading&&"Button--icon",!this.isMediaUploadButton&&!this.attrs.uploader.uploading&&"Button--link",this.attrs.uploader.uploading&&"uploading"]),icon:!this.attrs.uploader.uploading&&"fas fa-file-upload",onclick:this.uploadButtonClicked.bind(this),disabled:this.attrs.disabled},this.attrs.uploader.uploading&&m(O.a,{size:"tiny",className:"LoadingIndicator--inline Button-icon"}),(this.isMediaUploadButton||this.attrs.uploader.uploading)&&m("span",{className:"Button-label"},t),m("form",null,m("input",{type:"file",multiple:!0,onchange:this.process.bind(this)}))))},i.process=function(t){var e=this.$("input").prop("files");0!==e.length&&this.attrs.uploader.upload(e,!this.isMediaUploadButton)},i.uploadButtonClicked=function(t){this.$("input").click()},e}(w.a),j=function(){function t(t,e){this.upload=t,this.composerElement=e,this.handlers={},this.supportsFileDragging()&&(this.composerElement.addEventListener("dragover",this.handlers.in=this.in.bind(this)),this.composerElement.addEventListener("dragleave",this.handlers.out=this.out.bind(this)),this.composerElement.addEventListener("dragend",this.handlers.out),this.composerElement.addEventListener("drop",this.handlers.dropping=this.dropping.bind(this)))}var e=t.prototype;return e.supportsFileDragging=function(){var t=document.createElement("div");return("draggable"in t||"ondragstart"in t&&"ondrop"in t)&&"FormData"in window&&"FileReader"in window},e.unload=function(){this.handlers.in&&(this.composerElement.removeEventListener("dragover",this.handlers.in),this.composerElement.removeEventListener("dragleave",this.handlers.out),this.composerElement.removeEventListener("dragend",this.handlers.out),this.composerElement.removeEventListener("drop",this.handlers.dropping))},e.isNotFile=function(t){if(t.dataTransfer.items)for(var e=0;e<t.dataTransfer.items.length;e++)if("file"!==t.dataTransfer.items[e].kind)return!0;return!1},e.in=function(t){this.isNotFile(t)||(t.preventDefault(),this.over||(this.composerElement.classList.add("fof-upload-dragging"),this.over=!0))},e.out=function(t){this.isNotFile(t)||(t.preventDefault(),this.over&&(this.composerElement.classList.remove("fof-upload-dragging"),this.over=!1))},e.dropping=function(t){this.isNotFile(t)||(t.preventDefault(),this.upload(t.dataTransfer.files),this.composerElement.classList.remove("fof-upload-dragging"))},t}(),E=function(){function t(t,e){this.upload=t,e.addEventListener("paste",this.paste.bind(this))}return t.prototype.paste=function(t){if(t.clipboardData&&t.clipboardData.items){for(var e=t.clipboardData.items,i=[],a=0;a<e.length;a++)-1!==e[a].type.indexOf("image")&&i.push(e[a].getAsFile());i.length>0&&(t.preventDefault(),this.upload(i))}},t}(),U=function(){function t(){this.callbacks={success:[],failure:[],uploading:[],uploaded:[]},this.uploading=!1}var e=t.prototype;return e.on=function(t,e){this.callbacks[t].push(e)},e.dispatch=function(t,e){this.callbacks[t].forEach((function(t){return t(e)}))},e.upload=function(t,e){var i=this;void 0===e&&(e=!0),this.uploading=!0,this.dispatch("uploading",t),m.redraw();for(var a=new FormData,o=0;o<t.length;o++)a.append("files[]",t[o]);return n.a.request({method:"POST",url:n.a.forum.attribute("apiUrl")+"/fof/upload",serialize:function(t){return t},body:a}).then((function(t){return i.uploaded(t,e)})).catch((function(t){throw i.uploading=!1,m.redraw(),t}))},e.uploaded=function(t,e){var i=this;void 0===e&&(e=!1),this.uploading=!1,t.data.forEach((function(t){var a=n.a.store.pushObject(t);n.a.fileListState.addToList(a),i.dispatch("success",{file:a,addBBcode:e})})),this.dispatch("uploaded")},t}(),D=i(21),A=i.n(D),C=i(9),z=i.n(C),R=i(16),P=i.n(R),H=["image/png","image/jpg","image/jpeg","image/svg+xml","image/gif"],I=["application/zip","application/x-7z-compressed","application/gzip","application/vnd.rar","application/x-rar-compressed"],$=["text/html","text/css","text/javascript","application/json","application/ld+json","text/javascript","application/x-httpd-php"],q=["application/x-abiword","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/pdf"];var V=function(t){function e(){return t.apply(this,arguments)||this}Object(d.a)(e,t);var i=e.prototype;return i.oninit=function(e){t.prototype.oninit.call(this,e),app.fileListState.setUser(e.attrs.user||app.session.user),this.inModal=e.attrs.selectable,this.restrictFileType=e.attrs.restrictFileType||null,this.downloadOnClick=this.attrs.downloadOnClick||!1,this.filesBeingHidden=[],this.user=app.fileListState.user},i.view=function(){var t=this,e=app.fileListState;return m("div",{className:"fof-upload-file-list","aria-live":"polite"},e.isLoading()&&0===e.files.length&&m("div",{className:"fof-upload-loading"},app.translator.trans("fof-upload.forum.file_list.loading"),m(O.a,null)),this.inModal&&e.empty()&&m("p",{className:"fof-upload-empty"},m("i",{className:"fas fa-cloud-upload-alt fof-upload-empty-icon"}),app.translator.trans("fof-upload.forum.file_list.modal_empty_"+("phone"!==app.screen()?"desktop":"phone"))),!this.inModal&&e.empty()&&m("p",{className:"fof-upload-empty"},app.translator.trans("fof-upload.forum.file_list.empty")),m("ul",null,e.files.map((function(e){var i,a=(i=e.type(),H.includes(i)?"image":i.includes("image/")?"far fa-file-image":i.includes("video/")?"far fa-file-video":I.indexOf(i)>=0?"far fa-file-archive":"application/pdf"===i?"far fa-file-pdf":q.indexOf(i)>=0?"far fa-file-word":i.includes("audio/")?"far fa-file-audio":$.indexOf(i)>=0?"far fa-file-code":"far fa-file"),o=!t.restrictFileType||t.isSelectable(e),n=L()(["fof-file","image"===a&&"fof-file-type-image",t.attrs.selectedFiles&&t.attrs.selectedFiles.indexOf(e.id())>=0&&"fof-file-selected"]),s=e.baseName(),r=t.filesBeingHidden.includes(e.uuid());return m("li",{"aria-busy":r},app.session.user&&(t.user===app.session.user||app.session.user.deleteOthersMediaLibrary())&&m(_.a,{className:"Button Button--icon fof-file-delete",icon:"far fa-trash-alt","aria-label":app.translator.trans("fof-upload.forum.file_list.delete_file_a11y_label",{fileName:s}),disabled:r,onclick:t.hideFile.bind(t,e)}),m("button",{className:n,onclick:function(){return t.onFileClick(e)},disabled:!o||r,"aria-label":P()(app.translator.trans("fof-upload.forum.file_list.select_file_a11y_label",{fileName:s}))},m("figure",null,"image"===a?m("img",{src:e.url(),className:"fof-file-image-preview",draggable:!1,alt:""}):m("span",{className:"fof-file-icon",role:"presentation"},m("i",{className:"fa-fw "+a})),m("figcaption",{className:"fof-file-name"},s),r&&m("span",{class:"fof-file-loading",role:"status","aria-label":app.translator.trans("fof-upload.forum.file_list.hide_file.loading")},m(O.a,null)))))}))),e.hasMoreResults()&&m("div",{className:"fof-load-more-files"},m(_.a,{className:"Button Button--primary",disabled:e.isLoading(),loading:e.isLoading(),onclick:function(){return e.loadMore()}},app.translator.trans("fof-upload.forum.file_list.load_more_files_btn"))))},i.onFileClick=function(t){this.attrs.onFileSelect?this.attrs.onFileSelect(t):this.attrs.downloadOnClick&&window.open(t.url())},i.isSelectable=function(t){var e=t.type();return Array.isArray(this.restrictFileType)?this.restrictFileType.indexOf(e)>=0:"image"===this.restrictFileType?e.includes("image/"):"audio"===this.restrictFileType?e.includes("audio/"):"video"===this.restrictFileType&&e.includes("video/")},i.hideFile=function(t){var e=this,i=t.uuid();if(!this.filesBeingHidden.includes(i))if(this.filesBeingHidden.push(i),confirm(P()(app.translator.trans("fof-upload.forum.file_list.hide_file.hide_confirmation",{fileName:t.baseName()}))))app.request({method:"PATCH",url:app.forum.attribute("apiUrl")+"/fof/upload/hide",body:{uuid:i}}).then((function(){app.alerts.show(z.a,{type:"success"},app.translator.trans("fof-upload.forum.file_list.hide_file.hide_success"))})).catch((function(){app.alerts.show(z.a,{type:"error"},app.translator.trans("fof-upload.forum.file_list.hide_file.hide_fail",{fileName:t.fileName()}))})).then((function(){var t=app.fileListState,a=t.files.findIndex((function(t){return i===t.uuid()}));t.files.splice(a,1);var o=e.filesBeingHidden.indexOf(i);e.filesBeingHidden.splice(o,1)}));else{var a=this.filesBeingHidden.indexOf(i);this.filesBeingHidden.splice(a,1)}},e}(w.a),G=function(t){function e(){return t.apply(this,arguments)||this}Object(d.a)(e,t);var i=e.prototype;return i.oninit=function(e){t.prototype.oninit.call(this,e),this.uploader=e.attrs.uploader,this.selectedFiles=[],this.multiSelect=e.attrs.multiSelect||!0,this.restrictFileType=e.attrs.restrictFileType||null,this.dragDrop=null,this.onUpload()},i.className=function(){return"Modal--large fof-file-manager-modal"},i.oncreate=function(e){var i=this;t.prototype.oncreate.call(this,e),this.dragDrop=new j((function(t){return i.uploader.upload(t,!1)}),this.$().find(".Modal-content")[0])},i.onremove=function(){this.dragDrop&&this.dragDrop.unload()},i.view=function(){var t=this.selectedFiles.length;return m("div",{className:"Modal modal-dialog "+this.className()},m("div",{className:"Modal-content"},m("div",{className:"fof-modal-buttons App-backControl"},m(T,{uploader:this.uploader,disabled:app.fileListState.isLoading(),isMediaUploadButton:!0})),m("div",{className:"fof-drag-and-drop"},m("div",{className:"fof-drag-and-drop-release"},m("i",{className:"fas fa-cloud-upload-alt"}),app.translator.trans("fof-upload.forum.file_list.release_to_upload"))),m("div",{className:"Modal-header"},m("h3",{className:"App-titleControl App-titleControl--text"},app.translator.trans("fof-upload.forum.media_manager"))),this.alertAttrs&&m("div",{className:"Modal-alert"},m(Alert,this.alertAttrs)),m("div",{className:"Modal-body"},m(V,{user:this.attrs.user,selectable:!0,onFileSelect:this.onFileSelect.bind(this),selectedFiles:this.selectedFiles,restrictFileType:this.restrictFileType})),m("div",{className:"Modal-footer"},m(_.a,{onclick:this.hide.bind(this),className:"Button"},app.translator.trans("fof-upload.forum.buttons.cancel")),m(_.a,{onclick:this.onSelect.bind(this),disabled:0===this.selectedFiles.length||!this.multiSelect&&this.selectedFiles.length>1,className:"Button Button--primary"},app.translator.trans("fof-upload.forum.file_list.confirm_selection_btn",{fileCount:t})))))},i.onFileSelect=function(t){var e=this.selectedFiles.indexOf(t.id());e>=0?this.selectedFiles.splice(e,1):this.multiSelect?this.selectedFiles.push(t.id()):this.selectedFiles=[t.id()]},i.onUpload=function(){var t=this;this.uploader.on("success",(function(e){var i=e.file;t.multiSelect?t.selectedFiles.push(i.id()):t.selectedFiles=[i.id()]}))},i.onSelect=function(){this.hide(),this.attrs.onSelect?this.attrs.onSelect(this.selectedFiles):this.selectedFiles.map((function(t){var e=app.store.getById("files",t);app.composer.editor.insertAtCursor(e.bbcode()+"\n")}))},e}(A.a),J=function(t){function e(){return t.apply(this,arguments)||this}Object(d.a)(e,t);var i=e.prototype;return i.view=function(){return m(k.a,{text:n.a.translator.trans("fof-upload.forum.buttons.media")},_.a.component({className:"Button fof-upload-button Button--icon",onclick:this.fileManagerButtonClicked.bind(this),icon:"fas fa-photo-video"}))},i.fileManagerButtonClicked=function(t){t.preventDefault(),n.a.modal.show(G,{uploader:this.attrs.uploader})},e}(w.a),K=function(t){function e(){return t.apply(this,arguments)||this}Object(d.a)(e,t);var i=e.prototype;return i.oninit=function(e){t.prototype.oninit.call(this,e),this.user=null,this.loadUser(m.route.param("username"))},i.content=function(){return app.session.user&&(app.session.user.viewOthersMediaLibrary()||this.user===app.session.user)?this.user&&V.component({user:this.user,selectable:!1,downloadOnClick:!0}):null},i.show=function(e){t.prototype.show.call(this,e),this.user=e},e}(r.a),Q=i(17),W=i.n(Q),X={DragAndDrop:j,FileManagerButton:J,FileManagerModal:G,UserFileList:V,Uploader:U};n.a.initializers.add("fof-upload",(function(){W.a.prototype.viewOthersMediaLibrary=c.a.attribute("fof-upload-viewOthersMediaLibrary"),W.a.prototype.deleteOthersMediaLibrary=c.a.attribute("fof-upload-deleteOthersMediaLibrary"),Object(a.extend)(x.a.prototype,"oninit",(function(){this.uploader=new U})),Object(a.extend)(x.a.prototype,"controlItems",(function(t){if(n.a.forum.attribute("fof-upload.canUpload")){var e=n.a.forum.attribute("fof-upload.composerButtonVisiblity");"both"!==e&&"media-btn"!==e||t.add("fof-upload-media",J.component({uploader:this.uploader})),"both"!==e&&"upload-btn"!==e||t.add("fof-upload",T.component({uploader:this.uploader}))}})),Object(a.extend)(x.a.prototype,"oncreate",(function(t,e){var i=this;n.a.forum.attribute("fof-upload.canUpload")&&(this.uploader.on("success",(function(t){var e=t.file;if(t.addBBcode&&(i.attrs.composer.editor.insertAtCursor(e.bbcode()+"\n"),"function"==typeof i.attrs.preview)){var a=n.a.composer.isFullScreen;n.a.composer.isFullScreen=function(){return!1},i.attrs.preview(),n.a.composer.isFullScreen=a}})),this.dragAndDrop=new j((function(t){return i.uploader.upload(t)}),this.$().parents(".Composer")[0]),new E((function(t){return i.uploader.upload(t)}),this.$(".TextEditor-editor")[0]))})),Object(a.extend)(x.a.prototype,"onremove",(function(t,e){n.a.forum.attribute("fof-upload.canUpload")&&this.dragAndDrop.unload()})),Object(a.extend)(v.a.prototype,"oncreate",(function(){var t=this;this.$("[data-fof-upload-download-uuid]").unbind("click").on("click",(function(e){if(e.preventDefault(),e.stopPropagation(),n.a.forum.attribute("fof-upload.canDownload")){var i=n.a.forum.attribute("apiUrl")+"/fof/download";i+="/"+e.currentTarget.dataset.fofUploadDownloadUuid,i+="/"+t.attrs.post.id(),i+="/"+n.a.session.csrfToken,window.open(i)}else alert(n.a.translator.trans("fof-upload.forum.states.unauthorized"))}))})),n.a.store.models.files=h,n.a.fileListState=new g,n.a.routes["user.uploads"]={path:"/u/:username/uploads",component:K},Object(a.extend)(r.a.prototype,"navItems",(function(t){n.a.session.user&&(n.a.session.user.viewOthersMediaLibrary()||this.user===n.a.session.user)&&t.add("uploads",u.a.component({href:n.a.route("user.uploads",{username:this.user.username()}),name:"uploads",icon:"fas fa-file-upload"},this.user===n.a.session.user?n.a.translator.trans("fof-upload.forum.buttons.media"):n.a.translator.trans("fof-upload.forum.buttons.user_uploads")),80)}))}))}]);
//# sourceMappingURL=forum.js.map