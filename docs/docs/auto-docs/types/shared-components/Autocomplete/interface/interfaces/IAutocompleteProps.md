[Admin Docs](/)

***

# Interface: IAutocompleteProps\<T, TMultiple, TDisableClearable, TFreeSolo\>

Defined in: [src/types/shared-components/Autocomplete/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L68)

Props for the shared Autocomplete component.

This interface extends the MUI Autocomplete props while providing custom
props for consistent behavior, accessibility, and integration patterns
across the application.

## Extends

- `Partial`\<`IAutocompleteBaseProps`\>

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

### autoComplete?

> `optional` **autoComplete**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L33)

#### Inherited from

`Partial.autoComplete`

***

### autoHighlight?

> `optional` **autoHighlight**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L34)

#### Inherited from

`Partial.autoHighlight`

***

### autoSelect?

> `optional` **autoSelect**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L35)

#### Inherited from

`Partial.autoSelect`

***

### blurOnSelect?

> `optional` **blurOnSelect**: `boolean` \| `"touch"` \| `"mouse"`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L36)

#### Inherited from

`Partial.blurOnSelect`

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L102)

***

### clearOnBlur?

> `optional` **clearOnBlur**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L37)

#### Inherited from

`Partial.clearOnBlur`

***

### clearOnEscape?

> `optional` **clearOnEscape**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L38)

#### Inherited from

`Partial.clearOnEscape`

***

### clearText?

> `optional` **clearText**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L39)

#### Inherited from

`Partial.clearText`

***

### closeText?

> `optional` **closeText**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L40)

#### Inherited from

`Partial.closeText`

***

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L103)

***

### disableClearable?

> `optional` **disableClearable**: `TDisableClearable`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:93](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L93)

***

### disableCloseOnSelect?

> `optional` **disableCloseOnSelect**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L41)

#### Inherited from

`Partial.disableCloseOnSelect`

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:96](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L96)

***

### disabledItemsFocusable?

> `optional` **disabledItemsFocusable**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L42)

#### Inherited from

`Partial.disabledItemsFocusable`

***

### disableListWrap?

> `optional` **disableListWrap**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L43)

#### Inherited from

`Partial.disableListWrap`

***

### disablePortal?

> `optional` **disablePortal**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L44)

#### Inherited from

`Partial.disablePortal`

***

### error?

> `optional` **error**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:98](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L98)

***

### filterSelectedOptions?

> `optional` **filterSelectedOptions**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L45)

#### Inherited from

`Partial.filterSelectedOptions`

***

### freeSolo?

> `optional` **freeSolo**: `TFreeSolo`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:94](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L94)

***

### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:101](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L101)

***

### getOptionLabel()?

> `optional` **getOptionLabel**: (`option`) => `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:86](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L86)

#### Parameters

##### option

`T` | `AutocompleteFreeSoloValueMapping`\<`TFreeSolo`\>

#### Returns

`string`

***

### handleHomeEndKeys?

> `optional` **handleHomeEndKeys**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L46)

#### Inherited from

`Partial.handleHomeEndKeys`

***

### helperText?

> `optional` **helperText**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:99](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L99)

***

### id

> **id**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L75)

***

### includeInputInList?

> `optional` **includeInputInList**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L47)

#### Inherited from

`Partial.includeInputInList`

***

### isOptionEqualToValue()?

> `optional` **isOptionEqualToValue**: (`option`, `value`) => `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:90](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L90)

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

Defined in: [src/types/shared-components/Autocomplete/interface.ts:84](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L84)

***

### limitTags?

> `optional` **limitTags**: `number`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L48)

#### Inherited from

`Partial.limitTags`

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:97](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L97)

***

### loadingText?

> `optional` **loadingText**: `ReactNode`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L49)

#### Inherited from

`Partial.loadingText`

***

### multiple?

> `optional` **multiple**: `TMultiple`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:92](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L92)

***

### noOptionsText?

> `optional` **noOptionsText**: `ReactNode`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L50)

#### Inherited from

`Partial.noOptionsText`

***

### onChange()

> **onChange**: (`value`) => `void`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L80)

#### Parameters

##### value

`AutocompleteValue`\<`T`, `TMultiple`, `TDisableClearable`, `TFreeSolo`\>

#### Returns

`void`

***

### openOnFocus?

> `optional` **openOnFocus**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L51)

#### Inherited from

`Partial.openOnFocus`

***

### options

> **options**: `T`[]

Defined in: [src/types/shared-components/Autocomplete/interface.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L76)

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:85](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L85)

***

### readOnly?

> `optional` **readOnly**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L52)

#### Inherited from

`Partial.readOnly`

***

### renderInput()?

> `optional` **renderInput**: (`params`) => `ReactNode`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L126)

Optional custom renderInput function to override how the input is rendered.
Takes precedence over the default TextField rendering and textFieldProps.
If provided, textFieldProps are ignored.

#### Parameters

##### params

`IAutocompleteRenderInputParams`

#### Returns

`ReactNode`

***

### selectOnFocus?

> `optional` **selectOnFocus**: `boolean`

Defined in: [src/types/shared-components/Autocomplete/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L53)

#### Inherited from

`Partial.selectOnFocus`

***

### textFieldProps?

> `optional` **textFieldProps**: `Partial`\<`Omit`\<`IAutocompleteTextFieldProps`, `"label"` \| `"placeholder"` \| `"error"` \| `"helperText"`\>\>

Defined in: [src/types/shared-components/Autocomplete/interface.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L114)

Props to customize the underlying TextField component.
Allows control over size, variant, InputProps, etc.
Note: label, placeholder, error, helperText should be set via top-level props.

**Precedence:** If `renderInput` is provided, it fully overrides the default
TextField rendering and `textFieldProps` are ignored. If `renderInput` is not
provided, `textFieldProps` are merged into the default TextField internally.

***

### value

> **value**: `AutocompleteValue`\<`T`, `TMultiple`, `TDisableClearable`, `TFreeSolo`\>

Defined in: [src/types/shared-components/Autocomplete/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Autocomplete/interface.ts#L78)
