[Admin Docs](/)

***

# Interface: IFormCheckBoxProps

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L132)

Checkbox component props using Bootstrap Form.Check.
Provides labeled checkbox with custom container and label attributes.

## Extends

- `Omit`\<`FormCheckProps`, `"formAction"` \| `"type"`\>.`Omit`\<`ICommonInputProps`, `"onBlur"` \| `"onFocus"` \| `"onChange"` \| `"value"` \| `"error"`\>

## Properties

### containerClass?

> `optional` **containerClass**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:141](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L141)

***

### containerProps?

> `optional` **containerProps**: `Omit`\<`React.HTMLAttributes`\<`HTMLDivElement`\>, `"onChange"` \| `"onBlur"` \| `"onFocus"` \| `"formAction"`\>

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:142](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L142)

***

### error?

> `optional` **error**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:147](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L147)

***

### labelProps?

> `optional` **labelProps**: `LabelHTMLAttributes`\<`HTMLLabelElement`\>

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L140)

***

### labelText?

> `optional` **labelText**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L139)

***

### touched?

> `optional` **touched**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L146)

***

### type?

> `optional` **type**: `"checkbox"`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L138)
