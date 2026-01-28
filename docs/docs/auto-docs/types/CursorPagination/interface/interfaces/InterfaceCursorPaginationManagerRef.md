[**talawa-admin**](../../../../README.md)

***

# Interface: InterfaceCursorPaginationManagerRef\<TNode\>

Defined in: [src/types/CursorPagination/interface.ts:185](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/CursorPagination/interface.ts#L185)

## Type Parameters

### TNode

`TNode`

## Properties

### addItem()

> **addItem**: (`item`, `position?`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:186](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/CursorPagination/interface.ts#L186)

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

Defined in: [src/types/CursorPagination/interface.ts:192](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/CursorPagination/interface.ts#L192)

#### Returns

`TNode`[]

***

### removeItem()

> **removeItem**: (`predicate`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:187](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/CursorPagination/interface.ts#L187)

#### Parameters

##### predicate

(`item`) => `boolean`

#### Returns

`void`

***

### updateItem()

> **updateItem**: (`predicate`, `updater`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:188](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/CursorPagination/interface.ts#L188)

#### Parameters

##### predicate

(`item`) => `boolean`

##### updater

(`item`) => `TNode`

#### Returns

`void`
