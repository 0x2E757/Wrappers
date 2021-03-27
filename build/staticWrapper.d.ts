import { Kind, Subscriber, Middleware } from "./types";
import { IWrapper, Wrapper } from "./types";
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
//# sourceMappingURL=staticWrapper.d.ts.map