[Admin Docs](/)

***

# Function: useLocalStorage()

> **useLocalStorage**(`prefix`): `InterfaceStorageHelper`

Defined in: [src/utils/useLocalstorage.ts:81](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/useLocalstorage.ts#L81)

Factory function that returns localStorage helper methods with a common prefix.

## Parameters

### prefix

`string` = `PREFIX`

Prefix to be added to all keys, defaults to 'Talawa-admin'.

## Returns

`InterfaceStorageHelper`

InterfaceStorageHelper with getItem, setItem, removeItem, getStorageKey, and clearAllItems methods.
