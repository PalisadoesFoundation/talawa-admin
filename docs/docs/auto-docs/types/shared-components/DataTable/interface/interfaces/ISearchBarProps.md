[Admin Docs](/)

***

# Interface: ISearchBarProps

Defined in: [src/types/shared-components/DataTable/interface.ts:529](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L529)

Props for the SearchBar component.

Used to render a controlled search input field with an optional clear button.

## Properties

### aria-label?

> `optional` **aria-label**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:553](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L553)

Accessible label for screen readers.
Applied to the search input's aria-label attribute.

#### Default Value

```ts
'Search'
```

***

### clear-aria-label?

> `optional` **clear-aria-label**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:559](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L559)

Accessible label for the clear button, announced by screen readers.

#### Default Value

```ts
'Clear search'
```

***

### onChange()

> **onChange**: (`query`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:540](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L540)

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

Defined in: [src/types/shared-components/DataTable/interface.ts:546](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L546)

Placeholder text displayed when the input is empty.

#### Default Value

```ts
'Search…'
```

***

### value

> **value**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:534](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L534)

The current search query value.
This is a controlled value that should be managed by the parent component.
