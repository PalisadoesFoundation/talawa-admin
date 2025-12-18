[**talawa-admin**](../../../README.md)

***

# Function: useLocalStorage()

> **useLocalStorage**(`prefix`): `InterfaceStorageHelper`

Defined in: [src/utils/useLocalstorage.ts:77](https://github.com/Ritz-Bansal/talawa-admin/blob/a0c73c8f8730e8b46e1a29ddb01b822fea5321b1/src/utils/useLocalstorage.ts#L77)

Custom hook for simplified localStorage operations.

## Parameters

### prefix

`string` = `PREFIX`

Prefix to be added to the key, common for all keys. Default is 'Talawa-admin'.

## Returns

`InterfaceStorageHelper`

- Functions to getItem, setItem, removeItem, and getStorageKey.
