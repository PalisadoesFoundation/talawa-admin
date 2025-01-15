[**talawa-admin**](../../../README.md)

***

[talawa-admin](../../../modules.md) / [utils/useLocalstorage](../README.md) / useLocalStorage

# Function: useLocalStorage()

> **useLocalStorage**(`prefix`): `InterfaceStorageHelper`

Defined in: [src/utils/useLocalstorage.ts:61](https://github.com/bint-Eve/talawa-admin/blob/16ddeb98e6868a55bca282e700a8f4212d222c01/src/utils/useLocalstorage.ts#L61)

Custom hook for simplified localStorage operations.

## Parameters

### prefix

`string` = `PREFIX`

Prefix to be added to the key, common for all keys. Default is 'Talawa-admin'.

## Returns

`InterfaceStorageHelper`

- Functions to getItem, setItem, removeItem, and getStorageKey.
