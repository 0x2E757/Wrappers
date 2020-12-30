enum Kind { None, Static, Reflecting, Lazy };
type Subscriber<T> = (value: T) => void;
type Emitter<T, U> = U extends unknown[] ? (...args: U) => T : () => T;
type Wrappers<T> = T extends [] ? [] : { [K in keyof T]: Wrapper<T[K]> };
type IWrappers<T> = T extends [] ? [] : { [K in keyof T]: IWrapper<T[K]> };
type Middleware<T> = (next: (value: T) => void) => (value: T) => void;

interface IComparable<T> {
    seq: (value: T) => boolean;
    sneq: (value: T) => boolean;
    eq: (value: T) => boolean;
    neq: (value: T) => boolean;
    lt: (value: T) => boolean;
    lte: (value: T) => boolean;
    gt: (value: T) => boolean;
    gte: (value: T) => boolean;
}

export interface IWrapper<T> extends IComparable<T> {
    set: (value: T) => void;
    setter: (value: T) => () => void;
    toggle: () => void;
    emit: () => T;
    subscribe: (callback: Subscriber<T>, triggerImmediately?: boolean) => void;
    unsubscribe: (callback: Subscriber<T>) => void;
    applyMiddleware: (middleware: Middleware<T>) => void;
    dispose: () => void;
}

abstract class Wrapper<T> implements IWrapper<T> {

    public abstract kind: Kind;
    public abstract value: T;
    public abstract pending: boolean;
    public abstract subscribers: Set<Subscriber<T>>;
    public abstract dependencies: Set<Wrapper<any>>;

    public abstract set: (value: T) => void;
    public abstract setter: (value: T) => () => void;
    public abstract toggle: () => void;
    public abstract emit: () => T;
    public abstract update: (kind: Kind) => void;
    public abstract trigger: () => void;
    public abstract subscribe: (callback: Subscriber<T>, triggerImmediately?: boolean) => void;
    public abstract unsubscribe: (callback: Subscriber<T>) => void;
    public abstract applyMiddleware: (middleware: Middleware<T>) => void;
    public abstract dispose: () => void;

    public abstract seq: (value: T) => boolean;
    public abstract sneq: (value: T) => boolean;
    public abstract eq: (value: T) => boolean;
    public abstract neq: (value: T) => boolean;
    public abstract lt: (value: T) => boolean;
    public abstract lte: (value: T) => boolean;
    public abstract gt: (value: T) => boolean;
    public abstract gte: (value: T) => boolean;

}

export class StaticWrapper<T> implements IWrapper<T> {

    protected kind: Kind;
    protected value: T;
    protected pending: boolean;
    protected subscribers: Set<Subscriber<T>>;
    protected dependencies: Set<Wrapper<any>>;
    protected middlewares!: Middleware<T>[];

    public set: (value: T) => void;

    public constructor(value: T) {
        this.kind = Kind.Static;
        this.value = value;
        this.pending = false;
        this.subscribers = new Set();
        this.dependencies = new Set();
        this.set = this.assign;
    }

    public get [Symbol.toStringTag](): string {
        return "StaticWrapper";
    }

    protected assign = (value: T): void => {
        if (this.value !== value) {
            this.value = value;
            for (const subscriber of this.subscribers)
                subscriber(value);
            for (const dependency of this.dependencies)
                if (dependency.kind == Kind.Reflecting)
                    dependency.trigger();
        }
    }

    public setter = (value: T) => (): void => {
        this.set(value);
    }

    public toggle = (): void => {
        if ((this.value as unknown) === true)
            return this.set(false as any);
        if ((this.value as unknown) === false)
            return this.set(true as any);
        throw new Error("Only boolean value type wrapper can be toggled.");
    }

    public emit = (): T => {
        return this.value;
    }

    protected update = (kind: Kind): never => {
        throw new Error("Static wrapper kind cannot be changed.");
    }

    protected trigger = (): never => {
        throw new Error("Static wrapper cannot be triggered.");
    }

    public subscribe = (subscriber: Subscriber<T>, triggerImmediately: boolean = false): void => {
        this.subscribers.add(subscriber);
        if (triggerImmediately)
            subscriber(this.value);
    }

    public unsubscribe = (subscriber: Subscriber<T>): void => {
        this.subscribers.delete(subscriber);
    }

    public applyMiddleware = (middleware: Middleware<T>): void => {
        this.middlewares ??= [];
        this.middlewares.unshift(middleware);
        this.set = this.assign;
        for (const middleware of this.middlewares)
            this.set = middleware(this.set);
    }

    public dispose = (): void => {
        if (this.dependencies.size)
            throw new Error("Cannot dispose wrapper that has dependencies, dispose dependencies first.");
        if (this.subscribers.size)
            console.warn("Disposing wrapper that has subscribers.");
    }

    public seq = (value: T): boolean => {
        return this.value === value;
    }

    public sneq = (value: T): boolean => {
        return this.value !== value;
    }

    public eq = (value: T): boolean => {
        return this.value == value;
    }

    public neq = (value: T): boolean => {
        return this.value != value;
    }

    public lt = (value: T): boolean => {
        return this.value < value;
    }

    public lte = (value: T): boolean => {
        return this.value <= value;
    }

    public gt = (value: T): boolean => {
        return this.value > value;
    }

    public gte = (value: T): boolean => {
        return this.value >= value;
    }

}

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