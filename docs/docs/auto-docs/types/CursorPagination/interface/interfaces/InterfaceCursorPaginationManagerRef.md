[**talawa-admin**](../../../../README.md)

***

# Interface: InterfaceCursorPaginationManagerRef\<TNode\>

Defined in: [src/types/CursorPagination/interface.ts:185](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/CursorPagination/interface.ts#L185)

## Type Parameters

### TNode

`TNode`

## Properties

### addItem()

> **addItem**: (`item`, `position?`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:186](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/CursorPagination/interface.ts#L186)

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

Defined in: [src/types/CursorPagination/interface.ts:192](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/CursorPagination/interface.ts#L192)

#### Returns

`TNode`[]

***

### removeItem()

> **removeItem**: (`predicate`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:187](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/CursorPagination/interface.ts#L187)

#### Parameters

##### predicate

(`item`) => `boolean`

#### Returns

`void`

***

### updateItem()

> **updateItem**: (`predicate`, `updater`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:188](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/CursorPagination/interface.ts#L188)

#### Parameters

##### predicate

(`item`) => `boolean`

##### updater

(`item`) => `TNode`

#### Returns

`void`
