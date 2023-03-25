import { ElementOf, IBaseWrapperHelpers, INumberWrapperHelpers, IStringWrapperHelpers, IArrayWrapperHelpers, Wrapper } from "./types";

export class WrapperHelpers<T> implements IBaseWrapperHelpers<T>, INumberWrapperHelpers, IStringWrapperHelpers, IArrayWrapperHelpers<T> {

    protected value!: T;
    protected emit!: () => T;

    protected isBooleanWrapper!: () => this is Wrapper<boolean>;
    protected isNumberWrapper!: () => this is Wrapper<number>;
    protected isStringWrapper!: () => this is Wrapper<string>;
    protected isArrayWrapper!: () => this is Wrapper<ElementOf<T>[]>;

    public eq = (value: T): boolean => {
        return this.value === value;
    }

    public neq = (value: T): boolean => {
        return this.value !== value;
    }

    public lt = (value: number): boolean => {
        if (this.isNumberWrapper())
            return this.value < value;
        else
            throw new Error("Only number type wrapper value can be compared with number.");
    }

    public lte = (value: number): boolean => {
        if (this.isNumberWrapper())
            return this.value <= value;
        else
            throw new Error("Only number type wrapper value can be compared with number.");
    }

    public gt = (value: number): boolean => {
        if (this.isNumberWrapper())
            return this.value > value;
        else
            throw new Error("Only number type wrapper value can be compared with number.");
    }

    public gte = (value: number): boolean => {
        if (this.isNumberWrapper())
            return this.value >= value;
        else
            throw new Error("Only number type wrapper value can be compared with number.");
    }

    public in = (min: number, max: number): boolean => {
        if (this.isNumberWrapper()) {
            return this.value < min ? false : this.value > max ? false : true;
        } else
            throw new Error("Only number type wrapper value can be checked to be in range.");
    }

    public match = (regExp: RegExp): boolean => {
        if (this.isStringWrapper()) {
            return regExp.test(this.value);
        } else
            throw new Error("Only string type wrapper value can be checked to match RegExp.");
    }

    public get first(): ElementOf<T> | undefined {
        if (this.isArrayWrapper())
            return this.value[0];
        else
            throw new Error("Property first allowed only for array type value wrapper.");
    }

    public get last(): ElementOf<T> | undefined {
        if (this.isArrayWrapper())
            return this.value[this.value.length - 1];
        else
            throw new Error("Property last allowed only for array type value wrapper.");
    }

    public every = (callback: (value: ElementOf<T>) => boolean): boolean => {
        if (this.isArrayWrapper()) {
            if (this.value.every !== undefined)
                return this.value.every(callback);
            for (const item of this.value)
                if (!callback(item))
                    return false;
            return true;
        } else
            throw new Error("Method every allowed only for array type value wrapper.");
    }

    public some = (callback: (value: ElementOf<T>) => boolean): boolean => {
        if (this.isArrayWrapper()) {
            if (this.value.some !== undefined)
                return this.value.some(callback);
            for (const item of this.value)
                if (callback(item))
                    return true;
            return false;
        } else
            throw new Error("Method some allowed only for array type value wrapper.");
    }

    public none = (callback: (value: ElementOf<T>) => boolean): boolean => {
        if (this.isArrayWrapper()) {
            for (const item of this.value)
                if (callback(item))
                    return false;
            return true;
        } else
            throw new Error("Method none allowed only for array type value wrapper.");
    }

    public get length(): number {
        if (this.isStringWrapper()) {
            return this.value.length;
        }
        if (this.isArrayWrapper()) {
            return this.value.length;
        }
        throw new Error("Property length allowed only for string and array type value wrapper.");
    }

    public contains: {
        (value: string): boolean;
        (value: ElementOf<T>): boolean;
    } = (...args: any[]): any => {
        if (this.isStringWrapper()) {
            type ExpectedArgs = [string];
            const [value]: ExpectedArgs = <ExpectedArgs>args;
            return this.value.indexOf(value) >= 0;
        }
        if (this.isArrayWrapper()) {
            type ExpectedArgs = [ElementOf<T>];
            const [value]: ExpectedArgs = <ExpectedArgs>args;
            return this.value.indexOf(value) >= 0;
        }
        throw new Error("Method length allowed only for string and array type value wrapper.");
    }

}