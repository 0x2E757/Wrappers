export type DeepReadonly<T> = T extends {} ? {
    readonly [K in keyof T]: T[K];
} : T;
export type Callback<T = any> = (value: DeepReadonly<T>) => void;
export type Emitter<T = any> = () => T;
