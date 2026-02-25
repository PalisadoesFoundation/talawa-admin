[Admin Docs](/)

***

# Function: Autocomplete()

> **Autocomplete**\<`T`, `TMultiple`, `TDisableClearable`, `TFreeSolo`\>(`props`): `ReactElement`

Defined in: [src/shared-components/Autocomplete/Autocomplete.tsx:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Autocomplete/Autocomplete.tsx#L66)

Shared Autocomplete Component

This component standardizes behavior, accessibility, and integration patterns
across the application while preserving full support for generics and advanced
selection modes.

Supports:
- Single and multiple selection modes
- Free solo input (custom user input)
- Disable clearable mode
- Loading and error states
- Custom TextField rendering via renderInput prop
- TextFieldProps customization

The component intentionally controls the underlying TextField rendering to
ensure design system consistency and accessibility compliance.

Type parameters:
- T: The type of the option object
- Multiple: Whether multiple selection is enabled (default: false)
- DisableClearable: Whether clearing the value is disabled (default: false)
- FreeSolo: Whether free-form user input is allowed (default: false)

## Type Parameters

### T

`T`

### TMultiple

`TMultiple` *extends* `boolean` = `false`

### TDisableClearable

`TDisableClearable` *extends* `boolean` = `false`

### TFreeSolo

`TFreeSolo` *extends* `boolean` = `false`

## Parameters

### props

[`IAutocompleteProps`](../../../../types/shared-components/Autocomplete/interface/interfaces/IAutocompleteProps.md)\<`T`, `TMultiple`, `TDisableClearable`, `TFreeSolo`\>

## Returns

`ReactElement`

## Example

```tsx
// Single selection
<Autocomplete<User>
  id="user-select"
  options={users}
  value={selectedUser}
  onChange={setSelectedUser}
  label="Select a user"
  getOptionLabel={(user) => user.name}
/>

// Multiple selection
<Autocomplete<User, true>
  id="user-select"
  options={users}
  value={selectedUsers}
  onChange={setSelectedUsers}
  multiple
  label="Select users"
  getOptionLabel={(user) => user.name}
/>
```

## Remarks

- This component is part of the shared design system
- See [IAutocompleteProps](../../../../types/shared-components/Autocomplete/interface/interfaces/IAutocompleteProps.md) for full prop documentation
