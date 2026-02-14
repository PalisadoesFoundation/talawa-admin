[Admin Docs](/)

***

# Interface: InterfaceButtonProps

Defined in: [src/shared-components/Button/Button.types.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L31)

Props for the shared Button wrapper.
Extends react-bootstrap Button props and adds loading, icon, and layout helpers.

## Extends

- `Omit`\<`BootstrapButtonProps`, `"size"` \| `"variant"`\>

## Properties

### fullWidth?

> `optional` **fullWidth**: `boolean`

Defined in: [src/shared-components/Button/Button.types.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L40)

Stretch to the parent width.

***

### icon?

> `optional` **icon**: `ReactNode`

Defined in: [src/shared-components/Button/Button.types.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L46)

Optional leading/trailing icon.

***

### iconPosition?

> `optional` **iconPosition**: [`ButtonIconPosition`](../type-aliases/ButtonIconPosition.md)

Defined in: [src/shared-components/Button/Button.types.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L48)

Placement of the icon relative to the text.

***

### isLoading?

> `optional` **isLoading**: `boolean`

Defined in: [src/shared-components/Button/Button.types.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L42)

Show the loading spinner and disable interactions.

***

### loadingText?

> `optional` **loadingText**: `ReactNode`

Defined in: [src/shared-components/Button/Button.types.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L44)

Optional text to display while loading; falls back to children.

***

### size?

> `optional` **size**: [`ButtonSize`](../type-aliases/ButtonSize.md)

Defined in: [src/shared-components/Button/Button.types.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L38)

Size token. `md` is the default; `xl` uses custom styling.

***

### variant?

> `optional` **variant**: [`ButtonVariant`](../type-aliases/ButtonVariant.md)

Defined in: [src/shared-components/Button/Button.types.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Button/Button.types.ts#L36)

Visual variant (e.g., primary, outline-primary, danger).
