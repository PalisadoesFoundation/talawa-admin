[**talawa-admin**](../../../../README.md)

***

# Function: adjustColumnsForCompactMode()

> **adjustColumnsForCompactMode**(`columns`, `compactMode`): [`ReportingTableColumn`](../../../../types/ReportingTable/interface/type-aliases/ReportingTableColumn.md)[]

Defined in: [src/shared-components/ReportingTable/ReportingTable.tsx:23](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/shared-components/ReportingTable/ReportingTable.tsx#L23)

Adjusts column widths for compact display mode.
In compact mode:
- First column gets flex: 0.5 and minWidth: space-10 (typically for row numbers)
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
