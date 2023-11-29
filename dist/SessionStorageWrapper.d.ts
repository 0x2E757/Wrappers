import { StorageWrapper } from "./StorageWrapper.js";
export declare class SessionStorageWrapper<T = any> extends StorageWrapper<T> {
    get [Symbol.toStringTag](): string;
    constructor(key: string, defaultValue: T);
}
