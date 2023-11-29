import { StaticWrapper } from "./StaticWrapper.js";
export class StorageWrapper extends StaticWrapper {
    #storage;
    #key;
    static #getInitialValue = (storage, key, defaultValue) => {
        const valueStringified = storage.getItem(key);
        if (valueStringified !== null)
            return JSON.parse(valueStringified);
        return defaultValue;
    };
    constructor(storage, key, defaultValue) {
        super(StorageWrapper.#getInitialValue(storage, key, defaultValue));
        this.#storage = storage;
        this.#key = key;
        this.subscribe(this.#saveToStorage);
    }
    removeFromStorage = () => {
        this.#storage.removeItem(this.#key);
    };
    #saveToStorage = (value) => {
        const valueStringified = JSON.stringify(value);
        this.#storage.setItem(this.#key, valueStringified);
    };
}
