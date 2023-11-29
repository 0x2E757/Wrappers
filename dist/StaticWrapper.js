import { Subscribable } from "./Subscribable.js";
import { DependencyObserver } from "./DependencyObserver.js";
export class StaticWrapper extends Subscribable {
    #value;
    #delay;
    #timeout;
    #proxyHandler;
    get value() {
        if (DependencyObserver.enabled)
            DependencyObserver.add(this);
        if (typeof this.#value === "object" && this.#value !== null)
            return new Proxy(this.#value, this.#proxyHandler);
        return this.#value;
    }
    set value(newValue) {
        if (this.#value !== newValue) {
            this.#value = newValue;
            this.#trigger();
        }
    }
    get [Symbol.toStringTag]() {
        return "StaticWrapper";
    }
    constructor(value, delay) {
        super();
        this.#value = value;
        this.#delay = delay;
        this.#proxyHandler = { get: this.#get, set: this.#set };
    }
    #trigger = () => {
        if (this.#delay !== undefined) {
            clearTimeout(this.#timeout);
            this.#timeout = setTimeout(this.triggerCallbacks, this.#delay, this.#value);
        }
        else
            this.triggerCallbacks(this.#value);
    };
    #get = (target, key, receiver) => {
        const value = Reflect.get(target, key, receiver);
        if (typeof value === "object" && value !== null)
            return new Proxy(value, this.#proxyHandler);
        return value;
    };
    #set = (target, key, value, receiver) => {
        const currentValue = Reflect.get(target, key, receiver);
        if (currentValue !== value) {
            const success = Reflect.set(target, key, value, receiver);
            if (success)
                this.#trigger();
            return success;
        }
        else
            return true;
    };
}
