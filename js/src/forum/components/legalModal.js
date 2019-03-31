import Component from "flarum/Component";
import Modal from 'flarum/components/Modal';
import uploadModal from './uploadModal';
import Button from 'flarum/components/Button';

class legalModal extends Modal {
  init() {
    super.init();
  }

  className() {
    return 'Modal--small';
  }

  title() {
    return app.translator.trans('flagrow-upload.forum.legal.title');
  }

  content() {
    return (
      <div className = "Modal-body">
        <div>
            <p>{app.translator.trans('flagrow-upload.forum.legal.desc')}</p>
            <p>{app.translator.trans('flagrow-upload.forum.legal.faq', {a: <a href="https://pretpark.club/veelgestelde-vragen" target="_blank"/>})}</p>
            <p>{app.translator.trans('flagrow-upload.forum.legal.policy', {a: <a href="https://pretpark.club/huisregels" target="_blank"/>})}</p>

            <div className="Form-group">
              {Button.component({
                className: 'Button Button--block Button--primary',
                children: app.translator.trans('flagrow-upload.forum.legal.agree'),
                onclick: this.accept.bind(this),
              })}

              {Button.component({
                className: 'Button Button--block',
                children: app.translator.trans('flagrow-upload.forum.legal.disagree'),
                onclick: this.decline.bind(this),
              })}
            </div>
        </div>
      </div>
    );
  }

  accept() {
    app.legalupload = true;
    uploadModal();
  }

  decline() {
    app.modal.close();
    app.legalupload = false;
  }
};

const modalFn = function() {
  const modal = new legalModal();
  app.modal.show(modal);
};

export default modalFn;
