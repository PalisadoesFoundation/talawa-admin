[Admin Docs](/)

***

# Type Alias: InterfaceCursorPaginationManagerProps\<TNode, TVariables\>

> **InterfaceCursorPaginationManagerProps**\<`TNode`, `TVariables`\> = `InterfaceCursorPaginationManagerDefaultProps`\<`TNode`, `TVariables`\> \| `InterfaceCursorPaginationManagerExternalProps`\<`TNode`, `TVariables`\>

Defined in: [src/types/CursorPagination/interface.ts:88](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L88)

Props for CursorPaginationManager component.

## Type Parameters

### TNode

`TNode`

### TVariables

`TVariables` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Remarks

This component supports two modes:
1. Default UI mode: Provide `renderItem` to use built-in rendering
2. External UI mode: Set `useExternalUI={true}` and provide `children` render prop
