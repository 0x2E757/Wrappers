import { StorageWrapper } from "./StorageWrapper.js";
export class LocalStorageWrapper extends StorageWrapper {
    get [Symbol.toStringTag]() {
        return "LocalStorageWrapper";
    }
    constructor(key, defaultValue) {
        super(localStorage, key, defaultValue);
    }
}
