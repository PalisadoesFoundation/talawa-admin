[Admin Docs](/)

***

# Function: getItem()

> **getItem**\<`T`\>(`prefix`, `key`): `T`

Defined in: [src/utils/useLocalstorage.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/useLocalstorage.ts#L29)

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
