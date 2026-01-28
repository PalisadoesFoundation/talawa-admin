[**talawa-admin**](../../../../README.md)

***

# Function: getCellValue()

> **getCellValue**\<`T`, `TValue`\>(`row`, `accessor`): `TValue`

Defined in: [src/shared-components/DataTable/utils.ts:41](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/shared-components/DataTable/utils.ts#L41)

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

[`Accessor`](../../../../types/shared-components/DataTable/interface/type-aliases/Accessor.md)\<`T`, `TValue`\>

Column accessor (property key or function)

## Returns

`TValue`

The cell value
