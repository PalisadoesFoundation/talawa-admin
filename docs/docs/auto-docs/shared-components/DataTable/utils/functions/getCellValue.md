[Admin Docs](/)

***

# Function: getCellValue()

> **getCellValue**\<`T`, `TValue`\>(`row`, `accessor`): `TValue`

Defined in: [src/shared-components/DataTable/utils.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/utils.ts#L41)

Helper to get raw cell value from a row using the accessor.

## Type Parameters

### T

`T`

The row data type

### TValue

`TValue` = `unknown`

The expected return value type

## Parameters

### row

`T`

The row data object

### accessor

[`Accessor`](../../../../types/shared-components/DataTable/types/type-aliases/Accessor.md)\<`T`, `TValue`\>

Column accessor (property key or function)

## Returns

`TValue`

The cell value
