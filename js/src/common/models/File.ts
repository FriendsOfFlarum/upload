import Model from 'flarum/common/Model';

export default class File extends Model {
  baseName() {
    return Model.attribute<string>('baseName').call(this);
  }

  path() {
    return Model.attribute<string>('path').call(this);
  }

  url() {
    return Model.attribute<string>('url').call(this);
  }

  size() {
    return Model.attribute<number>('size').call(this);
  }

  type() {
    return Model.attribute<string>('type').call(this);
  }

  humanSize() {
    return Model.attribute<string>('humanSize').call(this);
  }

  createdAt() {
    return Model.attribute('createdAt', Model.transformDate).call(this);
  }

  uuid() {
    return Model.attribute<string>('uuid').call(this);
  }

  tag() {
    return Model.attribute<string>('tag').call(this);
  }

  hidden() {
    return Model.attribute<boolean>('hidden').call(this);
  }

  bbcode() {
    return Model.attribute<string>('bbcode').call(this);
  }

  isShared() {
    return Model.attribute<boolean>('shared').call(this);
  }

  isPrivateShared() {
    return Model.attribute<boolean>('isPrivateShared').call(this);
  }

  canViewInfo() {
    return Model.attribute<boolean>('canViewInfo').call(this);
  }

  canHide() {
    return Model.attribute<boolean>('canHide').call(this);
  }

  canDelete() {
    return Model.attribute<boolean>('canDelete').call(this);
  }

  apiEndpoint() {
    return '/fof/uploads' + (this.exists ? '/' + this.id() : '');
  }
}
