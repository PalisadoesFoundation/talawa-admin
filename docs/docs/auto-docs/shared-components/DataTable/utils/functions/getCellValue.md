[**talawa-admin**](../../../../README.md)

***

# Function: getCellValue()

> **getCellValue**\<`T`, `TValue`\>(`row`, `accessor`): `TValue`

Defined in: [src/shared-components/DataTable/utils.ts:41](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/shared-components/DataTable/utils.ts#L41)

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
