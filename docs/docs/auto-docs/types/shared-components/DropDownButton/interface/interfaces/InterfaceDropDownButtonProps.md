[Admin Docs](/)

***

# Interface: InterfaceDropDownButtonProps

Defined in: [src/types/shared-components/DropDownButton/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L66)

Interface for dropdown button component props.

## Extends

- [`InterfaceDropDownProps`](InterfaceDropDownProps.md)

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:95](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L95)

ARIA label for accessibility.

***

### btnStyle?

> `optional` **btnStyle**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L41)

Base class(es) for the toggle button. Applied first; often set by the wrapping component.
Use this for default button layout/theme.

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`btnStyle`](InterfaceDropDownProps.md#btnstyle)

***

### buttonLabel?

> `optional` **buttonLabel**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L126)

The label of the button.

***

### containerClassName?

> `optional` **containerClassName**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L53)

Consumer override: extra class name(s) for the dropdown container, merged with
parentContainerStyle. Use from parent screens (e.g. CSS module classes) to style the
container without coupling to test IDs.

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`containerClassName`](InterfaceDropDownProps.md#containerclassname)

***

### dataTestIdPrefix?

> `optional` **dataTestIdPrefix**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:100](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L100)

Data test id prefix for testing purposes.

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L136)

Whether the dropdown button is disabled.

***

### drop?

> `optional` **drop**: `"start"` \| `"end"` \| `"up"` \| `"down"`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L80)

Direction the dropdown menu opens.

***

### icon?

> `optional` **icon**: `ReactNode`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L131)

The icon to be displayed on the button.

***

### id?

> `optional` **id**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L70)

The id of the dropdown button.

***

### menuClassName?

> `optional` **menuClassName**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L46)

Custom class name for the dropdown menu.

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`menuClassName`](InterfaceDropDownProps.md#menuclassname)

***

### onSelect()

> **onSelect**: (`value`) => `void`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:90](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L90)

Callback function when an option is selected.

#### Parameters

##### value

`string`

#### Returns

`void`

***

### options

> **options**: [`InterfaceDropDownOption`](InterfaceDropDownOption.md)[]

Defined in: [src/types/shared-components/DropDownButton/interface.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L75)

The options to be displayed in the dropdown.

***

### parentContainerStyle?

> `optional` **parentContainerStyle**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L35)

Base class(es) for the dropdown container. Applied first; often set by the wrapping component
(e.g. SortingButton, Navbar). Use this for default layout/theme.

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`parentContainerStyle`](InterfaceDropDownProps.md#parentcontainerstyle)

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:141](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L141)

Placeholder text when no option is selected.

***

### searchable?

> `optional` **searchable**: `boolean`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L146)

Whether the dropdown should be searchable.

***

### searchPlaceholder?

> `optional` **searchPlaceholder**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:151](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L151)

Placeholder text for the search input.

***

### selectedValue?

> `optional` **selectedValue**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:85](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L85)

The currently selected value.

***

### showCaret?

> `optional` **showCaret**: `boolean`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:156](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L156)

Whether to show the caret icon on the dropdown button.

#### Default Value

```ts
true
```

***

### toggleClassName?

> `optional` **toggleClassName**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L60)

Consumer override: extra class name(s) for the toggle button, merged with btnStyle.
Use from parent screens (e.g. CSS module classes) to style the toggle without
coupling to test IDs.

#### Inherited from

[`InterfaceDropDownProps`](InterfaceDropDownProps.md).[`toggleClassName`](InterfaceDropDownProps.md#toggleclassname)

***

### variant?

> `optional` **variant**: `"primary"` \| `"secondary"` \| `"success"` \| `"danger"` \| `"warning"` \| `"info"` \| `"dark"` \| `"light"` \| `"outline-primary"` \| `"outline-secondary"` \| `"outline-success"` \| `"outline-danger"` \| `"outline-warning"` \| `"outline-info"` \| `"outline-dark"` \| `"outline-light"`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:105](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L105)

The variant/style of the button.
