[Admin Docs](/)

***

# Interface: IPeopleTableProps

Defined in: [src/types/PeopleTable/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTable/interface.ts#L6)

Interface representing the props for the PeopleTable component.

## Properties

### columns

> **columns**: readonly `GridColDef`\<`any`\>[]

Defined in: [src/types/PeopleTable/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTable/interface.ts#L15)

The column definitions for the table.

***

### getRowId?

> `optional` **getRowId**: `GridRowIdGetter`\<`any`\>

Defined in: [src/types/PeopleTable/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTable/interface.ts#L51)

Function to return the unique identifier for a row.

***

### loading

> **loading**: `boolean`

Defined in: [src/types/PeopleTable/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTable/interface.ts#L20)

If true, the table shows a loading overlay.

***

### onPaginationModelChange()

> **onPaginationModelChange**: (`model`, `details`) => `void`

Defined in: [src/types/PeopleTable/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTable/interface.ts#L35)

Callback fired when the pagination model changes.

#### Parameters

##### model

`GridPaginationModel`

##### details

`GridCallbackDetails`\<`"pagination"`\>

#### Returns

`void`

***

### pageSizeOptions?

> `optional` **pageSizeOptions**: readonly (`number` \| \{ \})[]

Defined in: [src/types/PeopleTable/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTable/interface.ts#L41)

The options for the page size selector.

#### Default

```ts
[5, 10, 20]
```

***

### paginationMeta?

> `optional` **paginationMeta**: `object`

Defined in: [src/types/PeopleTable/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTable/interface.ts#L56)

Additional metadata for pagination, such as hasNextPage flag.

#### hasNextPage?

> `optional` **hasNextPage**: `boolean`

***

### paginationModel

> **paginationModel**: `GridPaginationModel`

Defined in: [src/types/PeopleTable/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTable/interface.ts#L30)

The current pagination state (page and pageSize).

***

### rowCount

> **rowCount**: `number`

Defined in: [src/types/PeopleTable/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTable/interface.ts#L25)

The total number of rows, used for server-side pagination.

***

### rows

> **rows**: readonly `any`[]

Defined in: [src/types/PeopleTable/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTable/interface.ts#L10)

The set of rows to be displayed in the table.

***

### slots?

> `optional` **slots**: `Partial`\<`GridSlotsComponent`\>

Defined in: [src/types/PeopleTable/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTable/interface.ts#L46)

Overridable components (slots) for the DataGrid.
