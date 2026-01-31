[Admin Docs](/)

***

# Function: debounceInput()

> **debounceInput**\<`T`\>(`fn`, `wait`, `options?`): `T` & `object`

Defined in: [src/utils/performance.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/performance.ts#L44)

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
