[Admin Docs](/)

***

# Interface: IColumnDef\<T, TValue\>

Defined in: [src/types/shared-components/DataTable/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L32)

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

Defined in: [src/types/shared-components/DataTable/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L40)

Accessor to extract cell value

***

### header

> **header**: [`HeaderRender`](../type-aliases/HeaderRender.md)

Defined in: [src/types/shared-components/DataTable/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L37)

Header label or render function

***

### id

> **id**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L34)

Unique column identifier

***

### meta?

> `optional` **meta**: `object`

Defined in: [src/types/shared-components/DataTable/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L46)

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

Defined in: [src/types/shared-components/DataTable/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L43)

Optional custom cell renderer

#### Parameters

##### value

`TValue`

##### row

`T`

#### Returns

`ReactNode`
