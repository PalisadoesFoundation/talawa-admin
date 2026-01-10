[Admin Docs](/)

***

# Type Alias: InterfaceCursorPaginationManagerProps\<TNode, TVariables, TData\>

> **InterfaceCursorPaginationManagerProps**\<`TNode`, `TVariables`, `TData`\> = `InterfaceCursorPaginationManagerDefaultProps`\<`TNode`, `TVariables`\> \| `InterfaceCursorPaginationManagerExternalProps`\<`TNode`, `TVariables`, `TData`\>

Defined in: [src/types/CursorPagination/interface.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L114)

Props for CursorPaginationManager component.

## Type Parameters

### TNode

`TNode`

### TVariables

`TVariables` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### TData

`TData` = `unknown`

## Remarks

This component supports two modes:
1. Default UI mode: Provide `renderItem` to use built-in rendering
2. External UI mode: Set `useExternalUI={true}` and provide `children` render prop
