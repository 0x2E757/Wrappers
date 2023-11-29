export class Subscribable {
    #callbacks;
    get hasSubscribers() {
        return this.#callbacks.size > 0;
    }
    constructor() {
        this.#callbacks = new Set();
    }
    get [Symbol.toStringTag]() {
        return "Subscribable";
    }
    subscribe = (arg) => {
        if (Array.isArray(arg))
            arg.forEach(this.#callbacks.add);
        else
            this.#callbacks.add(arg);
    };
    unsubscribe = (arg) => {
        if (Array.isArray(arg))
            arg.forEach(this.#callbacks.delete);
        else
            this.#callbacks.delete(arg);
    };
    triggerCallbacks = (value) => {
        for (const callback of this.#callbacks)
            callback(value);
    };
}
