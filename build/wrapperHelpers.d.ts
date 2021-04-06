import { ElementOf, IPrimitiveWrapperHelpers, INumberWrapperHelpers, IStringWrapperHelpers, IArrayWrapperHelpers, Wrapper } from "./types";
export declare class WrapperHelpers<T> implements IPrimitiveWrapperHelpers<T>, INumberWrapperHelpers, IStringWrapperHelpers, IArrayWrapperHelpers<T> {
    protected value: T;
    protected emit: () => T;
    protected isPrimitiveWrapper: () => this is Wrapper<boolean | number | string>;
    protected isBooleanWrapper: () => this is Wrapper<boolean>;
    protected isNumberWrapper: () => this is Wrapper<number>;
    protected isStringWrapper: () => this is Wrapper<string>;
    protected isArrayWrapper: () => this is Wrapper<ElementOf<T>[]>;
    eq: (value: T) => boolean;
    neq: (value: T) => boolean;
    lt: (value: number) => boolean;
    lte: (value: number) => boolean;
    gt: (value: number) => boolean;
    gte: (value: number) => boolean;
    in: (min: number, max: number) => boolean;
    match: (regExp: RegExp) => boolean;
    get first(): ElementOf<T> | undefined;
    get last(): ElementOf<T> | undefined;
    every: (callback: (value: ElementOf<T>) => boolean) => boolean;
    some: (callback: (value: ElementOf<T>) => boolean) => boolean;
    none: (callback: (value: ElementOf<T>) => boolean) => boolean;
    get length(): number;
    contains: {
        (value: string): boolean;
        (value: ElementOf<T>): boolean;
    };
}
//# sourceMappingURL=wrapperHelpers.d.ts.map