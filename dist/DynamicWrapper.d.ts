import { Subscribable } from "./Subscribable.js";
import { Emitter } from "./types.js";
export declare class DynamicWrapper<T = any> extends Subscribable<T> {
    #private;
    get value(): T;
    get [Symbol.toStringTag](): string;
    constructor(emitter: Emitter<T>, delay?: number);
    bind: (...wrappers: Subscribable[]) => void;
}
