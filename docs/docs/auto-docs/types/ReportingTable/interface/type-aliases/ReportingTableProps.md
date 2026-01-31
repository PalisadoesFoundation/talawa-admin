[Admin Docs](/)

***

# Type Alias: ReportingTableProps

> **ReportingTableProps** = `object`

Defined in: [src/types/ReportingTable/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ReportingTable/interface.ts#L69)

Props for the ReportingTable component

## Properties

### columns

> **columns**: [`ReportingTableColumn`](ReportingTableColumn.md)[]

Defined in: [src/types/ReportingTable/interface.ts:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ReportingTable/interface.ts#L71)

***

### gridProps?

> `optional` **gridProps**: [`ReportingTableGridProps`](ReportingTableGridProps.md)

Defined in: [src/types/ReportingTable/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ReportingTable/interface.ts#L72)

***

### infiniteProps?

> `optional` **infiniteProps**: [`InfiniteScrollProps`](InfiniteScrollProps.md)

Defined in: [src/types/ReportingTable/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ReportingTable/interface.ts#L74)

Optional InfiniteScroll behavior; when provided, wraps the grid

***

### listProps?

> `optional` **listProps**: `object`

Defined in: [src/types/ReportingTable/interface.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ReportingTable/interface.ts#L76)

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

Defined in: [src/types/ReportingTable/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ReportingTable/interface.ts#L70)
