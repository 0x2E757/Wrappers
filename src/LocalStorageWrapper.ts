import { StorageWrapper } from "./StorageWrapper.js";

export class LocalStorageWrapper<T = any> extends StorageWrapper<T> {

    public get [Symbol.toStringTag](): string {
        return "LocalStorageWrapper";
    }

    public constructor(key: string, defaultValue: T) {
        super(localStorage, key, defaultValue);
    }

}
