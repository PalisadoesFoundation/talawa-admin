[Admin Docs](/)

***

# Function: default()

> **default**\<`T`\>(`callback`, `delay`): `object`

<<<<<<< HEAD
Defined in: [src/components/OrgListCard/useDebounce.tsx:12](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/components/OrgListCard/useDebounce.tsx#L12)
=======
Defined in: [src/components/OrgListCard/useDebounce.tsx:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/OrgListCard/useDebounce.tsx#L12)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

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
