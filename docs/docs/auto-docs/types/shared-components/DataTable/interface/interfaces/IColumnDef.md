[**talawa-admin**](../../../../../README.md)

***

# Interface: IColumnDef\<T, TValue\>

Defined in: [src/types/shared-components/DataTable/interface.ts:32](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L32)

Generic column definition for DataTable

## Example

```ts
interface User {
  id: string;
  name: string;
}

const columns: ColumnDef<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
];
```

## Type Parameters

### T

`T`

### TValue

`TValue` = `unknown`

## Properties

### accessor

> **accessor**: [`Accessor`](../type-aliases/Accessor.md)\<`T`, `TValue`\>

Defined in: [src/types/shared-components/DataTable/interface.ts:40](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L40)

Accessor to extract cell value

***

### header

> **header**: [`HeaderRender`](../type-aliases/HeaderRender.md)

Defined in: [src/types/shared-components/DataTable/interface.ts:37](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L37)

Header label or render function

***

### id

> **id**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:34](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L34)

Unique column identifier

***

### meta?

> `optional` **meta**: `object`

Defined in: [src/types/shared-components/DataTable/interface.ts:46](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L46)

Optional metadata for future features

#### align?

> `optional` **align**: `"center"` \| `"left"` \| `"right"`

#### ariaLabel?

> `optional` **ariaLabel**: `string`

#### filterable?

> `optional` **filterable**: `boolean`

If true, this column participates in local filtering and/or global search.
Defaults: filterable=true, searchable=true unless set false.

#### filterFn()?

> `optional` **filterFn**: (`row`, `value`) => `boolean`

Custom filter for this column. Return true to keep the row.
value is columnFilters[col.id].

##### Parameters

###### row

`T`

###### value

`unknown`

##### Returns

`boolean`

#### getSearchValue()?

> `optional` **getSearchValue**: (`row`) => `string`

Optional extractor for global search (if the default cell string is not ideal).

##### Parameters

###### row

`T`

##### Returns

`string`

#### searchable?

> `optional` **searchable**: `boolean`

#### sortable?

> `optional` **sortable**: `boolean`

#### sortFn()?

> `optional` **sortFn**: (`a`, `b`) => `number`

##### Parameters

###### a

`T`

###### b

`T`

##### Returns

`number`

#### width?

> `optional` **width**: `string` \| `number`

***

### render()?

> `optional` **render**: (`value`, `row`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/interface.ts:43](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L43)

Optional custom cell renderer

#### Parameters

##### value

`TValue`

##### row

`T`

#### Returns

`ReactNode`
