[**talawa-admin**](../README.md)

***

# Type Alias: PaginationVariables\<T\>

> **PaginationVariables**\<`T`\> = `T` & \{ `after`: `string` \| `null`; `before?`: `never`; `first`: `number`; `last?`: `never`; \} \| \{ `after?`: `never`; `before`: `string` \| `null`; `first?`: `never`; `last`: `number`; \}

Defined in: [interface.ts:8](https://github.com/ad1tyayadav/talawa-admin/blob/a607752def4dd25da0fb886e7d6ece4050eddbe0/src/types/CursorPagination/interface.ts#L8)

Helper type to combine pagination variables with custom query variables.
Supports both forward pagination (first/after) and backward pagination (last/before).

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `unknown`\>
