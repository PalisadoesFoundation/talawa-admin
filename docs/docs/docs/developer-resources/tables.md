# DataTable Component System

## Overview
The DataTable system provides a reusable, type-safe, and extensible way to render tabular data in the Talawa Admin project. It is designed to support generic column definitions, custom rendering, sorting, filtering, and meta-driven configuration.

## Key Files
- **src/shared-components/DataTable/DataTable.tsx**: Main DataTable component (generic, supports meta, custom render, error/loading/empty states).
- **src/shared-components/DataTable/types.ts**: Type definitions (ColumnDef, DataTableProps, TableState, etc.).
- **src/shared-components/DataTable/types.spec.ts**: Type tests using realistic mock data.

## Column Definition Example
```ts
import type { ColumnDef } from 'src/shared-components/DataTable/types';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
}

const columns: Array<ColumnDef<User, any>> = [
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'email', header: 'Email', accessor: u => u.email.toLowerCase(), meta: { sortable: true } },
  { id: 'age', header: 'Age', accessor: 'age' },
  { id: 'createdAt', header: 'Created', accessor: 'createdAt', render: (val) => val.toLocaleDateString() },
];
```

## DataTable Usage Example
```tsx
import { DataTable } from 'src/shared-components/DataTable';

<DataTable
  data={users}
  columns={columns}
  loading={false}
  rowKey="id"
  emptyMessage="No users found."
/>
```

## Type Safety
- Each `ColumnDef` can specify its own value type (TValue), allowing heterogeneous columns.
- The `DataTableProps` interface allows columns with different value types.
- All types are validated with comprehensive tests in `types.spec.ts`.

## Testing & Coverage
- Type tests are in `types.spec.ts` and validate all type variants and edge cases.
- Type-only files (like `types.ts`) do not generate runtime coverage, which is expected and normal.
- For logic coverage, add tests for `DataTable.tsx` and related files.

## Best Practices
- Avoid using `any` unless necessary for heterogeneous columns.
- Use `React.isValidElement` for React element assertions in tests.
- Document all custom column meta fields and rendering logic.

## Further Reading
- See `src/shared-components/DataTable/types.ts` for all available types and interfaces.
- See `src/shared-components/DataTable/types.spec.ts` for type usage examples.

---
*Last updated: December 27, 2025*
