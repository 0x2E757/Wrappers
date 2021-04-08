"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicWrapper = void 0;
const wrapperHelpers_1 = require("./wrapperHelpers");
class WrapperHelpersExt extends wrapperHelpers_1.WrapperHelpers {
    constructor() {
        super(...arguments);
        this.isBooleanWrapper = () => {
            return typeof this.emit() === "boolean";
        };
        this.isNumberWrapper = () => {
            return typeof this.emit() === "number";
        };
        this.isStringWrapper = () => {
            return typeof this.emit() === "string";
        };
        this.isArrayWrapper = () => {
            return Array.isArray(this.emit());
        };
    }
}
const dynamicWrapper = class extends WrapperHelpersExt {
    constructor(...args) {
        super();
        this.emit = () => {
            if (this.pending) {
                switch (this.wrappers.length) {
                    case 0:
                        this.value = this.emitter();
                        break;
                    case 1:
                        this.value = this.emitter(this.wrappers[0].emit());
                        break;
                    case 2:
                        this.value = this.emitter(this.wrappers[0].emit(), this.wrappers[1].emit());
                        break;
                    case 3:
                        this.value = this.emitter(this.wrappers[0].emit(), this.wrappers[1].emit(), this.wrappers[2].emit());
                        break;
                    case 4:
                        this.value = this.emitter(this.wrappers[0].emit(), this.wrappers[1].emit(), this.wrappers[2].emit(), this.wrappers[3].emit());
                        break;
                    case 5:
                        this.value = this.emitter(this.wrappers[0].emit(), this.wrappers[1].emit(), this.wrappers[2].emit(), this.wrappers[3].emit(), this.wrappers[4].emit());
                        break;
                    default: this.value = this.emitter(...this.wrappers.map(wrapper => wrapper.emit()));
                }
                this.pending = !this.wrappers.length;
            }
            return this.value;
        };
        this.trigger = () => {
            this.pending = true;
            for (const subscriber of this.subscribers)
                subscriber(this.emit());
            for (const dependency of this.dependencies)
                dependency.trigger();
        };
        this.subscribe = (subscriber, triggerImmediately = false) => {
            this.subscribers.add(subscriber);
            if (triggerImmediately)
                subscriber(this.emit());
        };
        this.unsubscribe = (subscriber) => {
            this.subscribers.delete(subscriber);
        };
        this.applyMiddleware = (middleware) => {
            throw new Error("Dynamic wrapper cannot have middleware.");
        };
        this.dispose = () => {
            if (this.dependencies.size)
                throw new Error("Cannot dispose wrapper that has dependencies, dispose dependencies first.");
            if (this.subscribers.size)
                console.warn("Disposing wrapper that has subscribers.");
            for (const wrapper of this.wrappers)
                wrapper.dependencies.delete(this);
        };
        const emitter = args.pop();
        this.wrappers = args;
        this.emitter = emitter;
        this.pending = true;
        this.subscribers = new Set();
        this.dependencies = new Set();
        for (const wrapper of this.wrappers)
            wrapper.dependencies.add(this);
    }
    get [Symbol.toStringTag]() {
        return "DynamicWrapper";
    }
};
exports.DynamicWrapper = dynamicWrapper;
//# sourceMappingURL=dynamicWrapper.js.map