[Admin Docs](/)

***

# Interface: IAutocompleteProps\<T, TMultiple, TDisableClearable, TFreeSolo\>

Defined in: [src/types/shared-components/Autocomplete/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L22)

Props for the shared Autocomplete component.

This interface extends the MUI Autocomplete props while providing custom
props for consistent behavior, accessibility, and integration patterns
across the application.

## Extends

- `Partial`\<`Omit`\<`MuiAutocompleteProps`\<`T`, `TMultiple`, `TDisableClearable`, `TFreeSolo`\>, `"id"` \| `"options"` \| `"value"` \| `"onChange"` \| `"getOptionLabel"` \| `"isOptionEqualToValue"` \| `"multiple"` \| `"disableClearable"` \| `"freeSolo"` \| `"disabled"` \| `"loading"` \| `"fullWidth"` \| `"renderInput"` \| `"className"`\>\>

## Type Parameters

### T

`T`

The type of the option object

### TMultiple

`TMultiple` *extends* `boolean` = `false`

Whether multiple selection is enabled (default: false)

### TDisableClearable

`TDisableClearable` *extends* `boolean` = `false`

Whether clearing the value is disabled (default: false)

### TFreeSolo

`TFreeSolo` *extends* `boolean` = `false`

Whether free-form user input is allowed (default: false)

## Properties

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L74)

***

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L75)

***

### disableClearable?

> `optional` **disableClearable**: `TDisableClearable`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L65)

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L68)

***

### error?

> `optional` **error**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L70)

***

### freeSolo?

> `optional` **freeSolo**: `TFreeSolo`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L66)

***

### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L73)

***

### getOptionLabel()?

> `optional` **getOptionLabel**: (`option`) => `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L58)

#### Parameters

##### option

`T` | `AutocompleteFreeSoloValueMapping`\<`TFreeSolo`\>

#### Returns

`string`

***

### helperText?

> `optional` **helperText**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L71)

***

### id

> **id**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L47)

***

### isOptionEqualToValue()?

> `optional` **isOptionEqualToValue**: (`option`, `value`) => `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L62)

#### Parameters

##### option

`T`

##### value

`T`

#### Returns

`boolean`

***

### label?

> `optional` **label**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L56)

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L69)

***

### multiple?

> `optional` **multiple**: `TMultiple`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L64)

***

### onChange()

> **onChange**: (`value`) => `void`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L52)

#### Parameters

##### value

`AutocompleteValue`\<`T`, `TMultiple`, `TDisableClearable`, `TFreeSolo`\>

#### Returns

`void`

***

### options

> **options**: `T`[]

Defined in: [src/types/shared-components/Autocomplete/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L48)

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L57)

***

### renderInput()?

> `optional` **renderInput**: (`params`) => `ReactNode`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:95](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L95)

Optional custom renderInput function to override how the input is rendered.
Takes precedence over the default TextField rendering and textFieldProps.
If provided, textFieldProps are ignored.

#### Parameters

##### params

`AutocompleteRenderInputParams`

#### Returns

`ReactNode`

***

### textFieldProps?

> `optional` **textFieldProps**: `Partial`\<`Omit`\<`MuiTextFieldProps`, `"label"` \| `"placeholder"` \| `"error"` \| `"helperText"`\>\>

Defined in: [src/types/shared-components/Autocomplete/interface.ts:86](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L86)

Props to customize the underlying TextField component.
Allows control over size, variant, InputProps, etc.
Note: label, placeholder, error, helperText should be set via top-level props.

**Precedence:** If `renderInput` is provided, it fully overrides the default
TextField rendering and `textFieldProps` are ignored. If `renderInput` is not
provided, `textFieldProps` are merged into the default TextField internally.

***

### value

> **value**: `AutocompleteValue`\<`T`, `TMultiple`, `TDisableClearable`, `TFreeSolo`\>

Defined in: [src/types/shared-components/Autocomplete/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L50)
