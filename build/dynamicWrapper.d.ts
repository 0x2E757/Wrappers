import { Kind, Subscriber, Emitter, Wrappers, IWrappers, Middleware } from "./types";
import { IWrapper, Wrapper } from "./types";
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
//# sourceMappingURL=dynamicWrapper.d.ts.map