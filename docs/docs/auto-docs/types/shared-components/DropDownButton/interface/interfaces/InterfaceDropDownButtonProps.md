[Admin Docs](/)

***

# Interface: InterfaceDropDownButtonProps

Defined in: [src/types/shared-components/DropDownButton/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L28)

## Extends

- [`InterfaceDropDownProps`](InterfaceDropDownProps.md)

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L52)

ARIA label for accessibility.

***

### btnStyle?

> `optional` **btnStyle**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L26)

Custom styles for the dropdown button.

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`btnStyle`](InterfaceDropDownProps.md#btnstyle)

***

### buttonLabel?

> `optional` **buttonLabel**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L83)

The label of the button.

***

### dataTestIdPrefix?

> `optional` **dataTestIdPrefix**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L57)

Data test id prefix for testing purposes.

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:93](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L93)

Whether the dropdown button is disabled.

***

### icon?

> `optional` **icon**: `ReactNode`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:88](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L88)

The icon to be displayed on the button.

***

### id?

> `optional` **id**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L32)

The id of the dropdown button.

***

### onSelect()

> **onSelect**: (`value`) => `void`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L47)

Callback function when an option is selected.

#### Parameters

##### value

`string`

#### Returns

`void`

***

### options

> **options**: [`InterfaceDropDownOption`](InterfaceDropDownOption.md)[]

Defined in: [src/types/shared-components/DropDownButton/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L37)

The options to be displayed in the dropdown.

***

### parentContainerStyle?

> `optional` **parentContainerStyle**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L21)

Custom styles for the parent container.

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`parentContainerStyle`](InterfaceDropDownProps.md#parentcontainerstyle)

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:98](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L98)

Placeholder text when no option is selected.

***

### selectedValue?

> `optional` **selectedValue**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L42)

The currently selected value.

***

### variant?

> `optional` **variant**: `"primary"` \| `"secondary"` \| `"success"` \| `"danger"` \| `"warning"` \| `"info"` \| `"dark"` \| `"light"` \| `"outline-primary"` \| `"outline-secondary"` \| `"outline-success"` \| `"outline-danger"` \| `"outline-warning"` \| `"outline-info"` \| `"outline-dark"` \| `"outline-light"`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L62)

The variant/style of the button.
