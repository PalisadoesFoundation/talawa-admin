[**talawa-admin**](../../../../../README.md)

***

# Interface: IFilterState

Defined in: [src/types/shared-components/DataTable/types.ts:29](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/shared-components/DataTable/types.ts#L29)

Represents a single column filter.

Pairs a column ID with a filter value to be applied when filtering table rows.

## Properties

### columnId

> **columnId**: `string`

Defined in: [src/types/shared-components/DataTable/types.ts:31](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/shared-components/DataTable/types.ts#L31)

ID of the column being filtered

***

### value

> **value**: `unknown`

Defined in: [src/types/shared-components/DataTable/types.ts:33](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/shared-components/DataTable/types.ts#L33)

The filter value to match against rows (type depends on column)
