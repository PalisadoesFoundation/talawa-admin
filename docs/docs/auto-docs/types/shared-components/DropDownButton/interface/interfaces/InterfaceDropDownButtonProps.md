[Admin Docs](/)

***

# Interface: InterfaceDropDownButtonProps

Defined in: [src/types/shared-components/DropDownButton/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L39)

Interface for dropdown button component props.

## Extends

- [`InterfaceDropDownProps`](InterfaceDropDownProps.md)

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L68)

ARIA label for accessibility.

***

### btnStyle?

> `optional` **btnStyle**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L33)

Custom styles for the dropdown button.

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`btnStyle`](InterfaceDropDownProps.md#btnstyle)

***

### buttonLabel?

> `optional` **buttonLabel**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:99](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L99)

The label of the button.

***

### dataTestIdPrefix?

> `optional` **dataTestIdPrefix**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L73)

Data test id prefix for testing purposes.

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L109)

Whether the dropdown button is disabled.

***

### drop?

> `optional` **drop**: `"start"` \| `"end"` \| `"up"` \| `"down"`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L53)

Direction the dropdown menu opens.

***

### icon?

> `optional` **icon**: `ReactNode`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L104)

The icon to be displayed on the button.

***

### id?

> `optional` **id**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L43)

The id of the dropdown button.

***

### onSelect()

> **onSelect**: (`value`) => `void`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L63)

Callback function when an option is selected.

#### Parameters

##### value

`string`

#### Returns

`void`

***

### options

> **options**: [`InterfaceDropDownOption`](InterfaceDropDownOption.md)[]

Defined in: [src/types/shared-components/DropDownButton/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L48)

The options to be displayed in the dropdown.

***

### parentContainerStyle?

> `optional` **parentContainerStyle**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L28)

Custom styles for the parent container.

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`parentContainerStyle`](InterfaceDropDownProps.md#parentcontainerstyle)

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L114)

Placeholder text when no option is selected.

***

### selectedValue?

> `optional` **selectedValue**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L58)

The currently selected value.

***

### variant?

> `optional` **variant**: `"primary"` \| `"secondary"` \| `"success"` \| `"danger"` \| `"warning"` \| `"info"` \| `"dark"` \| `"light"` \| `"outline-primary"` \| `"outline-secondary"` \| `"outline-success"` \| `"outline-danger"` \| `"outline-warning"` \| `"outline-info"` \| `"outline-dark"` \| `"outline-light"`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L78)

The variant/style of the button.
