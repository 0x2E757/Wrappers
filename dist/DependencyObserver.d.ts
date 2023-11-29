import { Subscribable } from "./Subscribable.js";
export declare class DependencyObserver {
    static enabled: boolean;
    static wrappers: Set<Subscribable<any>>;
    static enable: () => void;
    static disable: () => void;
    static add: (wrapper: Subscribable) => void;
}
