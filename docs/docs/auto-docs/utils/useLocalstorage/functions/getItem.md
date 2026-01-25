[**talawa-admin**](../../../README.md)

***

# Function: getItem()

> **getItem**\<`T`\>(`prefix`, `key`): `T`

Defined in: [src/utils/useLocalstorage.ts:30](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/utils/useLocalstorage.ts#L30)

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
