import { Subscribable } from "./Subscribable.js";
import { DependencyObserver } from "./DependencyObserver.js";
import { Emitter } from "./types.js";

export class DynamicWrapper<T = any> extends Subscribable<T> {

    #emitter: Emitter<T>;
    #delay?: number;
    #timeout?: ReturnType<typeof setTimeout>;
    #emitRequired: boolean;
    #value: T;

    public get value() {
        if (DependencyObserver.enabled)
            DependencyObserver.add(this);
        if (this.#emitRequired) {
            this.#value = this.#emitter();
            this.#emitRequired = false;
        }
        return this.#value;
    }

    public get [Symbol.toStringTag](): string {
        return "DynamicWrapper";
    }

    public constructor(emitter: Emitter<T>, delay?: number) {
        super();
        this.#emitter = emitter;
        this.#delay = delay;
        this.#emitRequired = false;
        DependencyObserver.enable();
        this.#value = this.#emitter();
        DependencyObserver.disable();
        for (const wrapper of DependencyObserver.wrappers)
            wrapper.subscribe(this.#trigger);
    }

    public bind = (...wrappers: Subscribable[]) => {
        for (const wrapper of wrappers)
            wrapper.subscribe(this.#trigger);
    }

    #trigger = () => {
        if (this.#delay !== undefined) {
            clearTimeout(this.#timeout);
            this.#timeout = setTimeout(this.#update, this.#delay);
        } else
            this.#update();
    }

    #update = () => {
        if (this.hasSubscribers) {
            const oldValue = this.#value;
            this.#value = this.#emitter();
            if (this.#value !== oldValue)
                this.triggerCallbacks(this.#value);
        } else
            this.#emitRequired = true;
    }

}
