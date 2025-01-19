[Admin Docs](/)

***

# Function: default()

> **default**\<`T`\>(`callback`, `delay`): `object`

Defined in: [src/components/OrgListCard/useDebounce.tsx:12](https://github.com/hustlernik/talawa-admin/blob/fe326ed17e0fa5ad916ff9f383f63b5d38aedc7b/src/components/OrgListCard/useDebounce.tsx#L12)

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
