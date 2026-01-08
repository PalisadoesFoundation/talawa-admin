[Admin Docs](/)

***

# Interface: InterfaceConnection\<T\>

Defined in: [src/types/CursorPagination/interface.ts:63](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L63)

Generic connection type for cursor-based pagination.

## Type Parameters

### T

`T`

The type of the items in the edges.

## Properties

### edges

> **edges**: [`InterfaceEdge`](InterfaceEdge.md)\<`T`\>[]

Defined in: [src/types/CursorPagination/interface.ts:67](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L67)

Array of edges containing the data and cursors.

***

### pageInfo

> **pageInfo**: [`InterfacePageInfo`](InterfacePageInfo.md)

Defined in: [src/types/CursorPagination/interface.ts:72](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L72)

Information about the current page.
