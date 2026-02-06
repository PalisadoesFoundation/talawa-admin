[Admin Docs](/)

***

# Interface: InterfaceStatusBadgeProps

Defined in: [src/types/shared-components/StatusBadge/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/StatusBadge/interface.ts#L43)

Props interface for the StatusBadge component.

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/StatusBadge/interface.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/StatusBadge/interface.ts#L55)

Custom aria-label for accessibility (optional, overrides default)

***

### chipVariant?

> `optional` **chipVariant**: `"outlined"` \| `"filled"`

Defined in: [src/types/shared-components/StatusBadge/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/StatusBadge/interface.ts#L49)

The MUI Chip variant (optional)

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/StatusBadge/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/StatusBadge/interface.ts#L57)

Additional CSS classes to apply

***

### clickable?

> `optional` **clickable**: `boolean`

Defined in: [src/types/shared-components/StatusBadge/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/StatusBadge/interface.ts#L63)

Whether the badge is clickable (optional)

***

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/types/shared-components/StatusBadge/interface.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/StatusBadge/interface.ts#L59)

Test ID for component testing (forwarded as data-testid)

***

### icon?

> `optional` **icon**: `ReactNode`

Defined in: [src/types/shared-components/StatusBadge/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/StatusBadge/interface.ts#L53)

Optional icon to display in the badge

***

### label?

> `optional` **label**: `string`

Defined in: [src/types/shared-components/StatusBadge/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/StatusBadge/interface.ts#L51)

Custom label text (optional, overrides i18n)

***

### onClick()?

> `optional` **onClick**: (`event`) => `void`

Defined in: [src/types/shared-components/StatusBadge/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/StatusBadge/interface.ts#L61)

Click handler (optional)

#### Parameters

##### event

`MouseEvent`\<`HTMLDivElement`\>

#### Returns

`void`

***

### size?

> `optional` **size**: [`StatusSize`](../type-aliases/StatusSize.md)

Defined in: [src/types/shared-components/StatusBadge/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/StatusBadge/interface.ts#L47)

The size of the badge (optional, defaults to 'md')

***

### sx?

> `optional` **sx**: `object`

Defined in: [src/types/shared-components/StatusBadge/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/StatusBadge/interface.ts#L65)

Optional MUI sx prop for custom styling

***

### variant

> **variant**: [`StatusVariant`](../type-aliases/StatusVariant.md)

Defined in: [src/types/shared-components/StatusBadge/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/StatusBadge/interface.ts#L45)

The domain-specific status variant
