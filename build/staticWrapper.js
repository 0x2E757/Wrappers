"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticWrapper = void 0;
const wrapperHelpers_1 = require("./wrapperHelpers");
class WrapperHelpersExt extends wrapperHelpers_1.WrapperHelpers {
    constructor() {
        super(...arguments);
        this.isBooleanWrapper = () => {
            return typeof this.value === "boolean";
        };
        this.isNumberWrapper = () => {
            return typeof this.value === "number";
        };
        this.isStringWrapper = () => {
            return typeof this.value === "string";
        };
        this.isArrayWrapper = () => {
            return Array.isArray(this.value);
        };
        this.toggle = () => {
            if (this.isBooleanWrapper())
                this.set(!this.value);
            else
                throw new Error("Only boolean type wrapper can be toggled.");
        };
        this.inc = (delta) => {
            if (this.isNumberWrapper()) {
                this.set(this.value + (delta !== null && delta !== void 0 ? delta : 1));
            }
            else
                throw new Error("Only number type wrapper value can be rounded.");
        };
        this.dec = (delta) => {
            if (this.isNumberWrapper()) {
                this.set(this.value - (delta !== null && delta !== void 0 ? delta : 1));
            }
            else
                throw new Error("Only number type wrapper value can be rounded.");
        };
        this.round = (fractionDigits) => {
            if (this.isNumberWrapper()) {
                this.set(Number(this.value.toFixed(fractionDigits)));
            }
            else
                throw new Error("Only number type wrapper value can be rounded.");
        };
        this.clamp = (min, max) => {
            if (this.isNumberWrapper()) {
                this.set(this.value < min ? min : this.value > max ? max : this.value);
            }
            else
                throw new Error("Only number type wrapper value can be clamped.");
        };
        this.pop = () => {
            if (this.isArrayWrapper()) {
                const result = this.value.pop();
                this.set([...this.value]);
                return result;
            }
            else
                throw new Error("Method pop allowed only for array type value wrapper.");
        };
        this.popm = () => {
            if (this.isArrayWrapper()) {
                const result = this.value.pop();
                this.trigger();
                return result;
            }
            else
                throw new Error("Method popm allowed only for array type value wrapper.");
        };
        this.push = (...values) => {
            if (this.isArrayWrapper()) {
                const result = this.value.push(...values);
                this.set([...this.value]);
                return result;
            }
            else
                throw new Error("Method push allowed only for array type value wrapper.");
        };
        this.pushm = (...values) => {
            if (this.isArrayWrapper()) {
                const result = this.value.push(...values);
                this.trigger();
                return result;
            }
            else
                throw new Error("Method pushm allowed only for array type value wrapper.");
        };
        this.shift = () => {
            if (this.isArrayWrapper()) {
                const result = this.value.shift();
                this.set([...this.value]);
                return result;
            }
            else
                throw new Error("Method shift allowed only for array type value wrapper.");
        };
        this.shiftm = () => {
            if (this.isArrayWrapper()) {
                const result = this.value.shift();
                this.trigger();
                return result;
            }
            else
                throw new Error("Method shiftm allowed only for array type value wrapper.");
        };
        this.unshift = (...values) => {
            if (this.isArrayWrapper()) {
                const result = this.value.unshift(...values);
                this.set([...this.value]);
                return result;
            }
            else
                throw new Error("Method unshift allowed only for array type value wrapper.");
        };
        this.unshiftm = (...values) => {
            if (this.isArrayWrapper()) {
                const result = this.value.unshift(...values);
                this.trigger();
                return result;
            }
            else
                throw new Error("Method unshiftm allowed only for array type value wrapper.");
        };
        this.random = (...args) => {
            if (this.isNumberWrapper()) {
                const [min, max, integer] = args;
                const value = Math.random() * (max - min) + min;
                return this.set(integer ? Math.floor(value) : value);
            }
            if (this.isArrayWrapper()) {
                const index = Math.floor(Math.random() * this.value.length);
                return this.value[index];
            }
            throw new Error("Method random allowed only for number and array type value wrapper.");
        };
    }
}
const staticWrapper = class extends WrapperHelpersExt {
    constructor(value) {
        super();
        this.debounceWrap = (func, value, debounce) => {
            this.debounce = debounce || 0;
            func(value);
        };
        this.applyMiddleware = (middleware) => {
            var _a;
            (_a = this.middlewares) !== null && _a !== void 0 ? _a : (this.middlewares = []);
            this.middlewares.unshift(middleware);
            this.set = this.assign;
            for (const middleware of this.middlewares)
                this.set = middleware(this.set);
            this.set = (value, debounce) => this.debounceWrap(this.set, value, debounce);
        };
        this.trigger = () => {
            for (const subscriber of this.subscribers)
                subscriber(this.value);
            for (const dependency of this.dependencies)
                dependency.trigger();
        };
        this.assignInner = (value) => {
            if (this.value !== value) {
                this.value = value;
                this.trigger();
            }
        };
        this.assign = (value) => {
            if (this.timeoutHandle)
                clearTimeout(this.timeoutHandle);
            if (this.debounce)
                this.timeoutHandle = setTimeout(this.assignInner, this.debounce, value);
            else
                this.assignInner(value);
        };
        this.setter = (value, debounce) => () => {
            this.set(value, debounce);
        };
        this.emit = () => {
            return this.value;
        };
        this.subscribe = (subscriber, triggerImmediately = false) => {
            this.subscribers.add(subscriber);
            if (triggerImmediately)
                subscriber(this.value);
        };
        this.unsubscribe = (subscriber) => {
            this.subscribers.delete(subscriber);
        };
        this.dispose = () => {
            if (this.dependencies.size)
                throw new Error("Cannot dispose wrapper that has dependencies, dispose dependencies first.");
            if (this.subscribers.size)
                console.warn("Disposing wrapper that has subscribers.");
        };
        this.value = value;
        this.subscribers = new Set();
        this.dependencies = new Set();
        this.set = (value, debounce) => this.debounceWrap(this.assign, value, debounce);
    }
    get [Symbol.toStringTag]() {
        return "StaticWrapper";
    }
};
exports.StaticWrapper = staticWrapper;
//# sourceMappingURL=staticWrapper.js.map