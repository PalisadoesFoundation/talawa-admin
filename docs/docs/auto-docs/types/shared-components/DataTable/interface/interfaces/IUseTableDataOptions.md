[Admin Docs](/)

***

# Interface: IUseTableDataOptions\<TNode, TRow, TData\>

Defined in: [src/types/shared-components/DataTable/interface.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L145)

Options for the useTableData hook

## Type Parameters

### TNode

`TNode`

The GraphQL node type extracted from the connection

### TRow

`TRow`

The transformed row type after optional transformation

### TData

`TData` = `unknown`

The complete query result data type

## Properties

### deps?

> `optional` **deps**: `DependencyList`

Defined in: [src/types/shared-components/DataTable/interface.ts:286](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L286)

React dependency array for memoization. Passed to useMemo() in useTableData.
Only include values that should trigger path re-evaluation.

#### Remarks

The `data` parameter is already tracked automatically.
Use this for additional dependencies like query variables or state.

***

### path

> **path**: `DataPath`\<`TNode`, `TData`\>

Defined in: [src/types/shared-components/DataTable/interface.ts:220](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L220)

Path to the GraphQL connection within the query result.

Can be specified as either:
1. **String/number array path**: For deep property traversal with support for both object keys and array indices.
   - String segments: Navigate object properties (e.g., 'users', 'organization')
   - Numeric segments: Navigate array elements by index (e.g., 0, 5, 100)

2. **Selector function**: For custom traversal logic with optional chaining and computed paths.

#### Examples

```tsx
// Traverse into nested structure with array indexing
path: ['data', 'organizations', 0, 'members', 'edges']

// Equivalent to: data.organizations[0].members.edges
// Where organizations[0] accesses the first organization in an array
```

```tsx
// Navigate through arrays of items
path: ['results', 2, 'connection']

// Equivalent to: results[2].connection
// Where results[2] gets the 3rd item in the results array
```

```tsx
// Use a function for optional chaining or conditional logic
path: (data) => data.activeOrganization?.teams?.[selectedTeamIndex]?.members

// Safe navigation that returns undefined if any property is missing
// Useful when you need to select based on component state
```

```tsx
// For GraphQL queries that return arrays with embedded connections
interface QueryData {
  items: Array<{
    id: string;
    connection: {
      edges: Array<{ node: UserNode }>;
      pageInfo: PageInfo;
    };
  }>;
}

// Access the 5th item's connection
path: ['items', 5, 'connection']
```

#### Remarks

**Numeric Segment Semantics:**
- Numeric segments are coerced to property access, working with both:
  - Array indices: `array[0]`, `array[1]`, etc.
  - String-keyed object properties: `obj['0']`, `obj['1']`, etc. (rarely used)
- Out-of-bounds array access returns undefined (safe pattern)
- Mixed string/number traversal is fully supported: `['org', 0, 'members', 2, 'name']`

**When to Use Numeric Segments:**
- Traversing arrays of items where each item contains a GraphQL connection
- Accessing specific paginated result sets in a multi-result query
- Array-based navigation in complex nested structures
- GraphQL connections embedded within array elements

**Expected Final Result:**
The path (whether string[] or function) must resolve to a GraphQL connection type or undefined:
- Must have an edges property that is an array
- May have optional pageInfo property with pagination information
- Will be safely validated at runtime

***

### transformNode()?

> `optional` **transformNode**: (`node`) => `TRow`

Defined in: [src/types/shared-components/DataTable/interface.ts:276](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L276)

Optional transformation function to convert GraphQL nodes to display rows.

**Type Signature:** `(node: TNode) => TRow | null | undefined`

Called for each non-null node. Return null/undefined to drop a row, or a TRow to keep it.
Defaults to identity when omitted (TNode to TRow), matching the hook implementation.

#### Parameters

##### node

`TNode`

#### Returns

`TRow`

#### Examples

```tsx
// Add computed field
transformNode: (node) => ({
  ...node,
  displayName: node.name.toUpperCase(),
  isActive: Boolean(node.activeAt)
})
```

```tsx
// Filter out inactive nodes
transformNode: (node) => {
  if (!node.isActive) return null;
  return { ...node };
}
```

```tsx
// Reshape from node structure to row structure
transformNode: (node) => ({
  id: node.id,
  text: node.content,
  author: `${node.user.firstName} ${node.user.lastName}`,
  timestamp: new Date(node.createdAt).toLocaleDateString()
})
```

```tsx
// Calculate derived properties
transformNode: (node) => {
  const createdDate = new Date(node.createdAt);
  const ageInDays = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  return {
    ...node,
    isRecent: ageInDays < 30,
    ageInDays,
    status: ageInDays < 7 ? 'new' : 'old'
  };
}
```
