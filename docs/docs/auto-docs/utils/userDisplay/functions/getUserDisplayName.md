[Admin Docs](/)

***

# Function: getUserDisplayName()

> **getUserDisplayName**\<`T`\>(`user`?, `fallback`?): `string`

Defined in: [src/utils/userDisplay.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/userDisplay.ts#L11)

Returns a trimmed display name for a user-like object using available fields.
Falls back to the provided placeholder when no name data is present.

## Type Parameters

### T

`T` *extends* `NameLike`

## Parameters

### user?

`T`

### fallback?

`string` = `'Unknown User'`

## Returns

`string`
