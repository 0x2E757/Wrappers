export class DependencyObserver {
    static enabled = false;
    static wrappers = new Set();
    static enable = () => {
        DependencyObserver.wrappers.clear();
        DependencyObserver.enabled = true;
    };
    static disable = () => {
        DependencyObserver.enabled = false;
    };
    static add = (wrapper) => {
        DependencyObserver.wrappers.add(wrapper);
    };
}
