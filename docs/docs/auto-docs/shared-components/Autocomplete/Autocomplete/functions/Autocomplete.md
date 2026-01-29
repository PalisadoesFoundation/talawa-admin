[Admin Docs](/)

***

# Function: Autocomplete()

> **Autocomplete**\<`T`, `TMultiple`, `TDisableClearable`, `TFreeSolo`\>(`props`): `Element`

Defined in: [src/shared-components/Autocomplete/Autocomplete.tsx:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Autocomplete/Autocomplete.tsx#L30)

Shared wrapper for MUI Autocomplete component.
Use this component instead of importing directly from @mui/material.

## Type Parameters

### T

`T`

### TMultiple

`TMultiple` *extends* `boolean`

### TDisableClearable

`TDisableClearable` *extends* `boolean`

### TFreeSolo

`TFreeSolo` *extends* `boolean`

## Parameters

### props

`AutocompleteProps`\<`T`, `TMultiple`, `TDisableClearable`, `TFreeSolo`\>

All props from MUI AutocompleteProps, including:
- options: Array of options to display
- value: The current selected value(s)
- onChange: Callback when selection changes
- renderInput: Function to render the input field
- disabled: Whether the autocomplete is disabled
- multiple: Whether multiple selections are allowed
- And all other MUI Autocomplete props

## Returns

`Element`

JSX.Element - The rendered Autocomplete component

## Example

```tsx
<Autocomplete
  options={['Option 1', 'Option 2']}
  renderInput={(params) => <TextField {...params} label="Select" />}
/>
```
