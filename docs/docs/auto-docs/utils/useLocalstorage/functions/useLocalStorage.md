[**talawa-admin**](../../../README.md)

***

# Function: useLocalStorage()

> **useLocalStorage**(`prefix`): `InterfaceStorageHelper`

Defined in: [src/utils/useLocalstorage.ts:82](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/useLocalstorage.ts#L82)

Custom hook for simplified localStorage operations.

## Parameters

### prefix

`string` = `PREFIX`

Prefix to be added to the key, common for all keys. Default is 'Talawa-admin'.

## Returns

`InterfaceStorageHelper`

- Functions to getItem, setItem, removeItem, getStorageKey, and clearAllItems.
