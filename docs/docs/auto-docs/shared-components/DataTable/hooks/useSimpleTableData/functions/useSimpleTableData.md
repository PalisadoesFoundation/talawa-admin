[Admin Docs](/)

***

# Function: useSimpleTableData()

> **useSimpleTableData**\<`TRow`, `TData`\>(`result`, `options`): [`IUseSimpleTableDataResult`](../interfaces/IUseSimpleTableDataResult.md)\<`TRow`, `TData`\>

Defined in: [src/shared-components/DataTable/hooks/useSimpleTableData.ts:67](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/hooks/useSimpleTableData.ts#L67)

Hook for integrating simple array-based GraphQL queries with DataTable.
Use this for queries that return arrays directly, not connection format.

For connection-based queries (with edges/pageInfo), use useTableData instead.

## Type Parameters

### TRow

`TRow` = `unknown`

### TData

`TData` = `unknown`

## Parameters

### result

`QueryResult`\<`TData`\>

### options

[`IUseSimpleTableDataOptions`](../interfaces/IUseSimpleTableDataOptions.md)\<`TRow`, `TData`\>

## Returns

[`IUseSimpleTableDataResult`](../interfaces/IUseSimpleTableDataResult.md)\<`TRow`, `TData`\>

## Example

```tsx
const queryResult = useQuery(MEMBERSHIP_REQUEST_PG, {
  variables: { input: { id: orgId }, first: 10 }
});

// Path function MUST be memoized with useCallback
const extractRequests = useCallback(
  (data: InterfaceMembershipRequestsQueryData) =>
    data?.organization?.membershipRequests ?? [],
  []
);

const { rows, loading, error, refetch } = useSimpleTableData<
  InterfaceRequestsListItem,
  InterfaceMembershipRequestsQueryData
>(queryResult, {
  path: extractRequests
});
```
