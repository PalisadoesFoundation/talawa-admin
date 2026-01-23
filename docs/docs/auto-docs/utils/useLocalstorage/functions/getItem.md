[**talawa-admin**](../../../README.md)

***

# Function: getItem()

> **getItem**\<`T`\>(`prefix`, `key`): `T`

Defined in: [src/utils/useLocalstorage.ts:30](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/utils/useLocalstorage.ts#L30)

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
