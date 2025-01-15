[Admin Docs](/)

***

# Function: useLocalStorage()

> **useLocalStorage**(`prefix`): `InterfaceStorageHelper`

Defined in: [src/utils/useLocalstorage.ts:61](https://github.com/gautam-divyanshu/talawa-admin/blob/d5fea688542032271211cd43ee86c7db0866bcc0/src/utils/useLocalstorage.ts#L61)

Custom hook for simplified localStorage operations.

## Parameters

### prefix

`string` = `PREFIX`

Prefix to be added to the key, common for all keys. Default is 'Talawa-admin'.

## Returns

`InterfaceStorageHelper`

- Functions to getItem, setItem, removeItem, and getStorageKey.
