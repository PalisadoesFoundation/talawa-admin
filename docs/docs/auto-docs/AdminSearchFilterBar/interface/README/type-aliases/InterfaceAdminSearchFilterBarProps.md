[**talawa-admin**](README.md)

***

# Type Alias: InterfaceAdminSearchFilterBarProps

> **InterfaceAdminSearchFilterBarProps** = [`InterfaceAdminSearchFilterBarSimple`](AdminSearchFilterBar\interface\README\interfaces\InterfaceAdminSearchFilterBarSimple.md) \| [`InterfaceAdminSearchFilterBarAdvanced`](AdminSearchFilterBar\interface\README\interfaces\InterfaceAdminSearchFilterBarAdvanced.md)

Defined in: [src/types/AdminSearchFilterBar/interface.ts:419](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/types/AdminSearchFilterBar/interface.ts#L419)

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
