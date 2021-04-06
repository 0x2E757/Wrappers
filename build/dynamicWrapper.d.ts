import { IfPrimitive, IfNumber, IfString, IfArray, Emitter, IWrappers } from "./types";
import { IWrapperBase, IPrimitiveWrapperHelpers, INumberWrapperHelpers, IStringWrapperHelpers, IArrayWrapperHelpers } from "./types";
export declare type IDynamicWrapper<T> = IWrapperBase<T> & IfPrimitive<T, IPrimitiveWrapperHelpers<T>> & IfNumber<T, INumberWrapperHelpers> & IfString<T, IStringWrapperHelpers> & IfArray<T, IArrayWrapperHelpers<T>>;
export declare const DynamicWrapper: {
    new <T, U extends unknown[]>(...args: [...wrappers: IWrappers<U>, emitter: Emitter<T, U>]): IDynamicWrapper<T>;
};
//# sourceMappingURL=dynamicWrapper.d.ts.map