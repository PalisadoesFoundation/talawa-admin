[Admin Docs](/)

***

# Interface: IFilterState

Defined in: [src/types/shared-components/DataTable/types.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L29)

Represents a single column filter.

Pairs a column ID with a filter value to be applied when filtering table rows.

## Properties

### columnId

> **columnId**: `string`

Defined in: [src/types/shared-components/DataTable/types.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L31)

ID of the column being filtered

***

### value

> **value**: `unknown`

Defined in: [src/types/shared-components/DataTable/types.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L33)

The filter value to match against rows (type depends on column)
