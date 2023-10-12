export default class Uploader {
    callbacks: {
        success: never[];
        failure: never[];
        uploading: never[];
        uploaded: never[];
    };
    uploading: boolean;
    on(type: any, callback: any): void;
    dispatch(type: any, response: any): void;
    upload(files: any, addBBcode?: boolean): Promise<void>;
    uploaded(result: any, addBBcode?: boolean): void;
}
