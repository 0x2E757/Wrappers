import { StaticWrapper } from "./StaticWrapper.js";

export class StorageWrapper<T = any> extends StaticWrapper<T> {

    #storage: Storage;
    #key: string;

    static #getInitialValue = <T>(storage: Storage, key: string, defaultValue: T) => {
        const valueStringified = storage.getItem(key);
        if (valueStringified !== null)
            return JSON.parse(valueStringified) as T;
        return defaultValue;
    }

    public constructor(storage: Storage, key: string, defaultValue: T) {
        super(StorageWrapper.#getInitialValue(storage, key, defaultValue));
        this.#storage = storage;
        this.#key = key;
        this.subscribe(this.#saveToStorage);
    }

    public removeFromStorage = () => {
        this.#storage.removeItem(this.#key);
    }

    #saveToStorage = (value: T) => {
        const valueStringified = JSON.stringify(value);
        this.#storage.setItem(this.#key, valueStringified);
    }

}
