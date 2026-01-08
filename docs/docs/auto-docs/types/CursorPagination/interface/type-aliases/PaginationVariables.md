[Admin Docs](/)

***

# Type Alias: PaginationVariables\<T\>

> **PaginationVariables**\<`T`\> = `T` & \{ `after`: `string` \| `null`; `before?`: `never`; `first`: `number`; `last?`: `never`; \} \| \{ `after?`: `never`; `before`: `string` \| `null`; `first?`: `never`; `last`: `number`; \}

Defined in: [src/types/CursorPagination/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L8)

Helper type to combine pagination variables with custom query variables.
Supports both forward pagination (first/after) and backward pagination (last/before).

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `unknown`\>
