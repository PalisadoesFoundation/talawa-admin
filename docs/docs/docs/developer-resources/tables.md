---
id: tables
title: Tables and Data Grids
slug: /developer-resources/tables
sidebar_position: 36
---

This guide describes how list and table screens use the shared `DataGridWrapper` component for consistent UI/UX across the application.

## DataGridWrapper

Screens that display paginated or scrollable lists use the **DataGridWrapper** component (`src/components/DataGridWrapper/DataGridWrapper.tsx`). It wraps MUI's `DataGrid` with:

- A container with class `datatable` for layout
- Shared styling via CSS variables: `--table-head-radius`, `--grey-bg-color`, `--tablerow-bg-color`
- Consistent row hover, focus, and border behavior

Use `DataGridWrapper` instead of using `DataGrid` directly so that all table screens look and behave the same.

### Usage

Import and pass the same props you would pass to `DataGrid`. The wrapper merges any custom `sx` with the default table theme.

```tsx
import DataGridWrapper from 'components/DataGridWrapper/DataGridWrapper';

<DataGridWrapper
  rows={rows}
  columns={columns}
  getRowId={(row) => row.id}
  hideFooter={true}
  slots={{
    noRowsOverlay: () => <Stack>No data</Stack>,
  }}
  getRowClassName={() => styles.rowBackground}
  autoHeight
  rowHeight={65}
/>
```

### Optional custom styling

To override or extend the default table styles, pass the `sx` prop. It is merged with the default theme.

```tsx
<DataGridWrapper
  rows={rows}
  columns={columns}
  getRowId={(row) => row.id}
  sx={{ '& .MuiDataGrid-columnHeaders': { border: 'none' } }}
/>
```

---

## Tag and Volunteer Management Screens (Table2Fix migration)

The following screens have been migrated to use `DataGridWrapper` for consistent tables:

### Organization Tags

- **Screen:** `src/screens/OrganizationTags/OrganizationTags.tsx`
- **Behavior:** Renders organization tags in a table with infinite scroll. Uses `DataGridWrapper` inside `InfiniteScroll`; footer is hidden.
- **Features:** Search, sort (latest/oldest), create tag modal, links to manage tag and sub-tags.

### Event Volunteer Groups

- **Screen:** `src/screens/EventVolunteers/VolunteerGroups/VolunteerGroups.tsx`
- **Behavior:** Renders volunteer groups for an event in a table. Uses `DataGridWrapper` with client-side filtering and sorting.
- **Features:** Search (by group or leader), sort by volunteer count, create/edit/view/delete group modals.

Both screens now share the same table styling (rounded corners, row hover, focus outline) as other migrated list screens (e.g. Organization People). Tests for these screens are in their respective `*.spec.tsx` files; the wrapper is covered by `src/components/DataGridWrapper/DataGridWrapper.spec.tsx`.
