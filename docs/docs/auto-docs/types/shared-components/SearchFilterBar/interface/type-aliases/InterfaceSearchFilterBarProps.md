[**talawa-admin**](../../../../../README.md)

***

# Type Alias: InterfaceSearchFilterBarProps

> **InterfaceSearchFilterBarProps** = [`InterfaceSearchFilterBarSimple`](../interfaces/InterfaceSearchFilterBarSimple.md) \| [`InterfaceSearchFilterBarAdvanced`](../interfaces/InterfaceSearchFilterBarAdvanced.md)

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:418](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/SearchFilterBar/interface.ts#L418)

Main props interface for the SearchFilterBar component.

This is a discriminated union type that ensures type safety:
- When `hasDropdowns` is `false`, the `dropdowns` property cannot be provided
- When `hasDropdowns` is `true`, the `dropdowns` property must be provided

## Examples

```tsx
const props: InterfaceSearchFilterBarProps = {
  hasDropdowns: false,
  searchPlaceholder: "Search...",
  searchValue: searchTerm,
  onSearchChange: setSearchTerm
};
```

```tsx
const props: InterfaceSearchFilterBarProps = {
  hasDropdowns: true,
  searchPlaceholder: "Search...",
  searchValue: searchTerm,
  onSearchChange: setSearchTerm,
  dropdowns: [...]
};
```

```tsx
const props: InterfaceSearchFilterBarProps = {
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
