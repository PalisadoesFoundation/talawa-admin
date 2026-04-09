[Admin Docs](/)

***

# Interface: InterfaceToolbarFilter

Defined in: [src/types/shared-components/Toolbar/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L6)

Configuration for a single filter/sort dropdown in the Toolbar.

## Properties

### containerClassName?

> `optional` **containerClassName**: `string`

Defined in: [src/types/shared-components/Toolbar/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L25)

***

### dropdownTestId?

> `optional` **dropdownTestId**: `string`

Defined in: [src/types/shared-components/Toolbar/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L24)

Optional data-testid for the whole dropdown element

***

### icon?

> `optional` **icon**: `string`

Defined in: [src/types/shared-components/Toolbar/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L28)

Optional custom icon URL (overrides type-based icon)

***

### id?

> `optional` **id**: `string`

Defined in: [src/types/shared-components/Toolbar/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L8)

Unique id for React key

***

### label?

> `optional` **label**: `string`

Defined in: [src/types/shared-components/Toolbar/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L14)

Label text shown on the dropdown button

***

### onChange()

> **onChange**: (`value`) => `void`

Defined in: [src/types/shared-components/Toolbar/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L20)

Called when user selects an option

#### Parameters

##### value

`string` | `number`

#### Returns

`void`

***

### options

> **options**: `object`[]

Defined in: [src/types/shared-components/Toolbar/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L16)

Available options

#### label

> **label**: `string`

#### value

> **value**: `string` \| `number`

***

### selected

> **selected**: `string` \| `number`

Defined in: [src/types/shared-components/Toolbar/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L18)

Currently selected value

***

### testIdPrefix

> **testIdPrefix**: `string`

Defined in: [src/types/shared-components/Toolbar/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L22)

data-testid prefix

***

### title

> **title**: `string`

Defined in: [src/types/shared-components/Toolbar/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L12)

Accessible title / aria-label for the dropdown

***

### toggleClassName?

> `optional` **toggleClassName**: `string`

Defined in: [src/types/shared-components/Toolbar/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L26)

***

### type?

> `optional` **type**: `"filter"` \| `"sort"`

Defined in: [src/types/shared-components/Toolbar/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Toolbar/interface.ts#L10)

Determines icon: 'sort' → SortIcon, 'filter' → FilterAltOutlined
