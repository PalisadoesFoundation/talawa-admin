[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../README.md) / [components/OrgListCard/useDebounce](../README.md) / default

# Function: default()

> **default**\<`T`\>(`callback`, `delay`): `object`

Defined in: [src/components/OrgListCard/useDebounce.tsx:12](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/components/OrgListCard/useDebounce.tsx#L12)

A custom React hook for debouncing a callback function.
It delays the execution of the callback until after a specified delay has elapsed
since the last time the debounced function was invoked.

## Type Parameters

• **T** *extends* (...`args`) => `void`

## Parameters

### callback

`T`

The function to debounce.

### delay

`number`

The delay in milliseconds to wait before invoking the callback.

## Returns

`object`

An object with the `debouncedCallback` function and a `cancel` method to clear the timeout.

### cancel()

> **cancel**: () => `void`

#### Returns

`void`

### debouncedCallback()

> **debouncedCallback**: (...`args`) => `void`

#### Parameters

##### args

...`Parameters`\<`T`\>

#### Returns

`void`
