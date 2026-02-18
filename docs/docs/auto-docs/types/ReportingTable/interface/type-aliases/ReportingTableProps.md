[Admin Docs](/)

***

# Type Alias: ReportingTableProps

> **ReportingTableProps** = `object`

Defined in: [src/types/ReportingTable/interface.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ReportingTable/interface.ts#L76)

Props for the ReportingTable component

## Properties

### columns

> **columns**: [`ReportingTableColumn`](ReportingTableColumn.md)[]

Defined in: [src/types/ReportingTable/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ReportingTable/interface.ts#L78)

***

### gridProps?

> `optional` **gridProps**: [`ReportingTableGridProps`](ReportingTableGridProps.md)

Defined in: [src/types/ReportingTable/interface.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ReportingTable/interface.ts#L79)

***

### infiniteProps?

> `optional` **infiniteProps**: [`InfiniteScrollProps`](InfiniteScrollProps.md)

Defined in: [src/types/ReportingTable/interface.ts:81](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ReportingTable/interface.ts#L81)

Optional InfiniteScroll behavior; when provided, wraps the grid

***

### listProps?

> `optional` **listProps**: `object`

Defined in: [src/types/ReportingTable/interface.ts:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ReportingTable/interface.ts#L83)

Optional props applied to the InfiniteScroll container

#### className?

> `optional` **className**: `string`

#### data-testid?

> `optional` **data-testid**: `string`

#### endMessage?

> `optional` **endMessage**: `React.ReactNode`

#### loader?

> `optional` **loader**: `React.ReactNode`

#### scrollThreshold?

> `optional` **scrollThreshold**: `number`

#### style?

> `optional` **style**: `React.CSSProperties`

***

### rows

> **rows**: readonly [`ReportingRow`](ReportingRow.md)[]

Defined in: [src/types/ReportingTable/interface.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ReportingTable/interface.ts#L77)
