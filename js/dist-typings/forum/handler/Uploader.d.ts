export default class Uploader {
    callbacks: {
        success: never[];
        failure: never[];
        uploading: never[];
        uploaded: never[];
    };
    uploading: boolean;
    setState(fileState: any): void;
    fileState: any;
    on(type: any, callback: any): void;
    dispatch(type: any, response: any): void;
    upload(files: any, addBBcode?: boolean): Promise<void>;
    uploaded(result: any, addBBcode?: boolean): void;
}
