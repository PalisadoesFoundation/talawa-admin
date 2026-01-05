[Admin Docs](/)

***

# Interface: IFormDateFieldProps

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:183](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L183)

Date picker field component props using MUI DatePicker with Dayjs.
Supports min/max date constraints and custom text field props via slotProps.

## Properties

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:191](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L191)

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:189](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L189)

***

### error?

> `optional` **error**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:209](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L209)

***

### format?

> `optional` **format**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:186](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L186)

***

### label?

> `optional` **label**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:207](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L207)

***

### maxDate?

> `optional` **maxDate**: `Dayjs`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:188](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L188)

***

### minDate?

> `optional` **minDate**: `Dayjs`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:187](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L187)

***

### name?

> `optional` **name**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:208](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L208)

***

### onChange()

> **onChange**: (`date`) => `void`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:185](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L185)

#### Parameters

##### date

`Dayjs`

#### Returns

`void`

***

### readOnly?

> `optional` **readOnly**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:190](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L190)

***

### required?

> `optional` **required**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:210](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L210)

***

### slotProps?

> `optional` **slotProps**: `object`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:192](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L192)

#### textField?

> `optional` **textField**: `object`

##### textField.error?

> `optional` **error**: `boolean`

##### textField.helperText?

> `optional` **helperText**: `string`

##### textField.inputProps?

> `optional` **inputProps**: `object`

###### Index Signature

\[`key`: `` `data-${string}` ``\]: `string` \| `number`

##### textField.inputProps.aria-label?

> `optional` **aria-label**: `string`

##### textField.inputProps.data-testid?

> `optional` **data-testid**: `string`

##### textField.inputProps.max?

> `optional` **max**: `string`

##### textField.inputProps.min?

> `optional` **min**: `string`

##### textField.label?

> `optional` **label**: `string`

##### textField.required?

> `optional` **required**: `boolean`

***

### value

> **value**: `Dayjs`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:184](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L184)
