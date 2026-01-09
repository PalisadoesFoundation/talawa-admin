[Admin Docs](/)

***

# Function: extractDataFromPath()

> **extractDataFromPath**\<`TNode`\>(`data`, `path`): `any`

Defined in: [src/components/CursorPaginationManager/CursorPaginationManager.tsx:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/CursorPaginationManager/CursorPaginationManager.tsx#L21)

Extracts connection data from a nested GraphQL response using a dot-separated path.

## Type Parameters

### TNode

`TNode`

## Parameters

### data

`unknown`

The complete GraphQL response

### path

`string`

Dot-separated path to connection (e.g., "organization.members")

## Returns

`any`

Connection data with edges and pageInfo, or null if not found
