[Admin Docs](/)

***

# Interface: InterfaceSortingButtonProps

Defined in: [src/types/shared-components/SortingButton/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L11)

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/SortingButton/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L31)

Accessible label for the dropdown button (screen readers)

***

### buttonLabel?

> `optional` **buttonLabel**: `string`

Defined in: [src/types/shared-components/SortingButton/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L27)

Optional prop for custom button label

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/SortingButton/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L25)

Custom class name for the Dropdown

***

### dataTestIdPrefix

> **dataTestIdPrefix**: `string`

Defined in: [src/types/shared-components/SortingButton/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L21)

The prefix for data-testid attributes for testing

***

### dropdownTestId?

> `optional` **dropdownTestId**: `string`

Defined in: [src/types/shared-components/SortingButton/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L23)

The data-testid attribute for the Dropdown

***

### icon?

> `optional` **icon**: `string`

Defined in: [src/types/shared-components/SortingButton/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L32)

***

### onSortChange()

> **onSortChange**: (`value`) => `void`

Defined in: [src/types/shared-components/SortingButton/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L19)

Callback function to handle sorting option change

#### Parameters

##### value

`string` | `number`

#### Returns

`void`

***

### selectedOption?

> `optional` **selectedOption**: `string` \| `number`

Defined in: [src/types/shared-components/SortingButton/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L17)

The currently selected sorting option

***

### sortingOptions

> **sortingOptions**: [`InterfaceSortingOption`](InterfaceSortingOption.md)[]

Defined in: [src/types/shared-components/SortingButton/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L15)

The list of sorting options to display in the Dropdown

***

### title?

> `optional` **title**: `string`

Defined in: [src/types/shared-components/SortingButton/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L13)

The title attribute for the Dropdown

***

### type?

> `optional` **type**: `"filter"` \| `"sort"`

Defined in: [src/types/shared-components/SortingButton/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SortingButton/interface.ts#L29)

Type to determine the icon to display: 'sort' or 'filter'
