[Admin Docs](/)

***

# Interface: IColumnDef\<T, TValue\>

Defined in: [src/shared-components/DataTable/types.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L31)

/**
 * Generic column definition for DataTable
 *
 *

## Example

```ts
* interface User {
 *   id: string;
 *   name: string;
 * }
 *
 * const columns: ColumnDef<User>[] = [
 *   { id: 'name', header: 'Name', accessor: 'name' }
 * ];
```

## Type Parameters

### T

`T`

### TValue

`TValue` = `unknown`

## Properties

### accessor

> **accessor**: [`Accessor`](../type-aliases/Accessor.md)\<`T`, `TValue`\>

Defined in: [src/shared-components/DataTable/types.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L39)

Accessor to extract cell value

***

### header

> **header**: [`HeaderRender`](../type-aliases/HeaderRender.md)

Defined in: [src/shared-components/DataTable/types.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L36)

Header label or render function

***

### id

> **id**: `string`

Defined in: [src/shared-components/DataTable/types.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L33)

Unique column identifier

***

### meta?

> `optional` **meta**: `object`

Defined in: [src/shared-components/DataTable/types.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L45)

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

Defined in: [src/shared-components/DataTable/types.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L42)

Optional custom cell renderer

#### Parameters

##### value

`TValue`

##### row

`T`

#### Returns

`ReactNode`
