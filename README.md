# Howion's Unique IDentifier (HUID)

Howion's Unique IDentifier (HUID) for the next era of identifiers. `@howionlabs/huid` generates time sortable 63-bit identifiers as `bigint`.

Each HUID is composed of:

- 42-bit time component (milliseconds since `2026-01-01T00:00:00.000Z`)
- 21-bit random component (cryptographically secure)

This gives compact numeric IDs that can be sorted by creation time and stored efficiently in databases.

## 1. Installation

From [npm](https://www.npmjs.com/package/@howionlabs/huid) via one of:

```bash
npm install @howionlabs/huid
bun add @howionlabs/huid
yarn add @howionlabs/huid
pnpm add @howionlabs/huid
```

## 2. Core Functionality

### 2.1. Generation

```ts
import { huid } from '@howionlabs/huid'

const id = huid() // 15734368260819637n
```

`huid()` returns a new 63-bit non-negative `bigint`.

### 2.2. Decoding

```ts
import { huid, huidDecodeRandom, huidDecodeTime } from '@howionlabs/huid'

const id = huid()
const createdAt = huidDecodeTime(id) // Date
const randomPart = huidDecodeRandom(id) // bigint in [0, 2^21 - 1]
```

### 2.3. Successor and Predecessor

```ts
import { huidPred, huidSucc } from '@howionlabs/huid'

const next = huidSucc(100n) // 101n
const prev = huidPred(100n) // 99n
```

These helpers are useful for range boundaries and cursor style pagination.

### 2.4. Conversion to Binary Formats

```ts
import { huidFromBuffer, huidToBuffer } from '@howionlabs/huid'

const id = 0x0102030405060708n
const buf = huidToBuffer(id) // Buffer(8), big-endian
const decoded = huidFromBuffer(buf) // same bigint
```

Equivalent APIs exist for `Uint8Array`:

- `huidToByteArray(id)`
- `huidFromByteArray(arr)`

### 2.5. Validation

```ts
import { huidValidator } from '@howionlabs/huid'

const isValid = huidValidator({
    disallowFuture: true,
    disallowBefore: new Date('2030-01-01T00:00:00.000Z'),
    disallowAfter: 0x0102030405060708n // also accepts HUIDs
})

isValid(1n) // boolean
```

`huidValidator(options)` returns a predicate function that checks if a value is a valid HUID and optionally enforces time bounds.

## Public API

### Generators and navigation

- `huid(): bigint`
- `huidSucc(id: bigint): bigint`
- `huidPred(id: bigint): bigint`

### Decoders

- `huidDecodeTime(id: bigint): Date`
- `huidDecodeRandom(id: bigint): bigint`

### Conversions

- `huidToBuffer(id: bigint): Buffer`
- `huidFromBuffer(buf: Buffer): bigint`
- `huidToByteArray(id: bigint): Uint8Array`
- `huidFromByteArray(arr: Uint8Array): bigint`

### Validation

- `huidValidator(options?): (id: bigint) => boolean`

### Constants

- `EPOCH_2026_MS`
- `EPOCH_2026_MS_N`
- `MAX_TIME_MS`
- `MAX_TIME_MS_N`
- `MASK_21_BITS`
- `MASK_21_BITS_N`
- `MAX_HUID_N`

### Errors

The library throws `HUIDError` with one of these codes in `error.name`:

- `HUID_OVERFLOW`
- `HUID_UNDERFLOW`
- `INVALID_HUID`
- `TIME_OVERFLOW`
- `TIME_UNDERFLOW`
- `TYPE_ERROR`

## Notes

- Time range starts at `2026-01-01T00:00:00.000Z` and supports about 139 years.
- Maximum representable HUID is `2^63 - 1`.
- HUID values are always non-negative and fit into 8 bytes.

## Drizzle example

```ts
import * as p from 'drizzle-orm/pg-core'
import { huid } from '@howionlabs/huid'

export const _huid = (colname = 'id') =>
    p.bigint(colname, { mode: 'bigint' }).$default(() => huid())
```

## Specification

For the concise format specification and deeper rationale, see [@howionlabs/huid-spec](https://github.com/howionlabs/huid-spec).

## License

This project is licensed under the [MIT License](./LICENSE).
