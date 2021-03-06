# Wrappers

TypeScript variable wrapper library, transpiled to ES2015 JavaScript.

## Install

```bash
npm i @0x2e757/wrappers
```

## Usage

Library contains two classes - `StaticWrapper` and` DynamicWrapper`, which are implementation of `IWrapper<T>` interface.

### How to import

```typescript
import { IWrapper, StaticWrapper, DynamicWrapper } from "@0x2e757/wrappers";
```

### IWrapper

```typescript
interface IWrapper<T> extends IComparable<T> {
    set: (value: T) => void;
    setter: (value: T) => () => void;
    toggle: () => void;
    emit: () => T;
    subscribe: (callback: Subscriber<T>, triggerImmediately?: boolean) => void;
    unsubscribe: (callback: Subscriber<T>) => void;
    applyMiddleware: (middleware: Middleware<T>) => void;
    dispose: () => void;
}
```

<sub>\* Methods `set`, `setter`, `toggle` and `applyMiddleware` are available only on StaticWrapper instances. Calling them from DynamicWrapper instance results in exception.</sub>

### IComparable

```typescript
interface IComparable<T> {
    seq: (value: T) => boolean;  // Strict equality check
    sneq: (value: T) => boolean; // Strict inequality check
    eq: (value: T) => boolean;  // Equality check
    neq: (value: T) => boolean; // Inequality check
    lt: (value: T) => boolean;  // Check value less than
    lte: (value: T) => boolean; // Check value less than or equal to
    gt: (value: T) => boolean;  // Check value greater than
    gte: (value: T) => boolean; // Check value greater than or equal to
}
```

### StaticWrapper

Simple wrapper that can be used as a value container with assignable on update callbacks.

Usage example:
```typescript
let wSomeValue = new StaticWrapper(0);
wSomeValue.subscribe(console.log);
wSomeValue.set(1);
wSomeValue.applyMiddleware((next) => (value) => {
    next(value > 5 ? 5 : value);
});
wSomeValue.set(10);
let someValue = wSomeValue.emit();
```

### DynamicWrapper

Advanced wrapper which contains dynamically computed value (it can not be set manually).

Usage example:
```typescript
let wUsername = new StaticWrapper("John");
let wBalance = new StaticWrapper(100);
let wBankAccountInfo = new DynamicWrapper(wUsername, wBalance, (username, balance) => `${username} has ${balance}$.`);
wBankAccountInfo.subscribe(console.log, true);
wBalance.set(wBalance.emit() - 50);
// Console output:
// > John has 100$.
// > John has 50$.
```