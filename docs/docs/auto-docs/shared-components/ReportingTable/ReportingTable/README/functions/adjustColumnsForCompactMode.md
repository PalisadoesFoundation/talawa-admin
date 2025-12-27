[**talawa-admin**](README.md)

***

# Function: adjustColumnsForCompactMode()

> **adjustColumnsForCompactMode**(`columns`, `compactMode`): [`ReportingTableColumn`](types\ReportingTable\interface\README\type-aliases\ReportingTableColumn.md)[]

Defined in: [src/shared-components/ReportingTable/ReportingTable.tsx:20](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/shared-components/ReportingTable/ReportingTable.tsx#L20)

Adjusts column widths for compact display mode.
In compact mode:
- First column gets flex: 0.5 and minWidth: 50 (typically for row numbers)
- Second column gets flex capped at 1.5 (typically for names)
- Remaining columns are unchanged

## Parameters

### columns

[`ReportingTableColumn`](types\ReportingTable\interface\README\type-aliases\ReportingTableColumn.md)[]

Original column definitions

### compactMode

`boolean`

Whether to apply compact adjustments

## Returns

[`ReportingTableColumn`](types\ReportingTable\interface\README\type-aliases\ReportingTableColumn.md)[]

Adjusted column definitions
