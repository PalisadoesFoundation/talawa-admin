[Admin Docs](/)

***

# Interface: InterfaceSearchBarProps

Defined in: [src/types/shared-components/DataTable/props.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L68)

Props for a searchable input/search bar component.

Configures search input behavior including value synchronization,
change callbacks, debouncing, and accessibility attributes.

## Properties

### aria?

> `optional` **aria**: `object`

Defined in: [src/types/shared-components/DataTable/props.ts:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L82)

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

Defined in: [src/types/shared-components/DataTable/props.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L78)

ARIA label for the search input

***

### clear-aria-label?

> `optional` **clear-aria-label**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L80)

ARIA label for the clear button

***

### debounceDelay?

> `optional` **debounceDelay**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:89](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L89)

Milliseconds to debounce search input changes

***

### onChange()

> **onChange**: (`q`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L72)

Callback fired when search value changes

#### Parameters

##### q

`string`

#### Returns

`void`

***

### onClear()?

> `optional` **onClear**: () => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L74)

Callback fired when search is cleared

#### Returns

`void`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L76)

Placeholder text to display in the search input

***

### value?

> `optional` **value**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L70)

Current search input value
