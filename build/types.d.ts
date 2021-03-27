export declare enum Kind {
    None = 0,
    Static = 1,
    Reflecting = 2,
    Lazy = 3
}
export declare type Subscriber<T> = (value: T) => void;
export declare type Emitter<T, U> = U extends unknown[] ? (...args: U) => T : () => T;
export declare type Wrappers<T> = T extends [] ? [] : {
    [K in keyof T]: Wrapper<T[K]>;
};
export declare type IWrappers<T> = T extends [] ? [] : {
    [K in keyof T]: IWrapper<T[K]>;
};
export declare type Middleware<T> = (next: (value: T) => void) => (value: T) => void;
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
export declare abstract class Wrapper<T> implements IWrapper<T> {
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
//# sourceMappingURL=types.d.ts.map