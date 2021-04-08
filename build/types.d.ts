export declare type ElementOf<T> = T extends (infer E)[] ? E : never;
export declare type IfExtends<T, U, V, W = {}> = T extends U ? V : W;
export declare type IfPrimitive<T, U, V = {}> = IfExtends<T, boolean | number | string, U, V>;
export declare type IfBoolean<T, U, V = {}> = IfExtends<T, boolean, U, V>;
export declare type IfNumber<T, U, V = {}> = IfExtends<T, number, U, V>;
export declare type IfString<T, U, V = {}> = IfExtends<T, string, U, V>;
export declare type IfArray<T, U, V = {}> = IfExtends<T, ElementOf<T>[], U, V>;
export declare type Subscriber<T> = (value: T) => void;
export declare type Emitter<T, U> = U extends unknown[] ? (...args: U) => T : () => T;
export declare type Wrappers<T> = T extends [] ? [] : {
    [K in keyof T]: Wrapper<T[K]>;
};
export declare type IWrappers<T> = T extends [] ? [] : {
    [K in keyof T]: IWrapperBase<T[K]>;
};
export declare type Middleware<T> = (next: (value: T) => void) => (value: T) => void;
export interface IWrapperBase<T> {
    readonly emit: () => T;
    readonly subscribe: (callback: Subscriber<T>, triggerImmediately?: boolean) => void;
    readonly unsubscribe: (callback: Subscriber<T>) => void;
    readonly dispose: () => void;
}
export interface IPrimitiveWrapperHelpers<T> {
    readonly eq: (value: T) => boolean;
    readonly neq: (value: T) => boolean;
}
export interface INumberWrapperHelpers {
    readonly lt: (value: number) => boolean;
    readonly lte: (value: number) => boolean;
    readonly gt: (value: number) => boolean;
    readonly gte: (value: number) => boolean;
    readonly in: (min: number, max: number) => boolean;
}
export interface IStringWrapperHelpers {
    readonly length: number;
    readonly contains: (value: string) => boolean;
    readonly match: (regExp: RegExp) => boolean;
}
export interface IArrayWrapperHelpers<T> {
    readonly length: number;
    readonly first: ElementOf<T> | undefined;
    readonly last: ElementOf<T> | undefined;
    readonly contains: (value: ElementOf<T>) => boolean;
    readonly every: (callback: (value: ElementOf<T>) => boolean) => boolean;
    readonly some: (callback: (value: ElementOf<T>) => boolean) => boolean;
    readonly none: (callback: (value: ElementOf<T>) => boolean) => boolean;
}
export declare abstract class Wrapper<T> implements IWrapperBase<T> {
    abstract value: T;
    abstract dependencies: Set<Wrapper<any>>;
    abstract set: (value: T, debounce?: number) => void;
    abstract emit: () => T;
    abstract trigger: () => void;
    abstract subscribe: (callback: Subscriber<T>, triggerImmediately?: boolean) => void;
    abstract unsubscribe: (callback: Subscriber<T>) => void;
    abstract dispose: () => void;
}
//# sourceMappingURL=types.d.ts.map