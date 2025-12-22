[Admin Docs](/)

***

# Interface: InterfaceDropdownConfig

Defined in: [src/types/AdminSearchFilterBar/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L35)

Configuration for a single dropdown (sort or filter) in the AdminSearchFilterBar.
Each dropdown represents either a sorting control or a filter control,
and is rendered using the SortingButton component.

## Properties

### dataTestIdPrefix

> **dataTestIdPrefix**: `string`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:95](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L95)

The prefix used for generating data-testid attributes for testing.
This is passed directly to the SortingButton component's `dataTestIdPrefix` prop.

#### Example

```ts
"sortTags", "filterPlugins", "timeFrame"
```

***

### dropdownTestId?

> `optional` **dropdownTestId**: `string`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L109)

Optional data-testid for the dropdown element itself.
**Job:** Enables testing frameworks to identify the entire dropdown component.

#### Example

```ts
"filter", "sort", "timeFrame"
```

***

### id

> **id**: `string`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L41)

A unique identifier for this dropdown configuration.
Used as the React key for stable rendering and should be unique across all dropdowns.

#### Example

```ts
"sort-by-date", "filter-by-status", "group-by-category"
```

***

### label

> **label**: `string`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L48)

The label/title displayed on the dropdown button.
This is typically a user-facing label like "Sort", "Filter", or "Time Frame".

#### Example

```ts
"Sort", "Filter plugins", "Time Frame"
```

***

### onOptionChange()

> **onOptionChange**: (`value`) => `void`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:88](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L88)

Callback function triggered when the user selects a different option.
**Trigger:** User clicks on a dropdown item in the menu.
**Job:** Updates the parent component's state with the newly selected value.

#### Parameters

##### value

The `value` field of the selected option

`string` | `number`

#### Returns

`void`

#### Example

```ts
onOptionChange={(value) => setSortOrder(value as SortedByType)}
```

***

### options

> **options**: [`InterfaceSortingOption`](InterfaceSortingOption.md)[]

Defined in: [src/types/AdminSearchFilterBar/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L68)

The list of available options for this dropdown.
Each option contains a label (display text) and a value (underlying data).

#### Example

```ts
[
  { label: 'Latest', value: 'DESCENDING' },
  { label: 'Oldest', value: 'ASCENDING' }
]
```

***

### selectedOption

> **selectedOption**: `string` \| `number`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L75)

The currently selected option value.
This should match the `value` field of one of the options in the `options` array.

#### Example

```ts
"DESCENDING", "hours_DESC", "all", 0, 1, 2
```

***

### title?

> `optional` **title**: `string`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L102)

Optional title attribute for the dropdown element.
**Job:** Provides tooltip text when hovering over the dropdown.

#### Example

```ts
"Filter plugins", "Sort options"
```

***

### type

> **type**: `"filter"` \| `"sort"`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L55)

The type of dropdown control.
- `'sort'`: Displays a sort icon and is used for ordering data
- `'filter'`: Displays a filter icon and is used for filtering data
