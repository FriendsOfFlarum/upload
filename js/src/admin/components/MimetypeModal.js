import Switch from 'flarum/common/components/Switch';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import icon from 'flarum/common/helpers/icon';
import Group from 'flarum/common/models/Group';
import Modal from 'flarum/common/components/Modal';
import Stream from 'flarum/common/utils/Stream';

export default class MimetypeModal extends Modal
{
    oninit(vnode) {
        super.oninit(vnode);

        this.config = this.attrs.config;

        this.regex = Stream(this.config.regex);
        this.adapter = Stream(this.config.adapter);
        this.template = Stream(this.config.template);
    }
    className() {
        return 'Modal--medium';
    }

    title() {
        return app.translator.trans('fof-upload.admin.settings.modal.title');
    }

    content() {
        return (
            <div className="FofWebhooksModal Modal-body">
                {app.translator.trans('fof-upload.admin.settings.modal.description')}

                <form className="Form" onsubmit={this.onsubmit.bind(this)}>
                </form>
            </div>
        );
    }

    isDirty() {
        return this.regex() !== this.config.regex()
            || this.adapter() !== this.config.adapter()
            || this.template() !== this.config.template();
    }

    onsubmit(e) {
        e.preventDefault();

        this.loading = true;

        return this.webhook
            .save({
                extraText: this.extraText(),
                group_id: this.groupId(),
            })
            .then(() => {
                this.loading = false;

                m.redraw();
            });
    }
}
