# Wrappers

TypeScript variable wrapper library, transpiled to ESNext JavaScript.

## Install

```bash
npm i @0x2e757/wrappers
```

## Usage

### StaticWrapper

Simple wrapper that can be used as a value container. Has derived `LocalStorageWrapper` and `SessionStorageWrapper` implementation that read and save their values to corresponding storages.

#### Usage example:

```typescript
import { StaticWrapper } from "@0x2e757/Wrappers";

const wNumber = new StaticWrapper(0);
wNumber.subscribe(console.log);

wNumber.value = 1;
wNumber.value = 2;
wNumber.value += 3;
```

#### Console output:

```
1
2
5
```

### DynamicWrapper

Advanced wrapper which contains dynamically computed value (it can not be set manually). Values are being computed only before they are going to be used.

#### Usage example:

```typescript
import { StaticWrapper, DynamicWrapper } from "@0x2e757/Wrappers";

const wUsername = new StaticWrapper("John");
const wBalance = new StaticWrapper(100);

const wAccountInfo = new DynamicWrapper(() => `${wUsername.value} has ${wBalance.value}$.`);
wAccountInfo.subscribe(console.log);

wBalance.value -= 50;
```

#### Console output:

```
John has 50$.
```

### Generic Wrapper

Helper class that dynamically will return either `StaticWrapper` or `DynamicWrapper`, depending on value type (is function or not) passed to the constructor.

#### Usage example:

```TypeScript
import { Wrapper } from "@0x2e757/Wrappers";

const staticWrapper = new Wrapper(0);
const dynamicWrapper = new Wrapper(() => staticWrapper.value * 2);
dynamicWrapper.subscribe(console.log);

staticWrapper.value = 5;
```

#### Console output:

```
10
```