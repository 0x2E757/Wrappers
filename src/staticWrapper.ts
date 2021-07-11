import { ElementOf, IfPrimitive, IfBoolean, IfNumber, IfString, IfArray, Subscriber, Middleware } from "./types";
import { IWrapperBase, IPrimitiveWrapperHelpers, INumberWrapperHelpers, IStringWrapperHelpers, IArrayWrapperHelpers, Wrapper } from "./types";
import { WrapperHelpers } from "./wrapperHelpers";

interface IWrapperBaseExt<T> extends IWrapperBase<T> {
    readonly applyMiddleware: (middleware: Middleware<T>) => void;
    readonly set: (value: T, debounce?: number) => void;
    readonly setter: (value: T, debounce?: number) => () => void;
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

class WrapperHelpersExt<T> extends WrapperHelpers<T> implements IBooleanWrapperHelpers, INumberWrapperHelpersExt, IArrayWrapperHelpersExt<T> {

    protected trigger!: () => void;

    protected isBooleanWrapper = (): this is Wrapper<boolean> => {
        return typeof this.value === "boolean";
    }

    protected isNumberWrapper = (): this is Wrapper<number> => {
        return typeof this.value === "number";
    }

    protected isStringWrapper = (): this is Wrapper<string> => {
        return typeof this.value === "string";
    }

    protected isArrayWrapper = (): this is Wrapper<ElementOf<T>[]> => {
        return Array.isArray(this.value);
    }

    public toggle = (): void => {
        if (this.isBooleanWrapper())
            this.set(!this.value);
        else
            throw new Error("Only boolean type wrapper can be toggled.");
    }

    public inc = (delta?: number): void => {
        if (this.isNumberWrapper()) {
            this.set(this.value + (delta ?? 1));
        } else
            throw new Error("Only number type wrapper value can be rounded.");
    }

    public dec = (delta?: number): void => {
        if (this.isNumberWrapper()) {
            this.set(this.value - (delta ?? 1));
        } else
            throw new Error("Only number type wrapper value can be rounded.");
    }

    public round = (fractionDigits?: number): void => {
        if (this.isNumberWrapper()) {
            this.set(Number(this.value.toFixed(fractionDigits)));
        } else
            throw new Error("Only number type wrapper value can be rounded.");
    }

    public clamp = (min: number, max: number): void => {
        if (this.isNumberWrapper()) {
            this.set(this.value < min ? min : this.value > max ? max : this.value);
        } else
            throw new Error("Only number type wrapper value can be clamped.");
    }

    public pop = (): ElementOf<T> | undefined => {
        if (this.isArrayWrapper()) {
            const result = this.value.pop();
            this.set([...this.value]);
            return result;
        } else
            throw new Error("Method pop allowed only for array type value wrapper.");
    }

    public popm = (): ElementOf<T> | undefined => {
        if (this.isArrayWrapper()) {
            const result = this.value.pop();
            this.trigger();
            return result;
        } else
            throw new Error("Method popm allowed only for array type value wrapper.");
    }

    public push = (...values: ElementOf<T>[]): number => {
        if (this.isArrayWrapper()) {
            const result = this.value.push(...values);
            this.set([...this.value]);
            return result;
        } else
            throw new Error("Method push allowed only for array type value wrapper.");
    }

    public pushm = (...values: ElementOf<T>[]): number => {
        if (this.isArrayWrapper()) {
            const result = this.value.push(...values);
            this.trigger();
            return result;
        } else
            throw new Error("Method pushm allowed only for array type value wrapper.");
    }

    public shift = (): ElementOf<T> | undefined => {
        if (this.isArrayWrapper()) {
            const result = this.value.shift();
            this.set([...this.value]);
            return result;
        } else
            throw new Error("Method shift allowed only for array type value wrapper.");
    }

    public shiftm = (): ElementOf<T> | undefined => {
        if (this.isArrayWrapper()) {
            const result = this.value.shift();
            this.trigger();
            return result;
        } else
            throw new Error("Method shiftm allowed only for array type value wrapper.");
    }

