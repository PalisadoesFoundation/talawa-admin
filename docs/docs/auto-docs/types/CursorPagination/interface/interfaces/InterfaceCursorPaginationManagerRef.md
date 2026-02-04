[Admin Docs](/)

***

# Interface: InterfaceCursorPaginationManagerRef\<TNode\>

Defined in: [src/types/CursorPagination/interface.ts:190](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L190)

## Type Parameters

### TNode

`TNode`

## Properties

### addItem()

> **addItem**: (`item`, `position?`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:191](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L191)

#### Parameters

##### item

`TNode`

##### position?

`"start"` | `"end"`

#### Returns

`void`

***

### getItems()

> **getItems**: () => `TNode`[]

Defined in: [src/types/CursorPagination/interface.ts:197](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L197)

#### Returns

`TNode`[]

***

### removeItem()

> **removeItem**: (`predicate`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:192](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L192)

#### Parameters

##### predicate

(`item`) => `boolean`

#### Returns

`void`

***

### updateItem()

> **updateItem**: (`predicate`, `updater`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:193](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L193)

#### Parameters

##### predicate

(`item`) => `boolean`

##### updater

(`item`) => `TNode`

#### Returns

`void`
