[**talawa-admin**](../../../README.md)

***

# Function: useLocalStorage()

> **useLocalStorage**(`prefix`): `InterfaceStorageHelper`

Defined in: [src/utils/useLocalstorage.ts:87](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/utils/useLocalstorage.ts#L87)

Factory function that returns localStorage helper methods with a common prefix.

## Parameters

### prefix

`string` = `PREFIX`

Prefix to be added to all keys, defaults to 'Talawa-admin'.

## Returns

`InterfaceStorageHelper`

InterfaceStorageHelper with getItem, setItem, removeItem, getStorageKey, and clearAllItems methods.
