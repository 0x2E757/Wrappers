import { StorageWrapper } from "./StorageWrapper.js";
export class SessionStorageWrapper extends StorageWrapper {
    get [Symbol.toStringTag]() {
        return "SessionStorageWrapper";
    }
    constructor(key, defaultValue) {
        super(sessionStorage, key, defaultValue);
    }
}
