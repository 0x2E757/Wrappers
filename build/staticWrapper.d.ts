import { ElementOf, IfPrimitive, IfBoolean, IfNumber, IfString, IfArray, Middleware } from "./types";
import { IWrapperBase, IPrimitiveWrapperHelpers, INumberWrapperHelpers, IStringWrapperHelpers, IArrayWrapperHelpers } from "./types";
interface IWrapperBaseExt<T> extends IWrapperBase<T> {
    readonly applyMiddleware: (middleware: Middleware<T>) => void;
    readonly set: (value: T) => void;
    readonly setter: (value: T) => () => void;
}
interface IBooleanWrapperHelpers {
    readonly toggle: () => void;
}
interface INumberWrapperHelpersExt extends INumberWrapperHelpers {
    readonly inc: (delta?: number) => void;
    readonly dec: (delta?: number) => void;
    readonly random: (min: number, max: number, integer?: boolean) => void;
    readonly round: (fractionDigits?: number) => void;
    readonly clamp: (min: number, max: number) => void;
}
interface IArrayWrapperHelpersExt<T> extends IArrayWrapperHelpers<T> {
    readonly pop: () => ElementOf<T> | undefined;
    readonly popm: () => ElementOf<T> | undefined;
    readonly push: (...values: ElementOf<T>[]) => number;
    readonly pushm: (...values: ElementOf<T>[]) => number;
    readonly shift: () => ElementOf<T> | undefined;
    readonly shiftm: () => ElementOf<T> | undefined;
    readonly unshift: (...values: ElementOf<T>[]) => void;
    readonly unshiftm: (...values: ElementOf<T>[]) => void;
}
export declare type IStaticWrapper<T> = IWrapperBaseExt<T> & IfPrimitive<T, IPrimitiveWrapperHelpers<T>> & IfBoolean<T, IBooleanWrapperHelpers> & IfNumber<T, INumberWrapperHelpersExt> & IfString<T, IStringWrapperHelpers> & IfArray<T, IArrayWrapperHelpersExt<T>>;
export declare const StaticWrapper: {
    new <T>(value: T): IStaticWrapper<T>;
};
export {};
//# sourceMappingURL=staticWrapper.d.ts.map