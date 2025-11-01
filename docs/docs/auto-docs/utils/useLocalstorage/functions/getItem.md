[**talawa-admin**](../../../README.md)

***

# Function: getItem()

> **getItem**\<`T`\>(`prefix`, `key`): `T`

Defined in: [src/utils/useLocalstorage.ts:29](https://github.com/iamanishx/talawa-admin/blob/298365ee22a86aaef2b666c60099ffc41d2bbce7/src/utils/useLocalstorage.ts#L29)

Retrieves the stored value for the given key from local storage.

## Type Parameters

### T

`T`

## Parameters

### prefix

`string`

Prefix to be added to the key, common for all keys.

### key

`string`

The unique name identifying the value.

## Returns

`T`

- The stored value parsed as type T or null.
