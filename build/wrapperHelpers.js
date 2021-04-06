"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrapperHelpers = void 0;
class WrapperHelpers {
    constructor() {
        this.eq = (value) => {
            if (this.isPrimitiveWrapper())
                return this.value === value;
            else
                throw new Error("Only primitive type (boolean, number or string) wrapper value can be compared for equality.");
        };
        this.neq = (value) => {
            if (this.isPrimitiveWrapper())
                return this.value !== value;
            else
                throw new Error("Only primitive type (boolean, number or string) wrapper value can be compared for inequality.");
        };
        this.lt = (value) => {
            if (this.isNumberWrapper())
                return this.value < value;
            else
                throw new Error("Only number type wrapper value can be compared with number.");
        };
        this.lte = (value) => {
            if (this.isNumberWrapper())
                return this.value <= value;
            else
                throw new Error("Only number type wrapper value can be compared with number.");
        };
        this.gt = (value) => {
            if (this.isNumberWrapper())
                return this.value > value;
            else
                throw new Error("Only number type wrapper value can be compared with number.");
        };
        this.gte = (value) => {
            if (this.isNumberWrapper())
                return this.value >= value;
            else
                throw new Error("Only number type wrapper value can be compared with number.");
        };
        this.in = (min, max) => {
            if (this.isNumberWrapper()) {
                return this.value < min ? false : this.value > max ? false : true;
            }
            else
                throw new Error("Only number type wrapper value can be checked to be in range.");
        };
        this.match = (regExp) => {
            if (this.isStringWrapper()) {
                return regExp.test(this.value);
            }
            else
                throw new Error("Only string type wrapper value can be checked to match RegExp.");
        };
        this.every = (callback) => {
            if (this.isArrayWrapper()) {
                if (this.value.every !== undefined)
                    return this.value.every(callback);
                for (const item of this.value)
                    if (!callback(item))
                        return false;
                return true;
            }
            else
                throw new Error("Method every allowed only for array type value wrapper.");
        };
        this.some = (callback) => {
            if (this.isArrayWrapper()) {
                if (this.value.some !== undefined)
                    return this.value.some(callback);
                for (const item of this.value)
                    if (callback(item))
                        return true;
                return false;
            }
            else
                throw new Error("Method some allowed only for array type value wrapper.");
        };
        this.none = (callback) => {
            if (this.isArrayWrapper()) {
                for (const item of this.value)
                    if (callback(item))
                        return false;
                return true;
            }
            else
                throw new Error("Method none allowed only for array type value wrapper.");
        };
        this.contains = (...args) => {
            if (this.isStringWrapper()) {
                const [value] = args;
                return this.value.indexOf(value) >= 0;
            }
            if (this.isArrayWrapper()) {
                const [value] = args;
                return this.value.indexOf(value) >= 0;
            }
            throw new Error("Method length allowed only for string and array type value wrapper.");
        };
    }
    get first() {
        if (this.isArrayWrapper())
            return this.value[0];
        else
            throw new Error("Property first allowed only for array type value wrapper.");
    }
    get last() {
        if (this.isArrayWrapper())
            return this.value[this.value.length - 1];
        else
            throw new Error("Property last allowed only for array type value wrapper.");
    }
    get length() {
        if (this.isStringWrapper()) {
            return this.value.length;
        }
        if (this.isArrayWrapper()) {
            return this.value.length;
        }
        throw new Error("Property length allowed only for string and array type value wrapper.");
    }
}
exports.WrapperHelpers = WrapperHelpers;
//# sourceMappingURL=wrapperHelpers.js.map