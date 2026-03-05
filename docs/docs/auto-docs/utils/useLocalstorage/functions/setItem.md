[Admin Docs](/)

***

# Function: setItem()

> **setItem**(`prefix`, `key`, `value`): `void`

Defined in: [src/utils/useLocalstorage.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/useLocalstorage.ts#L48)

Sets the value for the given key in local storage.

## Parameters

### prefix

`string`

Prefix to be added to the key, common for all keys.

### key

`string`

The unique name identifying the value.

### value

`unknown`

The value to be stored (any type that can be serialized).

## Returns

`void`
