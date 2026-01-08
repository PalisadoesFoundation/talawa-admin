[**talawa-admin**](../../../../README.md)

***

# Function: default()

> **default**\<`TData`, `TNode`\>(`__namedParameters`): `Element`

Defined in: [src/components/CursorPaginationManager/CursorPaginationManager.tsx:27](https://github.com/ad1tyayadav/talawa-admin/blob/b8387d77631440707954741466a907fb8f87ba05/src/components/CursorPaginationManager/CursorPaginationManager.tsx#L27)

CursorPaginationManager Component

A reusable component that manages cursor-based pagination state and logic.
Supports both forward pagination (next page) and backward pagination (previous page).

It operates in two modes:
1. **Controlled Mode**: Parent provides `data` and handles loading via `onLoadMore`.
2. **Smart Mode**: Component fetches data using `query` and handles pagination internally.

## Type Parameters

### TData

`TData`

### TNode

`TNode`

## Parameters

### \_\_namedParameters

[`InterfaceCursorPaginationProps`](../../../../types/CursorPagination/interface/interfaces/InterfaceCursorPaginationProps.md)\<`TData`, `TNode`\>

## Returns

`Element`
