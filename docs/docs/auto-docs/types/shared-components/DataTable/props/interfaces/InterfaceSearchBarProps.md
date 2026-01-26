[Admin Docs](/)

***

# Interface: InterfaceSearchBarProps

Defined in: [src/types/shared-components/DataTable/props.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L69)

Props for a searchable input/search bar component.

Configures search input behavior including value synchronization,
change callbacks, debouncing, and accessibility attributes.

## Properties

### aria?

> `optional` **aria**: `object`

Defined in: [src/types/shared-components/DataTable/props.ts:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L83)

ARIA accessibility attributes for the search input

#### label?

> `optional` **label**: `string`

ARIA label for the search input

#### labelledBy?

> `optional` **labelledBy**: `string`

ARIA labelledBy for linking to external labels

***

### aria-label?

> `optional` **aria-label**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L79)

ARIA label for the search input

***

### clear-aria-label?

> `optional` **clear-aria-label**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:81](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L81)

ARIA label for the clear button

***

### debounceDelay?

> `optional` **debounceDelay**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:90](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L90)

Milliseconds to debounce search input changes

***

### onChange()

> **onChange**: (`q`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L73)

Callback fired when search value changes

#### Parameters

##### q

`string`

#### Returns

`void`

***

### onClear()?

> `optional` **onClear**: () => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L75)

Callback fired when search is cleared

#### Returns

`void`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L77)

Placeholder text to display in the search input

***

### value?

> `optional` **value**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L71)

Current search input value
