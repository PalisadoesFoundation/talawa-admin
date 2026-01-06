[Admin Docs](/)

***

# Interface: IFormSelectProps

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:100](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L100)

Autocomplete/select component props using Material-UI Autocomplete.
Supports single/multiple selection with user data (InterfaceUserInfo).

## Extends

- `Omit`\<`ICommonInputProps`, `"value"` \| `"onChange"` \| `"error"`\>

## Properties

### ariaDescribedBy?

> `optional` **ariaDescribedBy**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L124)

***

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L123)

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L22)

#### Inherited from

`Omit.className`

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L19)

#### Inherited from

`Omit.disabled`

***

### error?

> `optional` **error**: `string` \| `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L119)

***

### filterSelectedOptions?

> `optional` **filterSelectedOptions**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L110)

***

### getOptionLabel()?

> `optional` **getOptionLabel**: (`option`) => `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L111)

#### Parameters

##### option

[`InterfaceUserInfo`](../../../../../utils/interfaces/interfaces/InterfaceUserInfo.md)

#### Returns

`string`

***

### helpText?

> `optional` **helpText**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L121)

***

### isOptionEqualToValue()?

> `optional` **isOptionEqualToValue**: (`option`, `value`) => `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L106)

#### Parameters

##### option

[`InterfaceUserInfo`](../../../../../utils/interfaces/interfaces/InterfaceUserInfo.md)

##### value

[`InterfaceUserInfo`](../../../../../utils/interfaces/interfaces/InterfaceUserInfo.md)

#### Returns

`boolean`

***

### label?

> `optional` **label**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L117)

***

### limitTags?

> `optional` **limitTags**: `number`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:105](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L105)

***

### multiple?

> `optional` **multiple**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L104)

***

### name?

> `optional` **name**: `string`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:118](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L118)

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

> `optional` **onChange**: (`event`, `value`) => `void`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L112)

#### Parameters

##### event

`SyntheticEvent`

##### value

[`InterfaceUserInfo`](../../../../../utils/interfaces/interfaces/InterfaceUserInfo.md) | [`InterfaceUserInfo`](../../../../../utils/interfaces/interfaces/InterfaceUserInfo.md)[]

#### Returns

`void`

***

### onFocus()?

> `optional` **onFocus**: () => `void`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L20)

#### Returns

`void`

#### Inherited from

`Omit.onFocus`

***

### options?

> `optional` **options**: [`InterfaceUserInfo`](../../../../../utils/interfaces/interfaces/InterfaceUserInfo.md)[]

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L102)

***

### renderInput()?

> `optional` **renderInput**: (`params`) => `ReactNode`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:116](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L116)

#### Parameters

##### params

`AutocompleteRenderInputParams`

#### Returns

`ReactNode`

***

### required?

> `optional` **required**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L122)

#### Overrides

`Omit.required`

***

### touched?

> `optional` **touched**: `boolean`

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L120)

***

### value?

> `optional` **value**: [`InterfaceUserInfo`](../../../../../utils/interfaces/interfaces/InterfaceUserInfo.md) \| [`InterfaceUserInfo`](../../../../../utils/interfaces/interfaces/InterfaceUserInfo.md)[]

Defined in: [src/types/shared-components/FormFieldGroup/interface.ts:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/FormFieldGroup/interface.ts#L103)
