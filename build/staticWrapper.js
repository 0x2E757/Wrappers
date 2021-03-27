"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticWrapper = void 0;
const types_1 = require("./types");
class StaticWrapper {
    constructor(value) {
        this.assign = (value) => {
            if (this.value !== value) {
                this.value = value;
                for (const subscriber of this.subscribers)
                    subscriber(value);
                for (const dependency of this.dependencies)
                    if (dependency.kind == types_1.Kind.Reflecting)
                        dependency.trigger();
            }
        };
        this.setter = (value) => () => {
            this.set(value);
        };
        this.toggle = () => {
            if (this.value === true)
                return this.set(false);
            if (this.value === false)
                return this.set(true);
            throw new Error("Only boolean value type wrapper can be toggled.");
        };
        this.emit = () => {
            return this.value;
        };
        this.update = (kind) => {
            throw new Error("Static wrapper kind cannot be changed.");
        };
        this.trigger = () => {
            throw new Error("Static wrapper cannot be triggered.");
        };
        this.subscribe = (subscriber, triggerImmediately = false) => {
            this.subscribers.add(subscriber);
            if (triggerImmediately)
                subscriber(this.value);
        };
        this.unsubscribe = (subscriber) => {
            this.subscribers.delete(subscriber);
        };
        this.applyMiddleware = (middleware) => {
            var _a;
            (_a = this.middlewares) !== null && _a !== void 0 ? _a : (this.middlewares = []);
            this.middlewares.unshift(middleware);
            this.set = this.assign;
            for (const middleware of this.middlewares)
                this.set = middleware(this.set);
        };
        this.dispose = () => {
            if (this.dependencies.size)
                throw new Error("Cannot dispose wrapper that has dependencies, dispose dependencies first.");
            if (this.subscribers.size)
                console.warn("Disposing wrapper that has subscribers.");
        };
        this.seq = (value) => {
            return this.value === value;
        };
        this.sneq = (value) => {
            return this.value !== value;
        };
        this.eq = (value) => {
            return this.value == value;
        };
        this.neq = (value) => {
            return this.value != value;
        };
        this.lt = (value) => {
            return this.value < value;
        };
        this.lte = (value) => {
            return this.value <= value;
        };
        this.gt = (value) => {
            return this.value > value;
        };
        this.gte = (value) => {
            return this.value >= value;
        };
        this.kind = types_1.Kind.Static;
        this.value = value;
        this.pending = false;
        this.subscribers = new Set();
        this.dependencies = new Set();
        this.set = this.assign;
    }
    get [Symbol.toStringTag]() {
        return "StaticWrapper";
    }
}
exports.StaticWrapper = StaticWrapper;
//# sourceMappingURL=staticWrapper.js.map