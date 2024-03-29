import { Subscribable } from "./Subscribable.js";
import { DependencyObserver } from "./DependencyObserver.js";

export class StaticWrapper<T = any> extends Subscribable<T> {

    #value: T;
    #delay?: number;
    #timeout?: ReturnType<typeof setTimeout>;
    #proxyHandler: ProxyHandler<object>;

    public get value() {
        if (DependencyObserver.enabled)
            DependencyObserver.add(this);
        if (typeof this.#value === "object" && this.#value !== null)
            return new Proxy(this.#value!, this.#proxyHandler) as T;
        return this.#value;
    }

    public set value(newValue) {
        if (this.#value !== newValue) {
            this.#value = newValue;
            this.#trigger();
        }
    }

    public get [Symbol.toStringTag](): string {
        return "StaticWrapper";
    }

    public constructor(value: T, delay?: number) {
        super();
        this.#value = value;
        this.#delay = delay;
        this.#proxyHandler = { get: this.#get, set: this.#set };
    }

    #trigger = () => {
        if (this.#delay !== undefined) {
            clearTimeout(this.#timeout);
            this.#timeout = setTimeout(this.triggerCallbacks, this.#delay, this.#value);
        } else
            this.triggerCallbacks(this.#value);
    }

    #get = <T>(target: T, key: PropertyKey, receiver: unknown) => {
        const value = Reflect.get(target!, key, receiver);
        if (typeof value === "object" && value !== null)
            return new Proxy(value!, this.#proxyHandler) as T;
        return value;
    }

    #set = <T, U>(target: T, key: PropertyKey, value: U, receiver?: unknown) => {
        const currentValue = Reflect.get(target!, key, receiver);
        if (currentValue !== value) {
            const success = Reflect.set(target!, key, value, receiver);
            if (success)
                this.#trigger();
            return success;
        } else
            return true;
    }

}
