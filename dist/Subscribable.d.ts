import { Callback } from "./types.js";
export declare class Subscribable<T = any> {
    #private;
    get hasSubscribers(): boolean;
    constructor();
    get [Symbol.toStringTag](): string;
    subscribe: {
        (callback: Callback<T>): void;
        (callbacks: Callback<T>[]): void;
    };
    unsubscribe: {
        (callback: Callback<T>): void;
        (callbacks: Callback<T>[]): void;
    };
    protected triggerCallbacks: (value: T) => void;
}
