import { Subscribable } from "./Subscribable.js";

export class DependencyObserver {

    public static enabled = false;
    public static wrappers = new Set<Subscribable>();

    public static enable = () => {
        DependencyObserver.wrappers.clear();
        DependencyObserver.enabled = true;
    }

    public static disable = () => {
        DependencyObserver.enabled = false;
    }

    public static add = (wrapper: Subscribable) => {
        DependencyObserver.wrappers.add(wrapper);
    }

}
