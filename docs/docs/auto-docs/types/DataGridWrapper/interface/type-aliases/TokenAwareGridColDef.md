[Admin Docs](/)

***

# Type Alias: TokenAwareGridColDef\<TRow, TValue, TFormattedValue\>

> **TokenAwareGridColDef**\<`TRow`, `TValue`, `TFormattedValue`\> = `Omit`\<`GridColDef`\<`TRow`, `TValue`, `TFormattedValue`\>, `"width"` \| `"minWidth"` \| `"maxWidth"`\> & `object`

Defined in: [src/types/DataGridWrapper/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L24)

Extended column definition that accepts design tokens for width properties.

MUI DataGrid requires numeric values for width, minWidth, and maxWidth.
This type allows using spacing token names (e.g., 'space-15') which are
converted to pixel values by DataGridWrapper before passing to MUI.

## Type Declaration

### maxWidth?

> `optional` **maxWidth**: `number` \| [`SpacingToken`](../../../../utils/tokenValues/type-aliases/SpacingToken.md)

Maximum column width - accepts number (pixels) or spacing token name

### minWidth?

> `optional` **minWidth**: `number` \| [`SpacingToken`](../../../../utils/tokenValues/type-aliases/SpacingToken.md)

Minimum column width - accepts number (pixels) or spacing token name

### width?

> `optional` **width**: `number` \| [`SpacingToken`](../../../../utils/tokenValues/type-aliases/SpacingToken.md)

Column width - accepts number (pixels) or spacing token name

## Type Parameters

### TRow

`TRow` *extends* `GridValidRowModel` = `GridValidRowModel`

### TValue

`TValue` = `unknown`

### TFormattedValue

`TFormattedValue` = `TValue`

## Example

```tsx
const columns: TokenAwareGridColDef[] = [
  { field: 'name', headerName: 'Name', minWidth: 'space-15' }, // 150px
  { field: 'email', headerName: 'Email', width: 'space-17' },  // 220px
];
```
