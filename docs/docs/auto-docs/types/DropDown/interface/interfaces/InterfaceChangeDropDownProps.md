[**talawa-admin**](../../../../README.md)

***

# Interface: InterfaceChangeDropDownProps\<T\>

Defined in: [src/types/DropDown/interface.ts:12](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/DropDown/interface.ts#L12)

Props for DynamicDropDown change-handling variant.

## Extends

- [`InterfaceDropDownProps`](InterfaceDropDownProps.md)

## Type Parameters

### T

`T`

Form state shape.

## Properties

### btnStyle?

> `optional` **btnStyle**: `string`

Defined in: [src/types/DropDown/interface.ts:4](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/DropDown/interface.ts#L4)

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`btnStyle`](InterfaceDropDownProps.md#btnstyle)

***

### btnTextStyle?

> `optional` **btnTextStyle**: `string`

Defined in: [src/types/DropDown/interface.ts:5](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/DropDown/interface.ts#L5)

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`btnTextStyle`](InterfaceDropDownProps.md#btntextstyle)

***

### fieldName

> **fieldName**: `string`

Defined in: [src/types/DropDown/interface.ts:22](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/DropDown/interface.ts#L22)

Form field name bound to this dropdown.

***

### fieldOptions

> **fieldOptions**: `object`[]

Defined in: [src/types/DropDown/interface.ts:20](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/DropDown/interface.ts#L20)

Dropdown options.

#### label

> **label**: `string`

#### value

> **value**: `string`

***

### formState

> **formState**: `T`

Defined in: [src/types/DropDown/interface.ts:18](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/DropDown/interface.ts#L18)

Current form state.

***

### handleChange()?

> `optional` **handleChange**: (`e`) => `void`

Defined in: [src/types/DropDown/interface.ts:24](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/DropDown/interface.ts#L24)

Optional custom change handler.

#### Parameters

##### e

`ChangeEvent`\<`HTMLSelectElement`\>

#### Returns

`void`

***

### parentContainerStyle?

> `optional` **parentContainerStyle**: `string`

Defined in: [src/types/DropDown/interface.ts:3](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/DropDown/interface.ts#L3)

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`parentContainerStyle`](InterfaceDropDownProps.md#parentcontainerstyle)

***

### setFormState

> **setFormState**: `Dispatch`\<`SetStateAction`\<`T`\>\>

Defined in: [src/types/DropDown/interface.ts:16](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/DropDown/interface.ts#L16)

State setter for the form.
