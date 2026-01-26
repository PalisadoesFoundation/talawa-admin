[Admin Docs](/)

***

# Interface: InterfaceSearchBarProps

Defined in: [src/types/shared-components/DataTable/props.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L77)

Props for a searchable input/search bar component.

Configures search input behavior including value synchronization,
change callbacks, debouncing, and accessibility attributes.

## Properties

### aria?

> `optional` **aria**: `object`

Defined in: [src/types/shared-components/DataTable/props.ts:91](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L91)

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

Defined in: [src/types/shared-components/DataTable/props.ts:87](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L87)

ARIA label for the search input

***

### clear-aria-label?

> `optional` **clear-aria-label**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:89](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L89)

ARIA label for the clear button

***

### debounceDelay?

> `optional` **debounceDelay**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:98](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L98)

Milliseconds to debounce search input changes

***

### onChange()

> **onChange**: (`q`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:81](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L81)

Callback fired when search value changes

#### Parameters

##### q

`string`

#### Returns

`void`

***

### onClear()?

> `optional` **onClear**: () => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L83)

Callback fired when search is cleared

#### Returns

`void`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:85](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L85)

Placeholder text to display in the search input

***

### value?

> `optional` **value**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L79)

Current search input value
