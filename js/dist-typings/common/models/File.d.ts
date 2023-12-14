import Model from 'flarum/common/Model';
export default class File extends Model {
    baseName(): string;
    path(): string;
    url(): string;
    size(): number;
    type(): string;
    humanSize(): string;
    createdAt(): Date | null | undefined;
    uuid(): string;
    tag(): string;
    hidden(): boolean;
    bbcode(): string;
    isShared(): boolean;
    isPrivateShared(): boolean;
    canViewInfo(): boolean;
    canHide(): boolean;
    canDelete(): boolean;
    apiEndpoint(): string;
}
