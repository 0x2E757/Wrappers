import { IStaticWrapper } from "./staticWrapper";
import { IDynamicWrapper } from "./dynamicWrapper";

export type IWrapper<T> = IStaticWrapper<T> | IDynamicWrapper<T>;

export { StaticWrapper, IStaticWrapper } from "./staticWrapper";
export { DynamicWrapper, IDynamicWrapper } from "./dynamicWrapper";