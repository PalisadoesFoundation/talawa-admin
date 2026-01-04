[Admin Docs](/)

***

# Interface: IFormCheckBoxProps

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L131)

Checkbox component props using Bootstrap Form.Check.
Provides labeled checkbox with custom container and label attributes.

## Extends

- `Omit`\<`FormCheckProps`, `"formAction"` \| `"type"`\>.`Omit`\<`ICommonInputProps`, `"onBlur"` \| `"onFocus"` \| `"onChange"` \| `"value"` \| `"error"`\>

## Properties

### containerClass?

> `optional` **containerClass**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L140)

***

### containerProps?

> `optional` **containerProps**: `Omit`\<`React.HTMLAttributes`\<`HTMLDivElement`\>, `"onChange"` \| `"onBlur"` \| `"onFocus"` \| `"formAction"`\>

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:141](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L141)

***

### error?

> `optional` **error**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L146)

***

### labelProps?

> `optional` **labelProps**: `LabelHTMLAttributes`\<`HTMLLabelElement`\>

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L139)

***

### labelText?

> `optional` **labelText**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L138)

***

### touched?

> `optional` **touched**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L145)

***

### type?

> `optional` **type**: `"checkbox"`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:137](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L137)
