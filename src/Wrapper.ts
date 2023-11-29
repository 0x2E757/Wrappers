import { DynamicWrapper } from "./DynamicWrapper.js";
import { StaticWrapper } from "./StaticWrapper.js";
import { Emitter } from "./types.js";

function isEmitter<T>(value: T | Emitter<T>): value is Emitter<T> {
    return typeof value === "function";
}

export const Wrapper: {
    new <T>(emitter: Emitter<T>, delay?: number): DynamicWrapper<T>;
    new <T>(value: T, delay?: number): StaticWrapper<T>;
} = function <T>(emitterOrValue: Emitter<T> | T, delay?: number) {
    return isEmitter(emitterOrValue) ? new DynamicWrapper(emitterOrValue, delay) : new StaticWrapper(emitterOrValue, delay);
} as any;
