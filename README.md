# Wrappers

TypeScript variable wrapper library, transpiled to ES2015 JavaScript. Library contains few getters, for supporting older JavaScript versions you will need to fork this project and change getters to functions.

## Install

```bash
npm i @0x2e757/wrappers
```

## Usage

Library contains two classes you are interested in - `StaticWrapper` and `DynamicWrapper`. Also there are `IStaticWrapper` and `IDynamicWrapper` interfaces, as well as general `IWrapper` interface, which will work for both classes but will only contain those methods that are implemented in both classes.

### How to import

```typescript
import { IWrapper, IStaticWrapper, StaticWrapper, IDynamicWrapper, DynamicWrapper } from "@0x2e757/wrappers";
```

### StaticWrapper

Simple wrapper that can be used as a value container with assignable on update callbacks (subscribers).

Usage example:
```typescript
import { StaticWrapper } from "@0x2e757/wrappers";

const wSomeValue = new StaticWrapper(0);
wSomeValue.applyMiddleware(next => value => next(value > 5 ? 5 : value));
wSomeValue.subscribe(console.log, true);
wSomeValue.set(1);
wSomeValue.set(10);

// Console output:
// > 0
// > 1
// > 5
```

### DynamicWrapper

Advanced wrapper which contains dynamically computed value (it can not be set manually). Values are being computed only before they are going to be used.

Usage example:
```typescript
import { StaticWrapper, DynamicWrapper } from "@0x2e757/wrappers";

const wUsername = new StaticWrapper("John");
const wBalance = new StaticWrapper(100);

const wAccountInfo = new DynamicWrapper(wUsername, wBalance, (username, balance) => `${username} has ${balance}$.`);
wAccountInfo.subscribe(console.log, true);

wBalance.dec(50);

// Console output:
// > John has 100$.
// > John has 50$.
```

## Available methods

### General

Wrappers are always implementing base interface `IWrapperBase`:

```typescript
interface IWrapperBase<T> {
  * set: (value: T, debounce?: number) => void;
  * setter: (value: T, debounce?: number) => () => void;
  * applyMiddleware: (middleware: Middleware<T>) => void;
    emit: () => T;
    subscribe: (callback: Subscriber<T>, triggerImmediately?: boolean) => void;
    unsubscribe: (callback: Subscriber<T>) => void;
    dispose: () => void;
}
```
<sub>\* Methods `set`, `setter` and `applyMiddleware` are available only in StaticWrapper instances.</sub>

### Helpers

Depending on wrapper value type different helper methods (few of them are getter properties) are available. They can modify wrapper's value (in static wrappers only) or perform some action with value and return a result. In fact, all of them always exist in class objects, but for static typing purposes using TypeScript types they are hidden from IDE and static code analyzer.

```typescript
interface IBaseWrapperHelpers<T> {
    eq: (value: T) => boolean;
    neq: (value: T) => boolean;
}
```
<sub>Available in both StaticWrapper and DynamicWrapper instances.</sub>

```typescript
interface IBooleanWrapper {
  * toggle: () => void;
}
```
<sub>\* Method `toggle` is available only in StaticWrapper instances.</sub>

```typescript
interface INumberWrapper {
  * inc: (delta?: number) => void;
  * dec: (delta?: number) => void;
  * random: (min: number, max: number, integer?: boolean) => void;
  * round: (fractionDigits?: number) => void;
  * clamp: (min: number, max: number) => void;
    lt: (value: number) => boolean;
    lte: (value: number) => boolean;
    gt: (value: number) => boolean;
    gte: (value: number) => boolean;
    in: (min: number, max: number) => boolean;
}
```
<sub>\* Methods `inc`, `dec`, `random`, `round` and `clamp` are available only in StaticWrapper instances.</sub>

```typescript
interface IStringWrapper {
    length: number;
    contains: (value: string) => boolean;
    match: (regExp: RegExp) => boolean;
}
```

```typescript
interface IArrayWrapper<T> {
  * pop: () => ElementOf<T> | undefined;
  * popm: () => ElementOf<T> | undefined;
  * push: (...values: ElementOf<T>[]) => number;
  * pushm: (...values: ElementOf<T>[]) => number;
  * shift: () => ElementOf<T> | undefined;
  * shiftm: () => ElementOf<T> | undefined;
  * unshift: (...values: ElementOf<T>[]) => void;
  * unshiftm: (...values: ElementOf<T>[]) => void;
    length: number;
    first: ElementOf<T> | undefined;
    last: ElementOf<T> | undefined;
    random: () => ElementOf<T> | undefined;
    contains: (value: ElementOf<T>) => boolean;
    every: (callback: (value: ElementOf<T>) => boolean) => boolean;
    some: (callback: (value: ElementOf<T>) => boolean) => boolean;
    none: (callback: (value: ElementOf<T>) => boolean) => boolean;
}
```
<sub>\* Methods `pop`, `push`, `shift`, `unshift` are available only in StaticWrapper instances. These methods create a new array, for value mutable updates use methods with m suffix (note that they aren't affected by middlewares).</sub>