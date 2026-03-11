[Admin Docs](/)

***

# Function: debounceInput()

> **debounceInput**\<`T`\>(`fn`, `wait`): `DebouncedFunc`\<`T`\>

Defined in: [src/utils/performance.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/performance.ts#L13)

Debounces an input handler with `leading: false, trailing: true`.

## Type Parameters

### T

`T` *extends* (...`args`) => `unknown`

## Parameters

### fn

`T`

The function to debounce.

### wait

`number` = `300`

Debounce delay in milliseconds (default 300).

## Returns

`DebouncedFunc`\<`T`\>

A debounced version of `fn`.
