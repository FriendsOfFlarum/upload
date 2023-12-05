import app from 'flarum/admin/app';
import Modal from 'flarum/common/components/Modal';

export default class UploadSharedFileModal extends Modal {
  className() {
    return 'UploadSharedFileModal Modal--medium';
  }

  title() {
    return app.translator.trans('fof-upload.lib.upload-shared-file-modal.title');
  }

  content() {
    return <div className="Modal-body">UploadSharedFileModal...</div>;
  }
}
