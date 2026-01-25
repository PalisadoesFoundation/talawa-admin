[Admin Docs](/)

***

# Interface: ITableLoaderProps\<T\>

Defined in: [src/types/shared-components/DataTable/interface.ts:660](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L660)

Props for the table loading skeleton component

Used to display placeholder loading states while data is being fetched,
either as a full table skeleton or as an overlay on top of existing data.

## Type Parameters

### T

`T`

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:671](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L671)

Accessible label for the loading table, used for screen readers

***

### asOverlay?

> `optional` **asOverlay**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:668](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L668)

When true, render as a translucent overlay over existing table content instead of standalone

***

### columns

> **columns**: [`IColumnDef`](IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/interface.ts:662](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L662)

Column definitions to match the structure of the actual table

***

### rows?

> `optional` **rows**: `number`

Defined in: [src/types/shared-components/DataTable/interface.ts:665](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L665)

Number of skeleton rows to display (default: 5)
