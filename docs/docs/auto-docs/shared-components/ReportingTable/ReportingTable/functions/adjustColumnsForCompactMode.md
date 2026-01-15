[**talawa-admin**](../../../../README.md)

***

# Function: adjustColumnsForCompactMode()

> **adjustColumnsForCompactMode**(`columns`, `compactMode`): [`ReportingTableColumn`](../../../../types/ReportingTable/interface/type-aliases/ReportingTableColumn.md)[]

Defined in: [src/shared-components/ReportingTable/ReportingTable.tsx:20](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/shared-components/ReportingTable/ReportingTable.tsx#L20)

Adjusts column widths for compact display mode.
In compact mode:
- First column gets flex: 0.5 and minWidth: 50 (typically for row numbers)
- Second column gets flex capped at 1.5 (typically for names)
- Remaining columns are unchanged

## Parameters

### columns

[`ReportingTableColumn`](../../../../types/ReportingTable/interface/type-aliases/ReportingTableColumn.md)[]

Original column definitions

### compactMode

`boolean`

Whether to apply compact adjustments

## Returns

[`ReportingTableColumn`](../../../../types/ReportingTable/interface/type-aliases/ReportingTableColumn.md)[]

Adjusted column definitions
