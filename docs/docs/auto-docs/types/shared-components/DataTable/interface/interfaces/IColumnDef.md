[**talawa-admin**](../../../../../README.md)

***

# Interface: IColumnDef\<T, TValue\>

Defined in: [src/types/shared-components/DataTable/interface.ts:30](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L30)

Generic column definition for DataTable

## Example

```ts
interface User {
  id: string;
  name: string;
}

const columns: ColumnDef<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name' }
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

Defined in: [src/types/shared-components/DataTable/interface.ts:38](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L38)

Accessor to extract cell value

***

### header

> **header**: [`HeaderRender`](../type-aliases/HeaderRender.md)

Defined in: [src/types/shared-components/DataTable/interface.ts:35](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L35)

Header label or render function

***

### id

> **id**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:32](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L32)

Unique column identifier

***

### meta?

> `optional` **meta**: `object`

Defined in: [src/types/shared-components/DataTable/interface.ts:44](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L44)

Optional metadata for future features

#### filterable?

> `optional` **filterable**: `boolean`

#### sortable?

> `optional` **sortable**: `boolean`

#### width?

> `optional` **width**: `string` \| `number`

***

### render()?

> `optional` **render**: (`value`, `row`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/interface.ts:41](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L41)

Optional custom cell renderer

#### Parameters

##### value

`TValue`

##### row

`T`

#### Returns

`ReactNode`
