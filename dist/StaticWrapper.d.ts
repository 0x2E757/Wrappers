import { Subscribable } from "./Subscribable.js";
export declare class StaticWrapper<T = any> extends Subscribable<T> {
    #private;
    get value(): T;
    set value(newValue: T);
    get [Symbol.toStringTag](): string;
    constructor(value: T, delay?: number);
}
