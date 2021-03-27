export enum Kind { None, Static, Reflecting, Lazy };
export type Subscriber<T> = (value: T) => void;
export type Emitter<T, U> = U extends unknown[] ? (...args: U) => T : () => T;
export type Wrappers<T> = T extends [] ? [] : { [K in keyof T]: Wrapper<T[K]> };
export type IWrappers<T> = T extends [] ? [] : { [K in keyof T]: IWrapper<T[K]> };
export type Middleware<T> = (next: (value: T) => void) => (value: T) => void;

export interface IComparable<T> {
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

export abstract class Wrapper<T> implements IWrapper<T> {

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