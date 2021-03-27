import { Kind, Subscriber, Emitter, Wrappers, IWrappers, Middleware } from "./types";
import { IWrapper, Wrapper } from "./types";

export class DynamicWrapper<T, U extends unknown[]> implements IWrapper<T> {

    protected wrappers: Wrappers<U>;
    protected emitter: Emitter<T, U>;
    protected kind: Kind;
    protected value!: T;
    protected pending: boolean;
    protected subscribers: Set<Subscriber<T>>;
    protected dependencies: Set<Wrapper<any>>;

    public constructor(...args: [...wrappers: IWrappers<U>, emitter: Emitter<T, U>]) {
        const emitter = args.pop();
        this.wrappers = args as unknown as Wrappers<U>;
        this.emitter = emitter as Emitter<T, U>;
        this.kind = Kind.Lazy;
        this.pending = true;
        this.subscribers = new Set();
        this.dependencies = new Set();
        for (const wrapper of this.wrappers)
            wrapper.dependencies.add(this as IWrapper<T> as Wrapper<T>);
    }

    public get [Symbol.toStringTag](): string {
        return "DynamicWrapper";
    }

    public set = (value: T): never => {
        throw new Error("Dynamic wrapper value cannot be set manually.");
    }

    public setter = (value: T): never => {
        throw new Error("Dynamic wrapper value cannot be set manually.");
    }

    public toggle = (): never => {
        throw new Error("Dynamic wrapper value cannot be toggled.");
    }

    public emit = (): T => {
        if (this.pending) {
            switch (this.wrappers.length) {
                case 0: this.value = this.emitter(); break;
                case 1: this.value = this.emitter(this.wrappers[0].emit()); break;
                case 2: this.value = this.emitter(this.wrappers[0].emit(), this.wrappers[1].emit()); break;
                case 3: this.value = this.emitter(this.wrappers[0].emit(), this.wrappers[1].emit(), this.wrappers[2].emit()); break;
                case 4: this.value = this.emitter(this.wrappers[0].emit(), this.wrappers[1].emit(), this.wrappers[2].emit(), this.wrappers[3].emit()); break;
                case 5: this.value = this.emitter(this.wrappers[0].emit(), this.wrappers[1].emit(), this.wrappers[2].emit(), this.wrappers[3].emit(), this.wrappers[4].emit()); break;
                default: this.value = this.emitter(...this.wrappers.map(wrapper => wrapper.emit()));
            }
            this.pending = !this.wrappers.length;
        }
        return this.value;
    }

    protected update = (kind: Kind): void => {
        if (kind == Kind.None)
            if (!this.subscribers.size) {
                for (const dependency of this.dependencies)
                    if (dependency.kind == Kind.Reflecting) {
                        kind = Kind.Reflecting;
                        break;
                    }
                kind = Kind.Lazy;
            } else
                kind = Kind.Reflecting;
        if (this.kind != kind) {
            this.kind = kind;
            for (const wrapper of this.wrappers)
                if (wrapper.kind != Kind.Static)
                    wrapper.update(kind == Kind.Reflecting ? Kind.Reflecting : Kind.None);
        }
    }

    protected trigger = (): void => {
        this.pending = true;
        for (const subscriber of this.subscribers)
            subscriber(this.emit());
        for (const dependency of this.dependencies)
            if (dependency.kind == Kind.Reflecting)
                dependency.trigger();
    }

    public subscribe = (subscriber: Subscriber<T>, triggerImmediately: boolean = false): void => {
        this.subscribers.add(subscriber);
        this.update(Kind.Reflecting);
        if (triggerImmediately)
            subscriber(this.emit());
    }

    public unsubscribe = (subscriber: Subscriber<T>): void => {
        this.subscribers.delete(subscriber);
        this.update(Kind.None);
    }

    public applyMiddleware = (middleware: Middleware<T>): never => {
        throw new Error("Dynamic wrapper cannot have middleware.");
    }

    public dispose = (): void => {
        if (this.dependencies.size)
            throw new Error("Cannot dispose wrapper that has dependencies, dispose dependencies first.");
        if (this.subscribers.size)
            console.warn("Disposing wrapper that has subscribers.");
        for (const wrapper of this.wrappers)
            wrapper.dependencies.delete(this as IWrapper<T> as Wrapper<T>);
    }

    public seq = (value: T): boolean => {
        return this.emit() === value;
    }

    public sneq = (value: T): boolean => {
        return this.emit() !== value;
    }

    public eq = (value: T): boolean => {
        return this.emit() == value;
    }

    public neq = (value: T): boolean => {
        return this.emit() != value;
    }

    public lt = (value: T): boolean => {
        return this.emit() < value;
    }

    public lte = (value: T): boolean => {
        return this.emit() <= value;
    }

    public gt = (value: T): boolean => {
        return this.emit() > value;
    }

    public gte = (value: T): boolean => {
        return this.emit() >= value;
    }

}