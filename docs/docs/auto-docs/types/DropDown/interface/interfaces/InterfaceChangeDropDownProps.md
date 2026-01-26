[Admin Docs](/)

***

# Interface: InterfaceChangeDropDownProps\<T\>

Defined in: [src/types/DropDown/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DropDown/interface.ts#L12)

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

Defined in: [src/types/DropDown/interface.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DropDown/interface.ts#L4)

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`btnStyle`](InterfaceDropDownProps.md#btnstyle)

***

### btnTextStyle?

> `optional` **btnTextStyle**: `string`

Defined in: [src/types/DropDown/interface.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DropDown/interface.ts#L5)

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`btnTextStyle`](InterfaceDropDownProps.md#btntextstyle)

***

### fieldName

> **fieldName**: `string`

Defined in: [src/types/DropDown/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DropDown/interface.ts#L21)

Form field name bound to this dropdown.

***

### fieldOptions

> **fieldOptions**: `object`[]

Defined in: [src/types/DropDown/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DropDown/interface.ts#L19)

Dropdown options.

#### label

> **label**: `string`

#### value

> **value**: `string`

***

### formState

> **formState**: `T`

Defined in: [src/types/DropDown/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DropDown/interface.ts#L17)

Current form state.

***

### handleChange()?

> `optional` **handleChange**: (`e`) => `void`

Defined in: [src/types/DropDown/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DropDown/interface.ts#L23)

Optional custom change handler.

#### Parameters

##### e

`ChangeEvent`\<`HTMLSelectElement`\>

#### Returns

`void`

***

### parentContainerStyle?

> `optional` **parentContainerStyle**: `string`

Defined in: [src/types/DropDown/interface.ts:3](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DropDown/interface.ts#L3)

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`parentContainerStyle`](InterfaceDropDownProps.md#parentcontainerstyle)

***

### setFormState

> **setFormState**: `Dispatch`\<`SetStateAction`\<`T`\>\>

Defined in: [src/types/DropDown/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DropDown/interface.ts#L15)

State setter for the form.
