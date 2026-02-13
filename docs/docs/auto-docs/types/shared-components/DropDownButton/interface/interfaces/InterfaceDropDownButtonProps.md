[Admin Docs](/)

***

# Interface: InterfaceDropDownButtonProps

Defined in: [src/types/shared-components/DropDownButton/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L54)

Interface for dropdown button component props.

## Extends

- [`InterfaceDropDownProps`](InterfaceDropDownProps.md)

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L83)

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

Defined in: [src/types/shared-components/DropDownButton/interface.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L114)

The label of the button.

***

### containerClassName?

> `optional` **containerClassName**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L43)

Optional extra class name for the dropdown container (merged with existing classes).

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`containerClassName`](InterfaceDropDownProps.md#containerclassname)

***

### dataTestIdPrefix?

> `optional` **dataTestIdPrefix**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:88](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L88)

Data test id prefix for testing purposes.

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L124)

Whether the dropdown button is disabled.

***

### drop?

> `optional` **drop**: `"start"` \| `"end"` \| `"up"` \| `"down"`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L68)

Direction the dropdown menu opens.

***

### icon?

> `optional` **icon**: `ReactNode`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L119)

The icon to be displayed on the button.

***

### id?

> `optional` **id**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L58)

The id of the dropdown button.

***

### menuClassName?

> `optional` **menuClassName**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L38)

Custom class name for the dropdown menu.

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`menuClassName`](InterfaceDropDownProps.md#menuclassname)

***

### onSelect()

> **onSelect**: (`value`) => `void`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L78)

Callback function when an option is selected.

#### Parameters

##### value

`string`

#### Returns

`void`

***

### options

> **options**: [`InterfaceDropDownOption`](InterfaceDropDownOption.md)[]

Defined in: [src/types/shared-components/DropDownButton/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L63)

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

Defined in: [src/types/shared-components/DropDownButton/interface.ts:129](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L129)

Placeholder text when no option is selected.

***

### searchable?

> `optional` **searchable**: `boolean`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L134)

Whether the dropdown should be searchable.

***

### searchPlaceholder?

> `optional` **searchPlaceholder**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L139)

Placeholder text for the search input.

***

### selectedValue?

> `optional` **selectedValue**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L73)

The currently selected value.

***

### showCaret?

> `optional` **showCaret**: `boolean`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L144)

Whether to show the caret icon on the dropdown button.

#### Default Value

```ts
true
```

***

### toggleClassName?

> `optional` **toggleClassName**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L48)

Optional extra class name for the toggle button (merged with existing classes).

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`toggleClassName`](InterfaceDropDownProps.md#toggleclassname)

***

### variant?

> `optional` **variant**: `"primary"` \| `"secondary"` \| `"success"` \| `"danger"` \| `"warning"` \| `"info"` \| `"dark"` \| `"light"` \| `"outline-primary"` \| `"outline-secondary"` \| `"outline-success"` \| `"outline-danger"` \| `"outline-warning"` \| `"outline-info"` \| `"outline-dark"` \| `"outline-light"`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:93](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L93)

The variant/style of the button.
