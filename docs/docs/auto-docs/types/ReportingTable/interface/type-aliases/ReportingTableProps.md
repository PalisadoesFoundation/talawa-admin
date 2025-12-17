[Admin Docs](/)

***

# Type Alias: ReportingTableProps

> **ReportingTableProps** = `object`

Defined in: src/types/ReportingTable/interface.ts:64

Props for the ReportingTable component

## Properties

### columns

> **columns**: [`ReportingTableColumn`](ReportingTableColumn.md)[]

Defined in: src/types/ReportingTable/interface.ts:66

***

### gridProps?

> `optional` **gridProps**: [`ReportingTableGridProps`](ReportingTableGridProps.md)

Defined in: src/types/ReportingTable/interface.ts:67

***

### infiniteProps?

> `optional` **infiniteProps**: [`InfiniteScrollProps`](InfiniteScrollProps.md)

Defined in: src/types/ReportingTable/interface.ts:69

Optional InfiniteScroll behavior; when provided, wraps the grid

***

### listProps?

> `optional` **listProps**: `object`

Defined in: src/types/ReportingTable/interface.ts:71

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

Defined in: src/types/ReportingTable/interface.ts:65
