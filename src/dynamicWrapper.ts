import { ElementOf, IfNumber, IfString, IfArray, Subscriber, Emitter, Wrappers, IWrappers, Middleware } from "./types";
import { IWrapperBase, IBaseWrapperHelpers, INumberWrapperHelpers, IStringWrapperHelpers, IArrayWrapperHelpers, Wrapper } from "./types";
import { WrapperHelpers } from "./wrapperHelpers";

class WrapperHelpersExt<T> extends WrapperHelpers<T> {

    protected isPrimitiveWrapper = (): this is Wrapper<boolean | number | string> => {
        const type: string = typeof this.emit();
        return type === "boolean" || type === "number" || type === "string";
    }

    protected isBooleanWrapper = (): this is Wrapper<boolean> => {
        return typeof this.emit() === "boolean";
    }

    protected isNumberWrapper = (): this is Wrapper<number> => {
        return typeof this.emit() === "number";
    }

    protected isStringWrapper = (): this is Wrapper<string> => {
        return typeof this.emit() === "string";
    }

    protected isArrayWrapper = (): this is Wrapper<ElementOf<T>[]> => {
        return Array.isArray(this.emit());
    }
}

const dynamicWrapper = class <T, U extends unknown[]> extends WrapperHelpersExt<T> implements IWrapperBase<T> {

    protected wrappers: Wrappers<U>;
    protected emitter: Emitter<T, U>;
    protected value!: T;
    protected pending: boolean;
    protected subscribers: Set<Subscriber<T>>;
    protected dependencies: Set<Wrapper<any>>;

    public constructor(...args: [...wrappers: IWrappers<U>, emitter: Emitter<T, U>]) {
        super();
        const emitter = args.pop();
        this.wrappers = args as unknown as Wrappers<U>;
        this.emitter = emitter as Emitter<T, U>;
        this.pending = true;
        this.subscribers = new Set();
        this.dependencies = new Set();
        for (const wrapper of this.wrappers)
            wrapper.dependencies.add(this as IWrapperBase<T> as Wrapper<T>);
    }

    public get [Symbol.toStringTag](): string {
        return "DynamicWrapper";
    }

    public emit = (): T => {
        if (this.pending) {
            switch (this.wrappers.length) {
                case 0: this.value = this.emitter(); break;
                case 1: this.value = this.emitter(this.wrappers[0].emit()); break;
                case 2: this.value = this.emitter(this.wrappers[0].emit(), this.wrappers[1].emit()); break;
                case 3: this.value = this.emitter(this.wrappers[0].emit(), this.wrappers[1].emit(), this.wrappers[2].emit()); break;
                case 4: this.value = this.emitter(this.wrappers[0].emit(), this.wrappers[1].emit(), this.wrappers[2].emit(), this.wrappers[3].emit()); break;
                case 5: this.value = this.emitter(this.wrappers[0].emit(), this.wrappers[1].emit(), this.wrappers[2].emit(), this.wrappers[3].emit(), this.wrappers[4].emit()); break;
                default: this.value = this.emitter(...this.wrappers.map(wrapper => wrapper.emit()));
            }
            this.pending = !this.wrappers.length;
        }
        return this.value;
    }

    protected trigger = (): void => {
        this.pending = true;
        for (const subscriber of this.subscribers)
            subscriber(this.emit());
        for (const dependency of this.dependencies)
            dependency.trigger();
    }

    public subscribe = (subscriber: Subscriber<T>, triggerImmediately: boolean = false): void => {
        this.subscribers.add(subscriber);
        if (triggerImmediately)
            subscriber(this.emit());
    }

    public unsubscribe = (subscriber: Subscriber<T>): void => {
        this.subscribers.delete(subscriber);
    }

    public applyMiddleware = (middleware: Middleware<T>): never => {
        throw new Error("Dynamic wrapper cannot have middleware.");
    }

    public dispose = (): void => {
        if (this.dependencies.size)
            throw new Error("Cannot dispose wrapper that has dependencies, dispose dependencies first.");
        if (this.subscribers.size)
            console.warn("Disposing wrapper that has subscribers.");
        for (const wrapper of this.wrappers)
            wrapper.dependencies.delete(this as IWrapperBase<T> as Wrapper<T>);
    }

}

export type IDynamicWrapper<T> =
    & IWrapperBase<T>
    & IBaseWrapperHelpers<T>
    & IfNumber<T, INumberWrapperHelpers>
    & IfString<T, IStringWrapperHelpers>
    & IfArray<T, IArrayWrapperHelpers<T>>;

export const DynamicWrapper: { new <T, U extends unknown[]>(...args: [...wrappers: IWrappers<U>, emitter: Emitter<T, U>]): IDynamicWrapper<T> } = dynamicWrapper as any;