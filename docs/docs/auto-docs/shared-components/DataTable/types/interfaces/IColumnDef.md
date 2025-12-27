[Admin Docs](/)

***

# Interface: IColumnDef\<T, TValue\>

Defined in: [src/shared-components/DataTable/types.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L29)

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

Defined in: [src/shared-components/DataTable/types.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L37)

Accessor to extract cell value

***

### header

> **header**: [`HeaderRender`](../type-aliases/HeaderRender.md)

Defined in: [src/shared-components/DataTable/types.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L34)

Header label or render function

***

### id

> **id**: `string`

Defined in: [src/shared-components/DataTable/types.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L31)

Unique column identifier

***

### meta?

> `optional` **meta**: `object`

Defined in: [src/shared-components/DataTable/types.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L43)

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

Defined in: [src/shared-components/DataTable/types.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L40)

Optional custom cell renderer

#### Parameters

##### value

`TValue`

##### row

`T`

#### Returns

`ReactNode`
