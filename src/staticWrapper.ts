import { Kind, Subscriber, Middleware } from "./types";
import { IWrapper, Wrapper } from "./types";

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