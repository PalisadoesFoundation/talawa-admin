[Admin Docs](/)

***

# Interface: InterfaceSortingButtonProps

Defined in: [src/types/shared-components/SortingButton/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L14)

Props for the SortingButton component.

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/SortingButton/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L34)

Accessible label for the dropdown button (screen readers)

***

### buttonLabel?

> `optional` **buttonLabel**: `string`

Defined in: [src/types/shared-components/SortingButton/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L30)

Optional prop for custom button label

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/SortingButton/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L28)

Custom class name for the Dropdown

***

### dataTestIdPrefix

> **dataTestIdPrefix**: `string`

Defined in: [src/types/shared-components/SortingButton/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L24)

The prefix for data-testid attributes for testing

***

### dropdownTestId?

> `optional` **dropdownTestId**: `string`

Defined in: [src/types/shared-components/SortingButton/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L26)

The data-testid attribute for the Dropdown

***

### icon?

> `optional` **icon**: `string`

Defined in: [src/types/shared-components/SortingButton/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L36)

Optional custom icon to display in the button

***

### onSortChange()

> **onSortChange**: (`value`) => `void`

Defined in: [src/types/shared-components/SortingButton/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L22)

Callback function to handle sorting option change

#### Parameters

##### value

`string` | `number`

#### Returns

`void`

***

### selectedOption?

> `optional` **selectedOption**: `string` \| `number`

Defined in: [src/types/shared-components/SortingButton/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L20)

The currently selected sorting option

***

### sortingOptions

> **sortingOptions**: [`InterfaceSortingOption`](InterfaceSortingOption.md)[]

Defined in: [src/types/shared-components/SortingButton/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L18)

The list of sorting options to display in the Dropdown

***

### title?

> `optional` **title**: `string`

Defined in: [src/types/shared-components/SortingButton/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L16)

The title attribute for the Dropdown

***

### type?

> `optional` **type**: `"filter"` \| `"sort"`

Defined in: [src/types/shared-components/SortingButton/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L32)

Type to determine the icon to display: 'sort' or 'filter'
