import { IStaticWrapper } from "./staticWrapper";
import { IDynamicWrapper } from "./dynamicWrapper";

export type IWrapper<T> = IStaticWrapper<T> | IDynamicWrapper<T>;

export type { IStaticWrapper } from "./staticWrapper";
export type { IDynamicWrapper } from "./dynamicWrapper";

export { StaticWrapper } from "./staticWrapper";
export { DynamicWrapper } from "./dynamicWrapper";