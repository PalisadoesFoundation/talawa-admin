[Admin Docs](/)

***

# Interface: InterfaceAdminSearchFilterBarSimple

Defined in: [src/types/AdminSearchFilterBar/interface.ts:214](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L214)

Configuration for AdminSearchFilterBar with only search functionality (no dropdowns).
Use this variant when you only need search capabilities without any sorting or filtering dropdowns.

## Example

```tsx
<AdminSearchFilterBar
  hasDropdowns={false}
  searchPlaceholder="Search requests"
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
/>
```

## Extends

- `InterfaceAdminSearchFilterBarBase`

## Properties

### containerClassName?

> `optional` **containerClassName**: `string`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:176](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L176)

Optional custom class name for the container div.
**Job:** Allows overriding the default container styling for different screen layouts.

#### Default

```ts
"btnsContainerSearchBar"
```

#### Example

```ts
"btnsContainer", "btnsContainerSearchBar"
```

#### Inherited from

`InterfaceAdminSearchFilterBarBase.containerClassName`

***

### debounceDelay?

> `optional` **debounceDelay**: `number`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:185](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L185)

Optional delay in milliseconds for debouncing search input changes.
**Job:** Controls how long to wait after the user stops typing before calling onSearchChange.
This prevents excessive API calls while the user is actively typing.

#### Default

```ts
300
```

#### Example

```ts
300, 500, 1000
```

#### Inherited from

`InterfaceAdminSearchFilterBarBase.debounceDelay`

***

### hasDropdowns

> **hasDropdowns**: `false`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:221](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L221)

Discriminator property indicating this variant has no dropdowns.

**Job:** When `false`, the `dropdowns` property must be omitted.

***

### onSearchChange()

> **onSearchChange**: (`value`) => `void`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L136)

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

`InterfaceAdminSearchFilterBarBase.onSearchChange`

***

### onSearchSubmit()?

> `optional` **onSearchSubmit**: (`value`) => `void`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:152](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L152)

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

`InterfaceAdminSearchFilterBarBase.onSearchSubmit`

***

### searchButtonTestId?

> `optional` **searchButtonTestId**: `string`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L168)

Optional data-testid for the search button.
**Job:** Enables testing frameworks to identify the search button element.

#### Default

```ts
"searchButton"
```

#### Example

```ts
"searchPluginsBtn", "searchBtn", "searchButton"
```

#### Inherited from

`InterfaceAdminSearchFilterBarBase.searchButtonTestId`

***

### searchInputTestId?

> `optional` **searchInputTestId**: `string`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:160](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L160)

Optional data-testid for the search input field.
**Job:** Enables testing frameworks to identify the search input element.

#### Default

```ts
"searchInput"
```

#### Example

```ts
"searchPlugins", "searchBy", "searchRequests"
```

#### Inherited from

`InterfaceAdminSearchFilterBarBase.searchInputTestId`

***

### searchPlaceholder

> **searchPlaceholder**: `string`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L115)

Placeholder text displayed in the search input field.
**Job:** Provides guidance to users about what they can search for.

#### Example

```ts
"Search by volunteer", "Search requests", "Search plugins"
```

#### Inherited from

`InterfaceAdminSearchFilterBarBase.searchPlaceholder`

***

### searchValue

> **searchValue**: `string`

Defined in: [src/types/AdminSearchFilterBar/interface.ts:123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L123)

The current search term value.
**Job:** Controls the value of the search input field (controlled component pattern).
This should be managed in the parent component's state.

#### Example

```ts
"John Doe", "authentication", ""
```

#### Inherited from

`InterfaceAdminSearchFilterBarBase.searchValue`

***

### translations?

> `optional` **translations**: [`InterfaceAdminSearchFilterBarTranslations`](InterfaceAdminSearchFilterBarTranslations.md)

Defined in: [src/types/AdminSearchFilterBar/interface.ts:198](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminSearchFilterBar/interface.ts#L198)

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

`InterfaceAdminSearchFilterBarBase.translations`
