[Admin Docs](/)

***

# Interface: IFormTextFieldProps

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L69)

Text field component props supporting both Bootstrap and MUI formats.
Combines common input, Bootstrap-specific, and MUI properties.

## Extends

- `IBootstrapTextFieldProps`.`IMuiFieldProps`.`Omit`\<[`IFormFieldGroupProps`](IFormFieldGroupProps.md), `"error"`\>.`Omit`\<`ICommonInputProps`, `"error"`\>

## Indexable

\[`key`: `` `data-${string}` ``\]: `string` \| `number`

## Properties

### ariaDescribedBy?

> `optional` **ariaDescribedBy**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L56)

#### Inherited from

[`IFormFieldGroupProps`](IFormFieldGroupProps.md).[`ariaDescribedBy`](IFormFieldGroupProps.md#ariadescribedby)

***

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L55)

#### Inherited from

[`IFormFieldGroupProps`](IFormFieldGroupProps.md).[`ariaLabel`](IFormFieldGroupProps.md#arialabel)

***

### autoComplete?

> `optional` **autoComplete**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L34)

#### Inherited from

`IBootstrapTextFieldProps.autoComplete`

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L22)

#### Inherited from

`Omit.className`

***

### controlClass?

> `optional` **controlClass**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L35)

#### Inherited from

`IBootstrapTextFieldProps.controlClass`

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L19)

#### Inherited from

`Omit.disabled`

***

### endAdornment?

> `optional` **endAdornment**: `ReactNode`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L45)

#### Inherited from

`IMuiFieldProps.endAdornment`

***

### error?

> `optional` **error**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L75)

***

### format

> **format**: `"bootstrap"` \| `"mui"`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L74)

***

### groupClass?

> `optional` **groupClass**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L57)

#### Inherited from

[`IFormFieldGroupProps`](IFormFieldGroupProps.md).[`groupClass`](IFormFieldGroupProps.md#groupclass)

***

### helpText?

> `optional` **helpText**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L61)

#### Inherited from

[`IFormFieldGroupProps`](IFormFieldGroupProps.md).[`helpText`](IFormFieldGroupProps.md#helptext)

***

### label?

> `optional` **label**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L54)

#### Inherited from

[`IFormFieldGroupProps`](IFormFieldGroupProps.md).[`label`](IFormFieldGroupProps.md#label)

***

### labelClass?

> `optional` **labelClass**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L58)

#### Inherited from

[`IFormFieldGroupProps`](IFormFieldGroupProps.md).[`labelClass`](IFormFieldGroupProps.md#labelclass)

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L32)

#### Inherited from

`IBootstrapTextFieldProps.maxLength`

***

### name?

> `optional` **name**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L53)

#### Inherited from

[`IFormFieldGroupProps`](IFormFieldGroupProps.md).[`name`](IFormFieldGroupProps.md#name)

***

### onBlur()?

> `optional` **onBlur**: () => `void`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L21)

#### Returns

`void`

#### Inherited from

`Omit.onBlur`

***

### onChange()?

> `optional` **onChange**: (`e`) => `void`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L16)

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

#### Inherited from

`Omit.onChange`

***

### onFocus()?

> `optional` **onFocus**: () => `void`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L20)

#### Returns

`void`

#### Inherited from

`Omit.onFocus`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L31)

#### Inherited from

`IBootstrapTextFieldProps.placeholder`

***

### required?

> `optional` **required**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L62)

#### Inherited from

[`IFormFieldGroupProps`](IFormFieldGroupProps.md).[`required`](IFormFieldGroupProps.md#required)

***

### showCharCount?

> `optional` **showCharCount**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L33)

#### Inherited from

`IBootstrapTextFieldProps.showCharCount`

***

### touched?

> `optional` **touched**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L60)

#### Inherited from

[`IFormFieldGroupProps`](IFormFieldGroupProps.md).[`touched`](IFormFieldGroupProps.md#touched)

***

### type?

> `optional` **type**: `"number"` \| `"text"` \| `"email"` \| `"password"` \| `"tel"` \| `"url"`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L30)

#### Inherited from

`IBootstrapTextFieldProps.type`

***

### value

> **value**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L15)

#### Inherited from

`Omit.value`

***

### variant?

> `optional` **variant**: `TextFieldVariants`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L44)

#### Inherited from

`IMuiFieldProps.variant`
