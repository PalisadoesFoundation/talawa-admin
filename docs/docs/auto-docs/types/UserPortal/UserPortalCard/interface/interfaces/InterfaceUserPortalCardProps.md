[Admin Docs](/)

***

# Interface: InterfaceUserPortalCardProps

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L12)

Props for UserPortalCard — a flexible layout wrapper for User Portal cards.

Layout:
[ imageSlot ] [ children / content ] [ actionsSlot ]

This component centralizes layout, spacing, and density while keeping
all content and text controlled by consuming components.

## Properties

### actionsSlot?

> `optional` **actionsSlot**: `ReactNode`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L18)

(Optional) Right section (buttons, badges, counters)

***

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L26)

(Optional) Accessible label for the card container (i18n required)

***

### children

> **children**: `ReactNode`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L16)

Main content area (required)

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L22)

(Optional) Additional class for the outer container

***

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L24)

(Optional) Test id prefix for unit/e2e testing

***

### imageSlot?

> `optional` **imageSlot**: `ReactNode`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L14)

(Optional) Left section (avatar, logo, thumbnail, icon)

***

### variant?

> `optional` **variant**: `"compact"` \| `"standard"` \| `"expanded"`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L20)

Visual density preset controlling padding and spacing
