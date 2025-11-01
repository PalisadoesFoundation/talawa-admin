[**talawa-admin**](../../../README.md)

***

# Function: useLocalStorage()

> **useLocalStorage**(`prefix`): `InterfaceStorageHelper`

Defined in: [src/utils/useLocalstorage.ts:61](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/useLocalstorage.ts#L61)

Custom hook for simplified localStorage operations.

## Parameters

### prefix

`string` = `PREFIX`

Prefix to be added to the key, common for all keys. Default is 'Talawa-admin'.

## Returns

`InterfaceStorageHelper`

- Functions to getItem, setItem, removeItem, and getStorageKey.
