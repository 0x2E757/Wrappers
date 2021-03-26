"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicWrapper = exports.StaticWrapper = void 0;
var Kind;
(function (Kind) {
    Kind[Kind["None"] = 0] = "None";
    Kind[Kind["Static"] = 1] = "Static";
    Kind[Kind["Reflecting"] = 2] = "Reflecting";
    Kind[Kind["Lazy"] = 3] = "Lazy";
})(Kind || (Kind = {}));
;
class Wrapper {
}
class StaticWrapper {
    constructor(value) {
        this.assign = (value) => {
            if (this.value !== value) {
                this.value = value;
                for (const subscriber of this.subscribers)
                    subscriber(value);
                for (const dependency of this.dependencies)
                    if (dependency.kind == Kind.Reflecting)
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
        this.kind = Kind.Static;
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
class DynamicWrapper {
    constructor(...args) {
        this.set = (value) => {
            throw new Error("Dynamic wrapper value cannot be set manually.");
        };
        this.setter = (value) => {
            throw new Error("Dynamic wrapper value cannot be set manually.");
        };
        this.toggle = () => {
            throw new Error("Dynamic wrapper value cannot be toggled.");
        };
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
        this.update = (kind) => {
            if (kind == Kind.None)
                if (!this.subscribers.size) {
                    for (const dependency of this.dependencies)
                        if (dependency.kind == Kind.Reflecting) {
                            kind = Kind.Reflecting;
                            break;
                        }
                    kind = Kind.Lazy;
                }
                else
                    kind = Kind.Reflecting;
            if (this.kind != kind) {
                this.kind = kind;
                for (const wrapper of this.wrappers)
                    if (wrapper.kind != Kind.Static)
                        wrapper.update(kind == Kind.Reflecting ? Kind.Reflecting : Kind.None);
            }
        };
        this.trigger = () => {
            this.pending = true;
            for (const subscriber of this.subscribers)
                subscriber(this.emit());
            for (const dependency of this.dependencies)
                if (dependency.kind == Kind.Reflecting)
                    dependency.trigger();
        };
        this.subscribe = (subscriber, triggerImmediately = false) => {
            this.subscribers.add(subscriber);
            this.update(Kind.Reflecting);
            if (triggerImmediately)
                subscriber(this.emit());
        };
        this.unsubscribe = (subscriber) => {
            this.subscribers.delete(subscriber);
            this.update(Kind.None);
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
        this.seq = (value) => {
            return this.emit() === value;
        };
        this.sneq = (value) => {
            return this.emit() !== value;
        };
        this.eq = (value) => {
            return this.emit() == value;
        };
        this.neq = (value) => {
            return this.emit() != value;
        };
        this.lt = (value) => {
            return this.emit() < value;
        };
        this.lte = (value) => {
            return this.emit() <= value;
        };
        this.gt = (value) => {
            return this.emit() > value;
        };
        this.gte = (value) => {
            return this.emit() >= value;
        };
        const emitter = args.pop();
        this.wrappers = args;
        this.emitter = emitter;
        this.kind = Kind.Lazy;
        this.pending = true;
        this.subscribers = new Set();
        this.dependencies = new Set();
        for (const wrapper of this.wrappers)
            wrapper.dependencies.add(this);
    }
    get [Symbol.toStringTag]() {
        return "DynamicWrapper";
    }
}
exports.DynamicWrapper = DynamicWrapper;
//# sourceMappingURL=index.js.map