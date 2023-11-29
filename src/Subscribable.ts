import { Callback, DeepReadonly } from "./types.js";

export class Subscribable<T = any> {

    #callbacks: Set<Callback<T>>;

    public get hasSubscribers() {
        return this.#callbacks.size > 0;
    }

    public constructor() {
        this.#callbacks = new Set();
    }

    public get [Symbol.toStringTag](): string {
        return "Subscribable";
    }

    public subscribe: {
        (callback: Callback<T>): void;
        (callbacks: Callback<T>[]): void;
    } = (arg) => {
        if (Array.isArray(arg))
            arg.forEach(this.#callbacks.add);
        else
            this.#callbacks.add(arg);
    }

    public unsubscribe: {
        (callback: Callback<T>): void;
        (callbacks: Callback<T>[]): void;
    } = (arg) => {
        if (Array.isArray(arg))
            arg.forEach(this.#callbacks.delete);
        else
            this.#callbacks.delete(arg);
    }

    protected triggerCallbacks = (value: T) => {
        for (const callback of this.#callbacks)
            callback(value as DeepReadonly<T>);
    }

}
