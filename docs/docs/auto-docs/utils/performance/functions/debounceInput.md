[**talawa-admin**](../../../README.md)

***

# Function: debounceInput()

> **debounceInput**\<`T`\>(`fn`, `wait`, `options?`): `T` & `object`

Defined in: [src/utils/performance.ts:43](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/utils/performance.ts#L43)

Creates a debounced function tailored for input handlers.

Defaults:
- `wait`: 300 ms
- `leading`: false
- `trailing`: true

The returned function is the same shape as the function returned by
`lodash.debounce` (it includes `cancel` and `flush`).

## Type Parameters

### T

`T` *extends* (...`args`) => `unknown`

## Parameters

### fn

`T`

The function to debounce

### wait

`number` = `300`

Debounce wait time in milliseconds (default: 300)

### options?

[`InterfaceDebounceInputOptions`](../interfaces/InterfaceDebounceInputOptions.md)

Optional override for leading/trailing/maxWait

## Returns

`T` & `object`

Debounced function with `cancel` and `flush` methods
