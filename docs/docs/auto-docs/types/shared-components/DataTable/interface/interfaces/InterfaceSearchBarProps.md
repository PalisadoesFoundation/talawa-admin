[**talawa-admin**](../../../../../README.md)

***

# Interface: InterfaceSearchBarProps

Defined in: [src/types/shared-components/DataTable/interface.ts:608](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L608)

Props for the SearchBar component.

Used to render a controlled search input field with an optional clear button.

## Properties

### aria-label?

> `optional` **aria-label**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:632](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L632)

Accessible label for screen readers.
Applied to the search input's aria-label attribute.

#### Default Value

```ts
'Search'
```

***

### clear-aria-label?

> `optional` **clear-aria-label**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:638](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L638)

Accessible label for the clear button, announced by screen readers.

#### Default Value

```ts
'Clear search'
```

***

### onChange()

> **onChange**: (`query`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:619](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L619)

Callback fired when the input value changes or when the clear button is clicked.

#### Parameters

##### query

`string`

The new search query string (empty string when cleared)

#### Returns

`void`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:625](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L625)

Placeholder text displayed when the input is empty.

#### Default Value

```ts
'Search…'
```

***

### value

> **value**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:613](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L613)

The current search query value.
This is a controlled value that should be managed by the parent component.
