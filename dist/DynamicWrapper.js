import { Subscribable } from "./Subscribable.js";
import { DependencyObserver } from "./DependencyObserver.js";
export class DynamicWrapper extends Subscribable {
    #emitter;
    #delay;
    #timeout;
    #emitRequired;
    #value;
    get value() {
        if (DependencyObserver.enabled)
            DependencyObserver.add(this);
        if (this.#emitRequired) {
            this.#value = this.#emitter();
            this.#emitRequired = false;
        }
        return this.#value;
    }
    get [Symbol.toStringTag]() {
        return "DynamicWrapper";
    }
    constructor(emitter, delay) {
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
    bind = (...wrappers) => {
        for (const wrapper of wrappers)
            wrapper.subscribe(this.#trigger);
    };
    #trigger = () => {
        if (this.#delay !== undefined) {
            clearTimeout(this.#timeout);
            this.#timeout = setTimeout(this.#update, this.#delay);
        }
        else
            this.#update();
    };
    #update = () => {
        if (this.hasSubscribers) {
            const oldValue = this.#value;
            this.#value = this.#emitter();
            if (this.#value !== oldValue)
                this.triggerCallbacks(this.#value);
        }
        else
            this.#emitRequired = true;
    };
}
