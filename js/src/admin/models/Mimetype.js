import Model from 'flarum/common/Model';
import mixin from 'flarum/common/utils/mixin';

export default class Webhook extends mixin(Model, {
    id: Model.attribute('id'),
    regex: Model.attribute('regex'),
    adapter: Model.attribute('adapter'),
    template: Model.attribute('template'),
}) {
    apiEndpoint() {
        return `/fof/upload/mimes${this.exists ? `/${this.data.id}` : ''}`;
    }
}
