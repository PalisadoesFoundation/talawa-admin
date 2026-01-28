[**talawa-admin**](../../../../../README.md)

***

# Function: useDataTableSelection()

> **useDataTableSelection**\<`T`\>(`options`): `object`

Defined in: [src/shared-components/DataTable/hooks/useDataTableSelection.ts:17](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/shared-components/DataTable/hooks/useDataTableSelection.ts#L17)

Hook to manage DataTable selection and bulk action logic.
Supports controlled and uncontrolled modes for row selection.
Normalizes selection to current page keys on page changes.

## Type Parameters

### T

`T`

The row data type

## Parameters

### options

[`IUseDataTableSelectionOptions`](../../../../../types/shared-components/DataTable/interface/interfaces/IUseDataTableSelectionOptions.md)\<`T`\>

Configuration options for selection behavior

## Returns

`object`

Object containing selection state and mutation helpers

### allSelectedOnPage

> **allSelectedOnPage**: `boolean`

### clearSelection()

> **clearSelection**: () => `void`

#### Returns

`void`

### currentSelection

> **currentSelection**: `Set`\<[`Key`](../../../../../types/shared-components/DataTable/interface/type-aliases/Key.md)\>

### runBulkAction()

> **runBulkAction**: (`action`) => `void`

#### Parameters

##### action

[`IBulkAction`](../../../../../types/shared-components/DataTable/interface/interfaces/IBulkAction.md)\<`T`\>

#### Returns

`void`

### selectAllOnPage()

> **selectAllOnPage**: (`checked`) => `void`

#### Parameters

##### checked

`boolean`

#### Returns

`void`

### selectedCountOnPage

> **selectedCountOnPage**: `number`

### someSelectedOnPage

> **someSelectedOnPage**: `boolean`

### toggleRowSelection()

> **toggleRowSelection**: (`key`) => `void`

#### Parameters

##### key

[`Key`](../../../../../types/shared-components/DataTable/interface/type-aliases/Key.md)

#### Returns

`void`
