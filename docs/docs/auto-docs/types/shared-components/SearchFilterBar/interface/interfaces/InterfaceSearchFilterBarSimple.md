[Admin Docs](/)

***

# Interface: InterfaceSearchFilterBarSimple

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:230](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SearchFilterBar/interface.ts#L230)

Configuration for SearchFilterBar with only search functionality (no dropdowns).
Use this variant when you only need search capabilities without any sorting or filtering dropdowns.

## Example

```tsx
<SearchFilterBar
  hasDropdowns={false}
  searchPlaceholder="Search requests"
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
/>
```

## Extends

- `InterfaceSearchFilterBarBase`

## Properties

### containerClassName?

> `optional` **containerClassName**: `string`

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:192](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SearchFilterBar/interface.ts#L192)

Optional custom class name for the container div.
**Job:** Allows overriding the default container styling for different screen layouts.
default "btnsContainerSearchBar"

#### Example

```ts
"btnsContainer", "btnsContainerSearchBar"
```

#### Inherited from

`InterfaceSearchFilterBarBase.containerClassName`

***

### debounceDelay?

> `optional` **debounceDelay**: `number`

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:201](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SearchFilterBar/interface.ts#L201)

Optional delay in milliseconds for debouncing search input changes.
**Job:** Controls how long to wait after the user stops typing before calling onSearchChange.
This prevents excessive API calls while the user is actively typing.
default 300

#### Example

```ts
300, 500, 1000
```

#### Inherited from

`InterfaceSearchFilterBarBase.debounceDelay`

***

### hasDropdowns

> **hasDropdowns**: `false`

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:236](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SearchFilterBar/interface.ts#L236)

Discriminator property indicating this variant has no dropdowns.

**Job:** When `false`, the `dropdowns` property must be omitted.

***

### onSearchChange()

> **onSearchChange**: (`value`) => `void`

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:152](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SearchFilterBar/interface.ts#L152)

Callback function triggered on every keystroke in the search input.
**Trigger:** User types or deletes characters in the search field (onChange event).
**Job:** Updates the parent component's search state immediately.
Parent components should handle their own debouncing for expensive operations.

#### Parameters

##### value

`string`

The current value of the search input field

#### Returns

`void`

#### Example

```ts
onSearchChange={(value) => setSearchTerm(value)}
```

#### Inherited from

`InterfaceSearchFilterBarBase.onSearchChange`

***

### onSearchSubmit()?

> `optional` **onSearchSubmit**: (`value`) => `void`

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SearchFilterBar/interface.ts#L168)

Optional callback function triggered when the user explicitly submits the search.
**Trigger:** User presses Enter key or clicks the search button.
**Job:** Performs an immediate search action.
Useful for triggering search on explicit user action vs typing.

#### Parameters

##### value

`string`

The current value of the search input field

#### Returns

`void`

#### Example

```ts
onSearchSubmit={(value) => {
  console.log('User explicitly searched for:', value);
  performSearch(value);
}}
```

#### Inherited from

`InterfaceSearchFilterBarBase.onSearchSubmit`

***

### searchButtonTestId?

> `optional` **searchButtonTestId**: `string`

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:184](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SearchFilterBar/interface.ts#L184)

Optional data-testid for the search button.
**Job:** Enables testing frameworks to identify the search button element.
default "searchButton"

#### Example

```ts
"searchPluginsBtn", "searchBtn", "searchButton"
```

#### Inherited from

`InterfaceSearchFilterBarBase.searchButtonTestId`

***

### searchInputTestId?

> `optional` **searchInputTestId**: `string`

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:176](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SearchFilterBar/interface.ts#L176)

Optional data-testid for the search input field.
**Job:** Enables testing frameworks to identify the search input element.
default "searchInput"

#### Example

```ts
"searchPlugins", "searchBy", "searchRequests"
```

#### Inherited from

`InterfaceSearchFilterBarBase.searchInputTestId`

***

### searchPlaceholder

> **searchPlaceholder**: `string`

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SearchFilterBar/interface.ts#L131)

Placeholder text displayed in the search input field.
**Job:** Provides guidance to users about what they can search for.

#### Example

```ts
"Search by volunteer", "Search requests", "Search plugins"
```

#### Inherited from

`InterfaceSearchFilterBarBase.searchPlaceholder`

***

### searchValue

> **searchValue**: `string`

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SearchFilterBar/interface.ts#L139)

The current search term value.
**Job:** Controls the value of the search input field (controlled component pattern).
This should be managed in the parent component's state.

#### Example

```ts
"John Doe", "authentication", ""
```

#### Inherited from

`InterfaceSearchFilterBarBase.searchValue`

***

### translations?

> `optional` **translations**: [`InterfaceSearchFilterBarTranslations`](InterfaceSearchFilterBarTranslations.md)

Defined in: [src/types/shared-components/SearchFilterBar/interface.ts:214](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/SearchFilterBar/interface.ts#L214)

Optional translation overrides for accessibility and UI customization.
**Job:** Allows customizing internal component translations while providing sensible defaults.

#### Example

```ts
translations: {
  searchButtonAriaLabel: "Search for volunteers",
  dropdownAriaLabel: "Toggle {label} options"
}
```

#### Inherited from

`InterfaceSearchFilterBarBase.translations`
