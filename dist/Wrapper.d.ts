import { DynamicWrapper } from "./DynamicWrapper.js";
import { StaticWrapper } from "./StaticWrapper.js";
import { Emitter } from "./types.js";
export declare const Wrapper: {
    new <T>(emitter: Emitter<T>, delay?: number): DynamicWrapper<T>;
    new <T>(value: T, delay?: number): StaticWrapper<T>;
};
