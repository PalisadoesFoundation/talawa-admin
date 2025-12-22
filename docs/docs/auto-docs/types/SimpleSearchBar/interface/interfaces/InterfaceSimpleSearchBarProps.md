[Admin Docs](/)

***

# Interface: InterfaceSimpleSearchBarProps

Defined in: [src/types/SimpleSearchBar/interface.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SimpleSearchBar/interface.ts#L5)

Props interface for the simple SearchBar component used by AdminSearchFilterBar.
This is a lightweight version compared to the comprehensive SearchBar.

## Properties

### buttonAriaLabel?

> `optional` **buttonAriaLabel**: `string`

Defined in: [src/types/SimpleSearchBar/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SimpleSearchBar/interface.ts#L19)

Accessible label for the search button

***

### buttonTestId?

> `optional` **buttonTestId**: `string`

Defined in: [src/types/SimpleSearchBar/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SimpleSearchBar/interface.ts#L17)

Custom data-testid for the search button

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/SimpleSearchBar/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SimpleSearchBar/interface.ts#L13)

Optional custom class name for the search bar container

***

### inputTestId?

> `optional` **inputTestId**: `string`

Defined in: [src/types/SimpleSearchBar/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SimpleSearchBar/interface.ts#L15)

Custom data-testid for the search input

***

### onChange()?

> `optional` **onChange**: (`searchTerm`) => `void`

Defined in: [src/types/SimpleSearchBar/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SimpleSearchBar/interface.ts#L11)

Optional function to handle input change (for automatic search)

#### Parameters

##### searchTerm

`string`

#### Returns

`void`

***

### onSearch()?

> `optional` **onSearch**: (`searchTerm`) => `void`

Defined in: [src/types/SimpleSearchBar/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SimpleSearchBar/interface.ts#L9)

Function to handle search input change

#### Parameters

##### searchTerm

`string`

#### Returns

`void`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/SimpleSearchBar/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SimpleSearchBar/interface.ts#L7)

Placeholder text for the search input

***

### value?

> `optional` **value**: `string`

Defined in: [src/types/SimpleSearchBar/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SimpleSearchBar/interface.ts#L21)

Optional controlled value for the search input
