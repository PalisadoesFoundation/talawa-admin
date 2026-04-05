[Admin Docs](/)

***

# Interface: InterfaceButtonProps

Defined in: [src/shared-components/Button/Button.types.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L32)

Props for the shared Button wrapper.
Extends react-bootstrap Button props and adds loading, icon, and layout helpers.

## Extends

- `Omit`\<`BootstrapButtonProps`, `"size"` \| `"variant"`\>

## Properties

### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [src/shared-components/Button/Button.types.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L41)

Stretch to the parent width.

***

### icon?

> `optional` **icon**: `ReactNode`

Defined in: [src/shared-components/Button/Button.types.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L47)

Optional leading/trailing icon.

***

### iconPosition?

> `optional` **iconPosition**: [`ButtonIconPosition`](../type-aliases/ButtonIconPosition.md)

Defined in: [src/shared-components/Button/Button.types.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L49)

Placement of the icon relative to the text.

***

### isLoading?

> `optional` **isLoading**: `boolean`

Defined in: [src/shared-components/Button/Button.types.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L43)

Show the loading spinner and disable interactions.

***

### loadingText?

> `optional` **loadingText**: `ReactNode`

Defined in: [src/shared-components/Button/Button.types.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L45)

Optional text to display while loading; falls back to children.

***

### size?

> `optional` **size**: [`ButtonSize`](../type-aliases/ButtonSize.md)

Defined in: [src/shared-components/Button/Button.types.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L39)

Size token. `md` is the default; `xl` uses custom styling.

***

### variant?

> `optional` **variant**: [`ButtonVariant`](../type-aliases/ButtonVariant.md)

Defined in: [src/shared-components/Button/Button.types.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L37)

Visual variant (e.g., primary, outline-primary, danger).
