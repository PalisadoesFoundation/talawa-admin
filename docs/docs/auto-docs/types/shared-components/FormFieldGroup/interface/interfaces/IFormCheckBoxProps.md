[Admin Docs](/)

***

# Interface: IFormCheckBoxProps

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L130)

Checkbox component props using Bootstrap Form.Check.
Provides labeled checkbox with custom container and label attributes.

## Extends

- `Omit`\<`FormCheckProps`, `"formAction"` \| `"type"`\>.`Omit`\<`ICommonInputProps`, `"onBlur"` \| `"onFocus"` \| `"onChange"` \| `"value"` \| `"error"`\>

## Properties

### containerClass?

> `optional` **containerClass**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L139)

***

### containerProps?

> `optional` **containerProps**: `Omit`\<`React.HTMLAttributes`\<`HTMLDivElement`\>, `"onChange"` \| `"onBlur"` \| `"onFocus"` \| `"formAction"`\>

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L140)

***

### error?

> `optional` **error**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L145)

***

### labelProps?

> `optional` **labelProps**: `LabelHTMLAttributes`\<`HTMLLabelElement`\>

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L138)

***

### labelText?

> `optional` **labelText**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:137](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L137)

***

### touched?

> `optional` **touched**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L144)

***

### type?

> `optional` **type**: `"checkbox"`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L136)
