[Admin Docs](/)

***

# Interface: FormSelectProps

Defined in: src/types/FormFieldGroup/interface.ts:63

## Extends

- [`FormFieldGroupProps`](FormFieldGroupProps.md).`Omit`\<`CommonInputProps`, `"value"` \| `"onChange"`\>

## Properties

### ariaDescribedBy?

> `optional` **ariaDescribedBy**: `string`

Defined in: src/types/FormFieldGroup/interface.ts:39

#### Inherited from

[`FormFieldGroupProps`](FormFieldGroupProps.md).[`ariaDescribedBy`](FormFieldGroupProps.md#ariadescribedby)

***

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: src/types/FormFieldGroup/interface.ts:38

#### Inherited from

[`FormFieldGroupProps`](FormFieldGroupProps.md).[`ariaLabel`](FormFieldGroupProps.md#arialabel)

***

### className?

> `optional` **className**: `string`

Defined in: src/types/FormFieldGroup/interface.ts:14

#### Inherited from

[`FormTextFieldProps`](FormTextFieldProps.md).[`className`](FormTextFieldProps.md#classname)

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: src/types/FormFieldGroup/interface.ts:11

#### Inherited from

[`FormTextFieldProps`](FormTextFieldProps.md).[`disabled`](FormTextFieldProps.md#disabled)

***

### error?

> `optional` **error**: `boolean`

Defined in: src/types/FormFieldGroup/interface.ts:9

#### Inherited from

[`FormTextFieldProps`](FormTextFieldProps.md).[`error`](FormTextFieldProps.md#error)

***

### filterSelectedOptions?

> `optional` **filterSelectedOptions**: `boolean`

Defined in: src/types/FormFieldGroup/interface.ts:75

***

### getOptionLabel()?

> `optional` **getOptionLabel**: (`option`) => `string`

Defined in: src/types/FormFieldGroup/interface.ts:76

#### Parameters

##### option

[`InterfaceUserInfo`](../../../../utils/interfaces/interfaces/InterfaceUserInfo.md)

#### Returns

`string`

***

### groupClass?

> `optional` **groupClass**: `string`

Defined in: src/types/FormFieldGroup/interface.ts:40

#### Inherited from

[`FormFieldGroupProps`](FormFieldGroupProps.md).[`groupClass`](FormFieldGroupProps.md#groupclass)

***

### isOptionEqualToValue()?

> `optional` **isOptionEqualToValue**: (`option`, `value`) => `boolean`

Defined in: src/types/FormFieldGroup/interface.ts:71

#### Parameters

##### option

[`InterfaceUserInfo`](../../../../utils/interfaces/interfaces/InterfaceUserInfo.md)

##### value

[`InterfaceUserInfo`](../../../../utils/interfaces/interfaces/InterfaceUserInfo.md)

#### Returns

`boolean`

***

### label?

> `optional` **label**: `string`

Defined in: src/types/FormFieldGroup/interface.ts:37

#### Inherited from

[`FormFieldGroupProps`](FormFieldGroupProps.md).[`label`](FormFieldGroupProps.md#label)

***

### labelClass?

> `optional` **labelClass**: `string`

Defined in: src/types/FormFieldGroup/interface.ts:41

#### Inherited from

[`FormFieldGroupProps`](FormFieldGroupProps.md).[`labelClass`](FormFieldGroupProps.md#labelclass)

***

### limitTags?

> `optional` **limitTags**: `number`

Defined in: src/types/FormFieldGroup/interface.ts:70

***

### multiple?

> `optional` **multiple**: `boolean`

Defined in: src/types/FormFieldGroup/interface.ts:69

***

### name?

> `optional` **name**: `string`

Defined in: src/types/FormFieldGroup/interface.ts:36

#### Inherited from

[`FormFieldGroupProps`](FormFieldGroupProps.md).[`name`](FormFieldGroupProps.md#name)

***

### onBlur()?

> `optional` **onBlur**: () => `void`

Defined in: src/types/FormFieldGroup/interface.ts:13

#### Returns

`void`

#### Inherited from

[`FormTextFieldProps`](FormTextFieldProps.md).[`onBlur`](FormTextFieldProps.md#onblur)

***

### onChange()?

> `optional` **onChange**: (`event`, `value`) => `void`

Defined in: src/types/FormFieldGroup/interface.ts:77

#### Parameters

##### event

`SyntheticEvent`

##### value

[`InterfaceUserInfo`](../../../../utils/interfaces/interfaces/InterfaceUserInfo.md) | [`InterfaceUserInfo`](../../../../utils/interfaces/interfaces/InterfaceUserInfo.md)[]

#### Returns

`void`

***

### onFocus()?

> `optional` **onFocus**: () => `void`

Defined in: src/types/FormFieldGroup/interface.ts:12

#### Returns

`void`

#### Inherited from

[`FormTextFieldProps`](FormTextFieldProps.md).[`onFocus`](FormTextFieldProps.md#onfocus)

***

### options?

> `optional` **options**: [`InterfaceUserInfo`](../../../../utils/interfaces/interfaces/InterfaceUserInfo.md)[]

Defined in: src/types/FormFieldGroup/interface.ts:67

***

### renderInput()

> **renderInput**: (`params`) => `ReactNode`

Defined in: src/types/FormFieldGroup/interface.ts:81

#### Parameters

##### params

`AutocompleteRenderInputParams`

#### Returns

`ReactNode`

***

### required?

> `optional` **required**: `boolean`

Defined in: src/types/FormFieldGroup/interface.ts:10

#### Inherited from

[`FormTextFieldProps`](FormTextFieldProps.md).[`required`](FormTextFieldProps.md#required)

***

### value?

> `optional` **value**: [`InterfaceUserInfo`](../../../../utils/interfaces/interfaces/InterfaceUserInfo.md) \| [`InterfaceUserInfo`](../../../../utils/interfaces/interfaces/InterfaceUserInfo.md)[]

Defined in: src/types/FormFieldGroup/interface.ts:68
