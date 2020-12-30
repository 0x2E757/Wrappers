# Wrappers

TypeScript variable wrapper library, transpiled to ES2015 JavaScript.

## Install

```bash
npm i @0x2e757/wrappers
```

## Usage

Library contains two classes - `StaticWrapper` and` DynamicWrapper`, which are implementation of `IWrapper<T>` and `IComparable<T>` interfaces.

### How to import

```typescript
import { IWrapper, StaticWrapper, DynamicWrapper } from "@0x2e757/wrappers";
```

### IWrapper interface

```typescript
export interface IWrapper<T> {
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

### IComparable interface

```typescript
export interface IComparable<T> {
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
let mSomeValue = new StaticWrapper(0);
mSomeValue.subscribe(console.log);
mSomeValue.set(1);
mSomeValue.applyMiddleware((next) => (value) => {
    next(value > 5 ? 5 : value);
});
mSomeValue.set(10);
let someValue = mSomeValue.emit();
```

### DynamicWrapper

Advanced wrapper which contains dynamically computed value (it can not be set manually).

Usage example:
```typescript
let mUsername = new StaticWrapper("John");
let mBalance = new StaticWrapper(100);
let mBankAccountInfo = new DynamicWrapper(mUsername, mBalance, (username, balance) => `${username} has ${balance}$.`);
mBankAccountInfo.subscribe(console.log, true);
mBalance.set(mBalance.emit() - 50);
// Console output:
// > John has 100$.
// > John has 50$.
```