import { StaticWrapper } from "./StaticWrapper.js";
export declare class StorageWrapper<T = any> extends StaticWrapper<T> {
    #private;
    constructor(storage: Storage, key: string, defaultValue: T);
    removeFromStorage: () => void;
}
