import { StorageWrapper } from "./StorageWrapper.js";

export class SessionStorageWrapper<T = any> extends StorageWrapper<T> {

    public get [Symbol.toStringTag](): string {
        return "SessionStorageWrapper";
    }

    public constructor(key: string, defaultValue: T) {
        super(sessionStorage, key, defaultValue);
    }

}
