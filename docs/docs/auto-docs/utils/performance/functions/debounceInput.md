[Admin Docs](/)

***

# Function: debounceInput()

> **debounceInput**\<`TArgs`, `TReturn`\>(`fn`, `wait`, `options?`): (...`args`) => `TReturn` & `object`

Defined in: [src/utils/performance.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/performance.ts#L43)

Creates a debounced function tailored for input handlers.

Defaults:
- `wait`: 300 ms
- `leading`: false
- `trailing`: true

The returned function is the same shape as the function returned by
`lodash.debounce` (it includes `cancel` and `flush`).

## Type Parameters

### TArgs

`TArgs` *extends* `unknown`[]

### TReturn

`TReturn`

## Parameters

### fn

(...`args`) => `TReturn`

The function to debounce

### wait

`number` = `300`

Debounce wait time in milliseconds (default: 300)

### options?

[`InterfaceDebounceInputOptions`](../interfaces/InterfaceDebounceInputOptions.md)

Optional override for leading/trailing/maxWait

## Returns

(...`args`) => `TReturn` & `object`

Debounced function with `cancel` and `flush` methods
