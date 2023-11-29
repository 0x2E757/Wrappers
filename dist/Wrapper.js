import { DynamicWrapper } from "./DynamicWrapper.js";
import { StaticWrapper } from "./StaticWrapper.js";
function isEmitter(value) {
    return typeof value === "function";
}
export const Wrapper = function (emitterOrValue, delay) {
    return isEmitter(emitterOrValue) ? new DynamicWrapper(emitterOrValue, delay) : new StaticWrapper(emitterOrValue, delay);
};
