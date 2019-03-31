import Component from "flarum/Component";
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';

class uploadModal extends Modal {
  init() {
    super.init();
  }

  className() {
    return 'Modal--small';
  }

  title() {
    return app.translator.trans('flagrow-upload.forum.upload.title');
  }

  content() {
    return (
      <div className = "Modal-body">
        <div>
            <p style="display: flex; justify-content: center; align-items: center;">
              <img src="data:image/gif;base64,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" width="16" style="margin:auto;" />
            </p>
        </div>
      </div>
    );
  }
};

const modalFn = function() {
  const modal = new uploadModal();
  app.modal.show(modal);
};

export default modalFn;
