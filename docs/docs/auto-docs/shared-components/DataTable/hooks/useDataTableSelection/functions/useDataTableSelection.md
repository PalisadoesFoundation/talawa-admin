[Admin Docs](/)

***

# Function: useDataTableSelection()

> **useDataTableSelection**\<`T`\>(`options`): `object`

Defined in: [src/shared-components/DataTable/hooks/useDataTableSelection.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/hooks/useDataTableSelection.ts#L20)

Hook to manage DataTable selection and bulk action logic.

## Type Parameters

### T

`T`

## Parameters

### options

`IUseDataTableSelectionOptions`\<`T`\>

## Returns

`object`

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
