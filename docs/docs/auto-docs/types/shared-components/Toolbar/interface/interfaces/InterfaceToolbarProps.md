[Admin Docs](/)

***

# Interface: InterfaceToolbarProps

Defined in: [src/types/shared-components/Toolbar/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L37)

Props for the unified Toolbar component.

This is a superset of both the old PageHeader (Navbar) and SearchFilterBar APIs.
Migrate all callers to this component to avoid duplicate toolbar implementations.

## Properties

### actions?

> `optional` **actions**: `ReactNode`

Defined in: [src/types/shared-components/Toolbar/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L66)

Action buttons rendered on the right of the toolbar row

***

### containerClassName?

> `optional` **containerClassName**: `string`

Defined in: [src/types/shared-components/Toolbar/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L72)

Extra class applied to the inner flex row (overrides default)

***

### filters?

> `optional` **filters**: [`InterfaceToolbarFilter`](InterfaceToolbarFilter.md)[]

Defined in: [src/types/shared-components/Toolbar/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L63)

Sort/filter dropdowns rendered between search and actions

***

### filtersAriaLabel?

> `optional` **filtersAriaLabel**: `string`

Defined in: [src/types/shared-components/Toolbar/interface.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L75)

Accessible label for the filters toolbar region

***

### rootClassName?

> `optional` **rootClassName**: `string`

Defined in: [src/types/shared-components/Toolbar/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L69)

Extra class applied to the outermost wrapper div

***

### search?

> `optional` **search**: `object`

Defined in: [src/types/shared-components/Toolbar/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L42)

Search bar configuration

#### ariaDescription?

> `optional` **ariaDescription**: `string`

Visually-hidden description for screen readers

#### buttonTestId?

> `optional` **buttonTestId**: `string`

#### debounceDelay?

> `optional` **debounceDelay**: `number`

Debounce delay in ms when using onChange (default 300)

#### inputTestId?

> `optional` **inputTestId**: `string`

#### onChange()?

> `optional` **onChange**: (`value`) => `void`

Per-keystroke callback. When provided, onSearch is only called on submit.

##### Parameters

###### value

`string`

##### Returns

`void`

#### onSearch()

> **onSearch**: (`value`) => `void`

Called when the user submits the search (button click / Enter) OR,
if no `onChange` is provided, on every debounced keystroke.

##### Parameters

###### value

`string`

##### Returns

`void`

#### placeholder

> **placeholder**: `string`

Placeholder text for the search input

#### value?

> `optional` **value**: `string`

Controlled value. When provided the input is controlled.

***

### title?

> `optional` **title**: `string`

Defined in: [src/types/shared-components/Toolbar/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L39)

Optional heading rendered above the toolbar row
