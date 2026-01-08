[**talawa-admin**](../../../README.md)

***

# Function: getItem()

> **getItem**\<`T`\>(`prefix`, `key`): `T`

Defined in: [src/utils/useLocalstorage.ts:30](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/utils/useLocalstorage.ts#L30)

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