    public unshift = (...values: ElementOf<T>[]): number => {
        if (this.isArrayWrapper()) {
            const result = this.value.unshift(...values);
            this.set([...this.value]);
            return result;
        } else
            throw new Error("Method unshift allowed only for array type value wrapper.");
    }

    public unshiftm = (...values: ElementOf<T>[]): number => {
        if (this.isArrayWrapper()) {
            const result = this.value.unshift(...values);
            this.trigger();
            return result;
        } else
            throw new Error("Method unshiftm allowed only for array type value wrapper.");
    }

    public random: {
        (min: number, max: number, integer?: boolean): void;
        (): ElementOf<T> | undefined;
    } = (...args: any[]): any => {
        if (this.isNumberWrapper()) {
            type ExpectedArgs = [number, number, boolean];
            const [min, max, integer]: ExpectedArgs = <ExpectedArgs>args;
            const value = Math.random() * (max - min) + min;
            return this.set(integer ? Math.floor(value) : value);
        }
        if (this.isArrayWrapper()) {
            const index = Math.floor(Math.random() * this.value.length);
            return this.value[index];
        }
        throw new Error("Method random allowed only for number and array type value wrapper.");
    }

}

const staticWrapper = class <T> extends WrapperHelpersExt<T> implements IWrapperBaseExt<T> {

    protected value: T;
    protected debounce!: number;
    protected timeoutHandle!: number;
    protected subscribers: Set<Subscriber<T>>;
    protected dependencies: Set<Wrapper<any>>;
    protected middlewares!: Middleware<T>[];

    public set: (value: T, debounce?: number) => void;

    public constructor(value: T) {
        super();
        this.value = value;
        this.subscribers = new Set();
        this.dependencies = new Set();
        this.set = (value: T, debounce?: number) => this.assign(this.assignInner, value, debounce);
    }

    public get [Symbol.toStringTag](): string {
        return "StaticWrapper";
    }

    public applyMiddleware = (middleware: Middleware<T>): void => {
        this.middlewares ??= [];
        this.middlewares.unshift(middleware);
        let wrappedAssignInner: (value: T) => void = this.assignInner;
        for (const middleware of this.middlewares)
            wrappedAssignInner = middleware(wrappedAssignInner);
        this.set = (value: T, debounce?: number) => this.assign(wrappedAssignInner, value, debounce);
    }

    protected trigger = (): void => {
        for (const subscriber of this.subscribers)
            subscriber(this.value);
        for (const dependency of this.dependencies)
            dependency.trigger();
    }

    protected assign = (func: (value: T) => void, value: T, debounce?: number): any => {
        this.debounce = debounce || 0;
        if (this.timeoutHandle)
            clearTimeout(this.timeoutHandle);
        if (this.debounce)
            this.timeoutHandle = setTimeout(func, this.debounce, value);
        else
            func(value);
    }

    protected assignInner = (value: T): void => {
        if (this.value !== value) {
            this.value = value;
            this.trigger();
        }
    }

    public setter = (value: T, debounce?: number) => (): void => {
        this.set(value, debounce);
    }

    public emit = (): T => {
        return this.value;
    }

    public subscribe = (subscriber: Subscriber<T>, triggerImmediately: boolean = false): void => {
        this.subscribers.add(subscriber);
        if (triggerImmediately)
            subscriber(this.value);
    }

    public unsubscribe = (subscriber: Subscriber<T>): void => {
        this.subscribers.delete(subscriber);
    }

    public dispose = (): void => {
        if (this.dependencies.size)
            throw new Error("Cannot dispose wrapper that has dependencies, dispose dependencies first.");
        if (this.subscribers.size)
            console.warn("Disposing wrapper that has subscribers.");
    }

}

export type IStaticWrapper<T> =
    & IWrapperBaseExt<T>
    & IfPrimitive<T, IPrimitiveWrapperHelpers<T>>
    & IfBoolean<T, IBooleanWrapperHelpers>
    & IfNumber<T, INumberWrapperHelpersExt>
    & IfString<T, IStringWrapperHelpers>
    & IfArray<T, IArrayWrapperHelpersExt<T>>;

export const StaticWrapper: { new <T>(value: T): IStaticWrapper<T> } = staticWrapper as any;