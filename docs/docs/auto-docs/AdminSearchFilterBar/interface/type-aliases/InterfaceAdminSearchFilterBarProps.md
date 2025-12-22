[Admin Docs](/)

***

# Type Alias: InterfaceAdminSearchFilterBarProps

> **InterfaceAdminSearchFilterBarProps** = [`InterfaceAdminSearchFilterBarSimple`](../interfaces/InterfaceAdminSearchFilterBarSimple.md) \| [`InterfaceAdminSearchFilterBarAdvanced`](../interfaces/InterfaceAdminSearchFilterBarAdvanced.md)

Defined in: [src/types/AdminSearchFilterBar/interface.ts:412](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L412)

Main props interface for the AdminSearchFilterBar component.

This is a discriminated union type that ensures type safety:
- When `hasDropdowns` is `false`, the `dropdowns` property cannot be provided
- When `hasDropdowns` is `true`, the `dropdowns` property must be provided

## Examples

```tsx
const props: InterfaceAdminSearchFilterBarProps = {
  hasDropdowns: false,
  searchPlaceholder: "Search...",
  searchValue: searchTerm,
  onSearchChange: setSearchTerm
};
```

```tsx
const props: InterfaceAdminSearchFilterBarProps = {
  hasDropdowns: true,
  searchPlaceholder: "Search...",
  searchValue: searchTerm,
  onSearchChange: setSearchTerm,
  dropdowns: [...]
};
```

```tsx
const props: InterfaceAdminSearchFilterBarProps = {
  hasDropdowns: true,
  searchPlaceholder: "Search plugins...",
  searchValue: searchTerm,
  onSearchChange: setSearchTerm,
  dropdowns: [...],
  translations: {
    searchButtonAriaLabel: "Search for plugins",
    dropdownAriaLabel: "Toggle {label} filters"
  }
};
```
