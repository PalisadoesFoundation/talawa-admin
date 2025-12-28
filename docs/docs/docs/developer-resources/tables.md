# DataTable Component System

## Overview
The DataTable system provides a reusable, type-safe, accessible, and extensible way to render tabular data in the Talawa Admin project. It supports generic column definitions, custom rendering, loading/error/empty states, accessibility, and internationalization (i18n).

## Key Files
- **src/shared-components/DataTable/DataTable.tsx**: Main DataTable component (generic, supports meta, custom render, error/loading/empty states, TableLoader, i18n, accessibility).
- **src/shared-components/DataTable/types.ts**: Type definitions (IColumnDef, IDataTableProps, ITableState, etc.).
- **src/shared-components/DataTable/DataTable.spec.tsx**: Component and type tests.

## Column Definition Example
```ts
import type { IColumnDef } from 'src/shared-components/DataTable/types';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
}

const columns: Array<IColumnDef<User>> = [
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'email', header: 'Email', accessor: u => u.email.toLowerCase(), meta: { sortable: true } },
  { id: 'age', header: 'Age', accessor: 'age' },
  { id: 'createdAt', header: 'Created', accessor: 'createdAt', render: (val) => val instanceof Date ? val.toLocaleDateString() : '' },
];
```

## DataTable Usage Example
```tsx
import { DataTable } from 'src/shared-components/DataTable/DataTable';
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('common');

<DataTable
  data={users}
  columns={columns}
  loading={false}
  rowKey="id"
  emptyMessage={t('noResultsFound')}
  ariaLabel={t('userTableAriaLabel')}
/>
```

- **TableLoader** is used automatically for loading states.
- **emptyMessage** and **ariaLabel** should be internationalized using i18next.

## Accessibility
- The table uses `aria-label` and a visually hidden `<caption>` for screen readers.
- Always provide a meaningful `ariaLabel` prop for accessibility.

## Type Safety
- Each `IColumnDef` can specify its own value type, allowing heterogeneous columns.
- The `IDataTableProps` interface allows columns with different value types.
- All types are validated with comprehensive tests in `DataTable.spec.tsx`.

## Testing & Coverage
- Component and type tests are in `DataTable.spec.tsx` and validate all type variants and edge cases.
- Type-only files (like `types.ts`) do not generate runtime coverage, which is expected and normal.
- For logic coverage, add tests for `DataTable.tsx` and related files.

## Best Practices
- Avoid using `any`; prefer explicit types for columns and data.
- Use i18next for all user-visible text (emptyMessage, ariaLabel, etc.).
- Document all custom column meta fields and rendering logic.
- Use TableLoader for consistent loading UI.

## Further Reading
- See `src/shared-components/DataTable/types.ts` for all available types and interfaces.
- See `src/shared-components/DataTable/DataTable.spec.tsx` for usage and test examples.

---
*Last updated: December 29, 2025*
