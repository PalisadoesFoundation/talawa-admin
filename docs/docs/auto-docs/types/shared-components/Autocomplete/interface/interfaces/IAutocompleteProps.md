[Admin Docs](/)

***

# Interface: IAutocompleteProps\<T, TMultiple, TDisableClearable, TFreeSolo\>

Defined in: [src/types/shared-components/Autocomplete/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L10)

## Extends

- `Partial`\<`Omit`\<`MuiAutocompleteProps`\<`T`, `TMultiple`, `TDisableClearable`, `TFreeSolo`\>, `"id"` \| `"options"` \| `"value"` \| `"onChange"` \| `"getOptionLabel"` \| `"isOptionEqualToValue"` \| `"multiple"` \| `"disableClearable"` \| `"freeSolo"` \| `"disabled"` \| `"loading"` \| `"fullWidth"` \| `"renderInput"` \| `"className"`\>\>

## Type Parameters

### T

`T`

### TMultiple

`TMultiple` *extends* `boolean` = `false`

### TDisableClearable

`TDisableClearable` *extends* `boolean` = `false`

### TFreeSolo

`TFreeSolo` *extends* `boolean` = `false`

## Properties

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L62)

***

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L63)

***

### disableClearable?

> `optional` **disableClearable**: `TDisableClearable`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L53)

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L56)

***

### error?

> `optional` **error**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L58)

***

### freeSolo?

> `optional` **freeSolo**: `TFreeSolo`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L54)

***

### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L61)

***

### getOptionLabel()?

> `optional` **getOptionLabel**: (`option`) => `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L46)

#### Parameters

##### option

`T` | `AutocompleteFreeSoloValueMapping`\<`TFreeSolo`\>

#### Returns

`string`

***

### helperText?

> `optional` **helperText**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L59)

***

### id

> **id**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L35)

***

### isOptionEqualToValue()?

> `optional` **isOptionEqualToValue**: (`option`, `value`) => `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L50)

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

Defined in: [src/types/shared-components/Autocomplete/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L44)

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L57)

***

### multiple?

> `optional` **multiple**: `TMultiple`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L52)

***

### onChange()

> **onChange**: (`value`) => `void`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L40)

#### Parameters

##### value

`AutocompleteValue`\<`T`, `TMultiple`, `TDisableClearable`, `TFreeSolo`\>

#### Returns

`void`

***

### options

> **options**: `T`[]

Defined in: [src/types/shared-components/Autocomplete/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L36)

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L45)

***

### renderInput()?

> `optional` **renderInput**: (`params`) => `ReactNode`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L83)

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

Defined in: [src/types/shared-components/Autocomplete/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L74)

Props to customize the underlying TextField component.
Allows control over size, variant, InputProps, etc.
Note: label, placeholder, error, helperText should be set via top-level props.

**Precedence:** If `renderInput` is provided, it fully overrides the default
TextField rendering and `textFieldProps` are ignored. If `renderInput` is not
provided, `textFieldProps` are merged into the default TextField internally.

***

### value

> **value**: `AutocompleteValue`\<`T`, `TMultiple`, `TDisableClearable`, `TFreeSolo`\>

Defined in: [src/types/shared-components/Autocomplete/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L38)
