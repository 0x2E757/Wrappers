declare enum Kind {
    None = 0,
    Static = 1,
    Reflecting = 2,
    Lazy = 3
}
declare type Subscriber<T> = (value: T) => void;
declare type Emitter<T, U> = U extends unknown[] ? (...args: U) => T : () => T;
declare type Wrappers<T> = T extends [] ? [] : {
    [K in keyof T]: Wrapper<T[K]>;
};
declare type IWrappers<T> = T extends [] ? [] : {
    [K in keyof T]: IWrapper<T[K]>;
};
declare type Middleware<T> = (next: (value: T) => void) => (value: T) => void;
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
declare abstract class Wrapper<T> implements IWrapper<T> {
    abstract kind: Kind;
    abstract value: T;
    abstract pending: boolean;
    abstract subscribers: Set<Subscriber<T>>;
    abstract dependencies: Set<Wrapper<any>>;
    abstract set: (value: T) => void;
    abstract setter: (value: T) => () => void;
    abstract toggle: () => void;
    abstract emit: () => T;
    abstract update: (kind: Kind) => void;
    abstract trigger: () => void;
    abstract subscribe: (callback: Subscriber<T>, triggerImmediately?: boolean) => void;
    abstract unsubscribe: (callback: Subscriber<T>) => void;
    abstract applyMiddleware: (middleware: Middleware<T>) => void;
    abstract dispose: () => void;
    abstract seq: (value: T) => boolean;
    abstract sneq: (value: T) => boolean;
    abstract eq: (value: T) => boolean;
    abstract neq: (value: T) => boolean;
    abstract lt: (value: T) => boolean;
    abstract lte: (value: T) => boolean;
    abstract gt: (value: T) => boolean;
    abstract gte: (value: T) => boolean;
}
export declare class StaticWrapper<T> implements IWrapper<T> {
    protected kind: Kind;
    protected value: T;
    protected pending: boolean;
    protected subscribers: Set<Subscriber<T>>;
    protected dependencies: Set<Wrapper<any>>;
    protected middlewares: Middleware<T>[];
    set: (value: T) => void;
    constructor(value: T);
    get [Symbol.toStringTag](): string;
    protected assign: (value: T) => void;
    setter: (value: T) => () => void;
    toggle: () => void;
    emit: () => T;
    protected update: (kind: Kind) => never;
    protected trigger: () => never;
    subscribe: (subscriber: Subscriber<T>, triggerImmediately?: boolean) => void;
    unsubscribe: (subscriber: Subscriber<T>) => void;
    applyMiddleware: (middleware: Middleware<T>) => void;
    dispose: () => void;
    seq: (value: T) => boolean;
    sneq: (value: T) => boolean;
    eq: (value: T) => boolean;
    neq: (value: T) => boolean;
    lt: (value: T) => boolean;
    lte: (value: T) => boolean;
    gt: (value: T) => boolean;
    gte: (value: T) => boolean;
}
export declare class DynamicWrapper<T, U extends unknown[]> implements IWrapper<T> {
    protected wrappers: Wrappers<U>;
    protected emitter: Emitter<T, U>;
    protected kind: Kind;
    protected value: T;
    protected pending: boolean;
    protected subscribers: Set<Subscriber<T>>;
    protected dependencies: Set<Wrapper<any>>;
    constructor(...args: [...wrappers: IWrappers<U>, emitter: Emitter<T, U>]);
    get [Symbol.toStringTag](): string;
    set: (value: T) => never;
    setter: (value: T) => never;
    toggle: () => never;
    emit: () => T;
    protected update: (kind: Kind) => void;
    protected trigger: () => void;
    subscribe: (subscriber: Subscriber<T>, triggerImmediately?: boolean) => void;
    unsubscribe: (subscriber: Subscriber<T>) => void;
    applyMiddleware: (middleware: Middleware<T>) => never;
    dispose: () => void;
    seq: (value: T) => boolean;
    sneq: (value: T) => boolean;
    eq: (value: T) => boolean;
    neq: (value: T) => boolean;
    lt: (value: T) => boolean;
    lte: (value: T) => boolean;
    gt: (value: T) => boolean;
    gte: (value: T) => boolean;
}
export {};
//# sourceMappingURL=index.d.ts.map